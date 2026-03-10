import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import {
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Shield,
  Activity,
  Globe,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'
import NotificationCenter from '../../components/NotificationCenter'

export default function SuperAdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: stats } = useQuery('super-admin-stats', async () => {
    const response = await apiClient.get('/super-admin/dashboard/stats')
    return response.data
  }, {
    retry: false,
    onError: () => {
      // Mock data
      return {
        total_schools: 0,
        total_students: 0,
        total_teachers: 0,
        attendance_rate: 0,
        incident_count: 0,
        system_health: 'healthy',
        compliance_score: 0,
      }
    }
  })

  const kpis = [
    {
      title: 'إجمالي المدارس',
      value: stats?.total_schools || 0,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      path: '/super-admin/schools',
    },
    {
      title: 'إجمالي الطلاب',
      value: stats?.total_students || 0,
      icon: Users,
      color: 'from-green-500 to-green-600',
      path: '/super-admin/students',
    },
    {
      title: 'إجمالي المدرسين',
      value: stats?.total_teachers || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      path: '/super-admin/teachers',
    },
    {
      title: 'معدل الحضور',
      value: `${stats?.attendance_rate || 0}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      path: '/super-admin/attendance',
    },
    {
      title: 'الحوادث',
      value: stats?.incident_count || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      path: '/super-admin/incidents',
    },
    {
      title: 'نقاط الامتثال',
      value: `${stats?.compliance_score || 0}%`,
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      path: '/super-admin/compliance',
    },
  ]

  const systemHealth = stats?.system_health || 'healthy'
  const healthColor = systemHealth === 'healthy' ? 'green' : systemHealth === 'warning' ? 'yellow' : 'red'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">لوحة تحكم الوزارة</h1>
              <p className="text-white/90">مرحباً، {user?.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl flex items-center gap-2`}>
                <Activity className={`text-${healthColor}-300`} size={20} />
                <span className="text-white font-bold">حالة النظام: {systemHealth === 'healthy' ? 'سليم' : systemHealth === 'warning' ? 'تحذير' : 'خطأ'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <button
                key={index}
                onClick={() => navigate(kpi.path)}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-700">{kpi.title}</p>
              </button>
            )
          })}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Heatmap */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">خريطة الحضور</h2>
              <BarChart3 className="text-primary-600" size={24} />
            </div>
            <div className="text-center py-12 text-gray-500">
              <p>خريطة الحرارة ستظهر هنا</p>
              <p className="text-sm mt-2">(Aggregated data only - no student names)</p>
            </div>
          </div>

          {/* Transport Efficiency */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">كفاءة النقل</h2>
              <Globe className="text-green-600" size={24} />
            </div>
            <div className="text-center py-12 text-gray-500">
              <p>إحصائيات النقل ستظهر هنا</p>
              <p className="text-sm mt-2">(Aggregated data only)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/super-admin/schools')}
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Building2 className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">المدارس</p>
            </button>
            <button
              onClick={() => navigate('/super-admin/analytics')}
              className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">التحليلات</p>
            </button>
            <button
              onClick={() => navigate('/super-admin/compliance')}
              className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Shield className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">الامتثال</p>
            </button>
            <button
              onClick={() => navigate('/super-admin/broadcast')}
              className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <AlertCircle className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">بث عاجل</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

