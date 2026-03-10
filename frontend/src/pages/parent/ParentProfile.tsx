import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import { authAPI } from '../../api'
import { ArrowRight, User, Mail, Phone, Edit, Bell, Lock, LogOut, Shield, Globe, Clock, Users } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'
import toast from 'react-hot-toast'

export default function ParentProfile() {
  const navigate = useNavigate()
  const { user, logout, setAuth } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  })

  // Fetch current user data
  const { data: currentUser, refetch } = useQuery(
    'current-user',
    () => authAPI.getCurrentUser(),
    {
      enabled: !!user,
      onSuccess: (data) => {
        setEditData({
          full_name: data.full_name || '',
          phone: data.phone || '',
        })
      },
    }
  )

  // Fetch children count
  const { data: children } = useQuery(
    'my-students',
    () => studentsAPI.getByParent(user?.id || 0),
    { enabled: !!user?.id }
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('تم تسجيل الخروج بنجاح')
  }

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('تم تحديث الملف الشخصي بنجاح')
      setIsEditing(false)
      refetch()
    } catch (error: any) {
      toast.error(error.message || 'فشل تحديث الملف الشخصي')
    }
  }

  const displayUser = currentUser || user
  const initials = displayUser?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">الملف الشخصي</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-card-lg flex items-center justify-center shadow-card">
              <span className="text-white font-bold text-2xl">{initials}</span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  className="text-xl font-bold text-gray-900 bg-gray-50 border-2 border-teal-200 rounded-lg px-3 py-2 w-full mb-2"
                  value={editData.full_name}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900">{displayUser?.full_name}</h2>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {displayUser?.role === 'parent' ? 'ولي أمر' : displayUser?.role}
              </p>
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave()
                } else {
                  setIsEditing(true)
                }
              }}
              className="p-3 hover:bg-teal-50 rounded-xl transition-colors border-2 border-teal-200"
            >
              <Edit size={20} className="text-teal-600" />
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-soft">
                <Mail size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-medium mb-1">البريد الإلكتروني</p>
                <p className="text-sm font-bold text-gray-900">{displayUser?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-soft">
                <Phone size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-medium mb-1">رقم الهاتف</p>
                {isEditing ? (
                  <input
                    type="tel"
                    className="text-sm font-bold text-gray-900 bg-white border-2 border-teal-200 rounded-lg px-3 py-1 w-full"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-bold text-gray-900">
                    {displayUser?.phone || 'غير متوفر'}
                  </p>
                )}
              </div>
            </div>

            {displayUser?.created_at && (
              <div className="flex items-center gap-4 p-4 bg-sand-100 rounded-xl border border-sand-200">
                <div className="w-12 h-12 bg-sand-300 rounded-xl flex items-center justify-center shadow-soft">
                  <Clock size={20} className="text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium mb-1">تاريخ التسجيل</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(displayUser.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        {children && children.length > 0 && (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">الإحصائيات</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-teal-600" />
                  <span className="text-sm font-medium text-gray-700">الأطفال</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{children.length}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={20} className="text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">الحالة</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">نشط</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/parent/notifications')}
            className="w-full bg-white rounded-card-lg shadow-card border-2 border-gray-200 hover:border-teal-400 p-4 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Bell size={20} className="text-teal-600" />
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">الإشعارات</p>
                <p className="text-xs text-gray-600">إدارة الإشعارات والتنبيهات</p>
              </div>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </button>

          <button
            onClick={() => navigate('/parent/privacy')}
            className="w-full bg-white rounded-card-lg shadow-card border-2 border-gray-200 hover:border-emerald-400 p-4 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">الخصوصية</p>
                <p className="text-xs text-gray-600">إعدادات الخصوصية والبيانات</p>
              </div>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </button>

          <button
            onClick={() => navigate('/parent')}
            className="w-full bg-white rounded-card-lg shadow-card border-2 border-gray-200 hover:border-teal-400 p-4 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-teal-600" />
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">الأطفال</p>
                <p className="text-xs text-gray-600">إدارة حسابات الأطفال</p>
              </div>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </button>

          <button className="w-full bg-white rounded-card-lg shadow-card border-2 border-gray-200 hover:border-gray-400 p-4 flex items-center justify-between transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Globe size={20} className="text-gray-600" />
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">اللغة</p>
                <p className="text-xs text-gray-600">العربية / English</p>
              </div>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-status-action to-red-600 rounded-card-lg p-4 border-2 border-red-400 hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-3 text-white font-bold transition-all shadow-card hover:shadow-elevated"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">أمانتاك v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">نظام إدارة المدرسة وتتبع سلامة الطلاب</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}
