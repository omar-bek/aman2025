import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authAPI } from '../../api'
import { teacherDashboardAPI } from '../../api/teacher'
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  LogOut,
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Bell,
  Settings,
  Loader,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

export default function TeacherProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  })

  // Fetch current user data
  const { data: currentUser, isLoading } = useQuery(
    'current-user',
    () => authAPI.getCurrentUser(),
    {
      enabled: !!user,
      onSuccess: (data) => {
        setEditData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          email: data.email || '',
        })
      },
    }
  )

  // Fetch teacher stats
  const { data: teacherStats } = useQuery(
    'teacher-profile-stats',
    async () => {
      try {
        const response = await teacherDashboardAPI.getStats()
        return response.data
      } catch (error) {
        return null
      }
    },
    { enabled: !!user && user.role === 'teacher' }
  )

  const updateProfileMutation = useMutation(
    async (data: { full_name?: string; phone?: string; email?: string }) => {
      const response = await apiClient.patch('/auth/profile', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('current-user')
        toast.success('تم تحديث الملف الشخصي بنجاح')
        setIsEditing(false)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل تحديث الملف الشخصي')
      }
    }
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('تم تسجيل الخروج بنجاح')
  }

  const handleSave = () => {
    updateProfileMutation.mutate(editData)
  }

  const handleCancel = () => {
    if (currentUser) {
      setEditData({
        full_name: currentUser.full_name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
      })
    }
    setIsEditing(false)
  }

  const displayUser = currentUser || user
  const initials = displayUser?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'T'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <Loader className="animate-spin text-teal-600" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - UAE Premium Design */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="العودة"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
                <p className="text-sm text-gray-600 mt-1">إدارة معلوماتك الشخصية</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Edit size={16} />
                تعديل
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card-lg flex items-center justify-center shadow-elevated">
              <span className="text-white font-bold text-3xl">{initials}</span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    placeholder="الاسم الكامل"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isLoading}
                      className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {updateProfileMutation.isLoading ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      حفظ
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-sand-100 text-gray-700 rounded-card text-sm font-medium hover:bg-sand-200 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{displayUser?.full_name}</h2>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <GraduationCap size={16} className="text-teal-600" />
                    مدرس
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-6 border-t border-sand-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-card flex items-center justify-center">
                <Mail className="text-emerald-600" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{displayUser?.email || 'غير متوفر'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-card flex items-center justify-center">
                <Phone className="text-teal-600" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
                {isEditing ? (
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="+971 XX XXX XXXX"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{displayUser?.phone || 'غير متوفر'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {teacherStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-emerald-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{teacherStats.students_today || 0}</span>
              </div>
              <p className="text-xs text-gray-600">الطلاب</p>
            </div>
            <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="text-teal-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{teacherStats.assignments_today || 0}</span>
              </div>
              <p className="text-xs text-gray-600">الواجبات</p>
            </div>
            <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-amber-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{teacherStats.pending_evaluations || 0}</span>
              </div>
              <p className="text-xs text-gray-600">تقييمات</p>
            </div>
            <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <Bell className="text-blue-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{teacherStats.unread_messages || 0}</span>
              </div>
              <p className="text-xs text-gray-600">رسائل</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/teacher/notifications')}
              className="w-full flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200 hover:bg-sand-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="text-teal-600" size={20} />
                <span className="font-medium text-gray-900">الإشعارات</span>
              </div>
              <ArrowRight className="text-gray-400" size={18} />
            </button>
            <button
              onClick={() => navigate('/teacher')}
              className="w-full flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200 hover:bg-sand-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="text-teal-600" size={20} />
                <span className="font-medium text-gray-900">الإعدادات</span>
              </div>
              <ArrowRight className="text-gray-400" size={18} />
            </button>
            <button
              onClick={() => navigate('/teacher/attendance')}
              className="w-full flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200 hover:bg-sand-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="text-teal-600" size={20} />
                <span className="font-medium text-gray-900">تسجيل الحضور</span>
              </div>
              <ArrowRight className="text-gray-400" size={18} />
            </button>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">الأمان والخصوصية</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200">
              <div className="flex items-center gap-3">
                <Shield className="text-emerald-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">حساب آمن</p>
                  <p className="text-xs text-gray-600">جميع بياناتك محمية</p>
                </div>
              </div>
              <CheckCircle className="text-emerald-500" size={20} />
            </div>
            <button
              onClick={() => navigate('/teacher')}
              className="w-full flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200 hover:bg-sand-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="text-teal-600" size={20} />
                <span className="font-medium text-gray-900">تغيير كلمة المرور</span>
              </div>
              <ArrowRight className="text-gray-400" size={18} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-700 rounded-card-lg border-2 border-red-200 hover:bg-red-100 transition-colors font-medium"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}

