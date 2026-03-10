import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Bus, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'

export default function DriverLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authAPI.login({
        email: formData.username,
        password: formData.password
      })
      if (response.user?.role !== 'driver') {
        throw new Error('هذا الحساب ليس لحساب سائق')
      }
      setAuth(response.user, response.token)
      toast.success('مرحباً، ' + response.user.name)
      navigate('/driver/checklist')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'اسم المستخدم أو كلمة المرور غير صحيحة')
      toast.error('فشل تسجيل الدخول')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card-lg flex items-center justify-center mx-auto mb-4 shadow-elevated">
            <Bus className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل دخول السائق</h1>
          <p className="text-gray-600">نظام النقل المدرسي الآمن</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-card-lg p-8 border border-sand-200 shadow-elevated">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-4 bg-sand-50 border-2 border-sand-300 rounded-card text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="أدخل اسم المستخدم"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-4 bg-sand-50 border-2 border-sand-300 rounded-card text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="أدخل كلمة المرور"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-teal-600 text-white rounded-card text-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-card"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Safety Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-card border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">تنبيه أمان</p>
                <p className="text-xs text-gray-600">
                  تأكد من فحص المركبة قبل بدء الرحلة. سلامة الطلاب أولويتنا.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            نظام آمن ومتوافق مع معايير دولة الإمارات
          </p>
        </div>
      </div>
    </div>
  )
}


