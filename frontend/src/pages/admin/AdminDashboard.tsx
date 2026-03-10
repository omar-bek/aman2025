import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import { studentsAPI } from '../../api'
import {
  Users,
  GraduationCap,
  Bus,
  ClipboardList,
  Bell,
  BarChart3,
  AlertCircle,
  TrendingUp,
  FileText,
  MessageSquare,
  Shield,
  LayoutDashboard,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'
import NotificationCenter from '../../components/NotificationCenter'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: students } = useQuery('students', studentsAPI.getAll)
  const { data: stats } = useQuery('admin-stats', async () => {
    const response = await apiClient.get('/admin/dashboard/stats')
    return response.data
  }, {
    retry: false,
    onError: () => {
      // Use mock data if API fails
      return {
        total_students: students?.length || 0,
        total_teachers: 0,
        total_classes: 0,
        total_buses: 0,
        pending_approvals: 0,
        unread_complaints: 0,
        attendance_rate: 0,
        parent_engagement: 0,
      }
    }
  })

  const kpis = [
    {
      title: 'إجمالي الطلاب',
      value: stats?.total_students || students?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/students',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'المدرسين',
      value: stats?.total_teachers || 0,
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      path: '/admin/teachers',
      change: '+2',
      trend: 'up'
    },
    {
      title: 'الصفوف',
      value: stats?.total_classes || 0,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      path: '/admin/classes',
      change: '0',
      trend: 'neutral'
    },
    {
      title: 'الحافلات',
      value: stats?.total_buses || 0,
      icon: Bus,
      color: 'from-orange-500 to-orange-600',
      path: '/buses',
      change: '+1',
      trend: 'up'
    },
    {
      title: 'موافقات معلقة',
      value: stats?.pending_approvals || 0,
      icon: ClipboardList,
      color: 'from-yellow-500 to-yellow-600',
      path: '/admin/approvals',
      change: '-3',
      trend: 'down'
    },
    {
      title: 'شكاوى غير مقروءة',
      value: stats?.unread_complaints || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      path: '/admin/complaints',
      change: '+2',
      trend: 'up'
    },
  ]

  const attendanceRate = stats?.attendance_rate || 0
  const parentEngagement = stats?.parent_engagement || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">لوحة تحكم الإدارة</h1>
              <p className="text-white/90">مرحباً، {user?.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Command Center Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">مركز قيادة الإدارة المدرسية</h2>
              <p className="text-teal-100 mb-4">لوحة تحكم شاملة لإدارة العمليات اليومية، الحوادث، الموافقات والتقارير</p>
              <button
                onClick={() => navigate('/admin/command-center')}
                className="px-6 py-3 bg-white text-teal-600 rounded-xl font-bold hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <LayoutDashboard className="inline-block ml-2" size={20} />
                فتح مركز القيادة
              </button>
            </div>
            <LayoutDashboard className="w-24 h-24 text-white/20" size={96} />
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <button
                key={index}
                onClick={() => navigate(kpi.path)}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 hover:border-primary-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {kpi.trend === 'up' && <TrendingUp className="text-green-500" size={16} />}
                      <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-700">{kpi.title}</p>
              </button>
            )
          })}
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Rate */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">نسبة الحضور</h2>
              <BarChart3 className="text-primary-600" size={24} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">المعدل العام</span>
                  <span className="text-2xl font-bold text-primary-600">{attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Engagement */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">تفاعل أولياء الأمور</h2>
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل التفاعل</span>
                  <span className="text-2xl font-bold text-green-600">{parentEngagement}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${parentEngagement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <button
              onClick={() => navigate('/students')}
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Users className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">إدارة الطلاب</p>
            </button>
            <button
              onClick={() => navigate('/admin/teachers')}
              className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <GraduationCap className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">إدارة المدرسين</p>
            </button>
            <button
              onClick={() => navigate('/admin/classes')}
              className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Users className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">إدارة الصفوف</p>
            </button>
            <button
              onClick={() => navigate('/buses')}
              className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Bus className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">إدارة الحافلات</p>
            </button>
            <button
              onClick={() => navigate('/admin/reports')}
              className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">التقارير</p>
            </button>
            <button
              onClick={() => navigate('/admin/audit-logs')}
              className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Shield className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">سجل التدقيق</p>
            </button>
            <button
              onClick={() => navigate('/admin/command-center')}
              className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <LayoutDashboard className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">مركز القيادة</p>
            </button>
            <button
              onClick={() => navigate('/attendance')}
              className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ClipboardList className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">الحضور</p>
            </button>
            <button
              onClick={() => navigate('/pickup')}
              className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Users className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">الاستلام</p>
            </button>
            <button
              onClick={() => navigate('/dismissal')}
              className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FileText className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">المغادرة</p>
            </button>
            <button
              onClick={() => navigate('/academic')}
              className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">الأكاديمي</p>
            </button>
            <button
              onClick={() => navigate('/behavior')}
              className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <AlertCircle className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">السلوك</p>
            </button>
            <button
              onClick={() => navigate('/activities')}
              className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MessageSquare className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">الأنشطة</p>
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="p-4 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Bell className="mx-auto mb-2" size={24} />
              <p className="text-sm font-bold">الإشعارات</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

