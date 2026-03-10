import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'
import { UserPlus, Mail, Lock, Phone, User } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    full_name: '',
    role: 'parent' as 'parent' | 'teacher' | 'admin' | 'staff' | 'driver',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة')
      return
    }

    setLoading(true)

    try {
      await authAPI.register({
        email: formData.email,
        phone: formData.phone,
        full_name: formData.full_name,
        role: formData.role,
        password: formData.password,
      })
      toast.success('تم التسجيل بنجاح')
      navigate('/login')
    } catch (error: any) {
      console.error('Register error:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'فشل التسجيل'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">أمانتاك</h1>
          <p className="text-gray-600">إنشاء حساب جديد</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="text-primary-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">التسجيل</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <User size={16} className="inline ml-2" />
                الاسم الكامل
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

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
              />
            </div>

            <div>
              <label className="label">
                <Phone size={16} className="inline ml-2" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="label">الدور</label>
              <select
                className="input-field"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                required
              >
                <option value="parent">ولي أمر</option>
                <option value="teacher">معلم</option>
                <option value="staff">موظف</option>
                <option value="driver">سائق</option>
              </select>
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
                minLength={6}
              />
            </div>

            <div>
              <label className="label">تأكيد كلمة المرور</label>
              <input
                type="password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

