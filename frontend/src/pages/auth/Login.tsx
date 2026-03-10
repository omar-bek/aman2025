import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)

      // Normalize role to string (handle enum objects)
      let userRole: string
      if (typeof response.user.role === 'string') {
        userRole = response.user.role
      } else if (response.user.role && typeof response.user.role === 'object' && 'value' in response.user.role) {
        userRole = (response.user.role as any).value
      } else {
        userRole = String(response.user.role)
      }
      
      setAuth(response.user, response.token)
      toast.success('تم تسجيل الدخول بنجاح')
      
      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        parent: '/parent',
        teacher: '/teacher',
        admin: '/admin',
        driver: '/driver',
        student: '/student',
        super_admin: '/super-admin',
        staff: '/staff', // Staff uses dedicated staff dashboard
        government_admin: '/government', // Government/Authority Admin
        authority_admin: '/government', // Authority Admin
      }
      
      const redirectPath = roleRedirects[userRole] || '/'
      navigate(redirectPath, { replace: true })
    } catch (error: any) {
      const err = error.response?.data
      const errorMessage =
        (typeof err?.detail === 'string' ? err.detail : null) ||
        (typeof err?.message === 'string' ? err.message : null) ||
        (Array.isArray(err?.errors) && err.errors[0]?.message ? err.errors[0].message : null) ||
        error.message ||
        'فشل تسجيل الدخول'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" style={{ minHeight: '100vh', direction: 'rtl' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">أمانتاك</h1>
          <p className="text-gray-600">نظام إدارة المدرسة وتتبع سلامة الطلاب</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="text-primary-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <Mail size={16} className="inline ml-2" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="label">
                <Lock size={16} className="inline ml-2" />
                كلمة المرور
              </label>
              <input
                type="password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

