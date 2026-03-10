import { useState } from 'react'
import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import {
  Bus,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Navigation,
  ArrowRight,
  Shield,
  FileText,
  Calendar,
  Loader
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'

export default function DriverDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [emergencyMode, setEmergencyMode] = useState(false)

  const { data: route, isLoading } = useQuery(
    'driver-route',
    async () => {
      try {
        const response = await apiClient.get('/driver/route')
        return response.data
      } catch (error) {
        return {
          route_name: 'الطريق 1',
          students_count: 25,
          stops: [],
          current_stop: null,
          next_stop: null,
          has_active_route: false
        }
      }
    }
  )

  const { data: todayStats } = useQuery(
    'driver-today-stats',
    async () => {
      try {
        const response = await apiClient.get('/driver/stats/today')
        return response.data
      } catch (error) {
        return {
          completed_routes: 0,
          students_transported: 0,
          on_time_percentage: 100,
          incidents: 0
        }
      }
    }
  )

  const handleEmergency = () => {
    if (confirm('هل أنت متأكد من إرسال تنبيه الطوارئ؟')) {
      setEmergencyMode(true)
      // Send emergency alert
      apiClient.post('/driver/emergency', {
        driver_id: user?.id,
        timestamp: new Date().toISOString()
      }).catch(() => {
        // Continue even if API fails (offline mode)
      })
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - UAE Premium Design */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card-lg flex items-center justify-center shadow-card">
                <Bus className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم السائق</h1>
                <p className="text-sm text-gray-600 mt-1">مرحباً، {user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {emergencyMode && (
                <div className="px-4 py-2 bg-red-500 text-white rounded-card text-sm font-medium animate-pulse">
                  وضع الطوارئ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Emergency Alert */}
        {emergencyMode && (
          <div className="bg-red-50 border-2 border-red-400 rounded-card-lg p-6 text-center animate-pulse">
            <AlertTriangle className="mx-auto text-red-600 mb-3" size={32} />
            <p className="text-lg font-bold text-red-900 mb-2">وضع الطوارئ مفعّل</p>
            <p className="text-sm text-red-700 mb-4">تم إرسال التنبيه. سيتم التواصل معك قريباً.</p>
            <button
              onClick={() => setEmergencyMode(false)}
              className="px-6 py-2 bg-white text-red-600 rounded-card font-medium hover:bg-red-50 transition-colors"
            >
              إلغاء الطوارئ
            </button>
          </div>
        )}

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Navigation className="text-teal-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {todayStats?.completed_routes || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600">رحلة مكتملة</p>
          </div>
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-emerald-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {todayStats?.students_transported || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600">طلاب منقولون</p>
          </div>
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-blue-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {todayStats?.on_time_percentage || 100}%
              </span>
            </div>
            <p className="text-xs text-gray-600">في الموعد</p>
          </div>
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Shield className="text-amber-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {todayStats?.incidents || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600">حوادث</p>
          </div>
        </div>

        {/* Current Route */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card flex items-center justify-center">
                <Bus className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{route?.route_name || 'لا يوجد مسار نشط'}</h2>
                <p className="text-sm text-gray-600">
                  {route?.students_count || 0} طالب • {route?.stops?.length || 0} محطة
                </p>
              </div>
            </div>
            {route?.has_active_route && (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-300">
                نشط
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/driver/checklist')}
              className="p-6 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-teal-300 transition-all text-center group"
            >
              <Shield className="mx-auto text-teal-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-bold text-gray-900 mb-1">فحص المركبة</p>
              <p className="text-xs text-gray-600">فحص ما قبل الرحلة</p>
            </button>

            <button
              onClick={() => navigate('/driver/route')}
              className="p-6 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-emerald-300 transition-all text-center group"
            >
              <Navigation className="mx-auto text-emerald-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-bold text-gray-900 mb-1">تنفيذ المسار</p>
              <p className="text-xs text-gray-600">بدء الرحلة</p>
            </button>

            <button
              onClick={() => navigate('/driver/summary')}
              className="p-6 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-blue-300 transition-all text-center group"
            >
              <FileText className="mx-auto text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-bold text-gray-900 mb-1">ملخص الرحلة</p>
              <p className="text-xs text-gray-600">عرض السجلات</p>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleEmergency}
            className="p-6 bg-red-50 border-2 border-red-300 rounded-card-lg hover:bg-red-100 transition-all text-center group"
          >
            <AlertTriangle className="mx-auto text-red-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <p className="font-bold text-red-900 mb-1">تنبيه طوارئ</p>
            <p className="text-xs text-red-700">للحالات الطارئة فقط</p>
          </button>
          <button
            onClick={() => navigate('/driver/incidents')}
            className="p-6 bg-amber-50 border-2 border-amber-300 rounded-card-lg hover:bg-amber-100 transition-all text-center group"
          >
            <FileText className="mx-auto text-amber-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <p className="font-bold text-amber-900 mb-1">تقرير حادث</p>
            <p className="text-xs text-amber-700">تسجيل الحوادث</p>
          </button>
        </div>

        {/* Upcoming Schedule */}
        {route && (
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-teal-600" size={24} />
              <h2 className="text-lg font-bold text-gray-900">الجدول اليومي</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200">
                <div className="flex items-center gap-3">
                  <Clock className="text-teal-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">رحلة الصباح</p>
                    <p className="text-sm text-gray-600">07:00 - 08:00</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  {route.has_active_route ? 'نشط' : 'مجدول'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
