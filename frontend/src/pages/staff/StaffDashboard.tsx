import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import { studentsAPI, busesAPI, staffAPI } from '../../api'
import { 
  Users, 
  Bus, 
  Calendar, 
  Bell, 
  CheckCircle,
  UserCheck,
  FileText,
  Shield,
  GraduationCap,
  ArrowRight,
  Activity,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationCenter from '../../components/NotificationCenter'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

export default function StaffDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Fetch dashboard stats
  const { data: stats } = useQuery(
    'staff-dashboard-stats',
    staffAPI.getDashboardStats,
    {
      enabled: user?.role === 'staff' || user?.role === 'admin',
      retry: false,
      refetchInterval: 60000, // Refetch every minute
      onError: (error) => {
        console.error('Error fetching dashboard stats:', error)
      }
    }
  )

  // Fetch attendance trend
  const { data: attendanceTrend } = useQuery(
    'staff-attendance-trend',
    () => staffAPI.getAttendanceTrend(7),
    {
      enabled: user?.role === 'staff' || user?.role === 'admin',
      retry: false,
      onError: (error) => {
        console.error('Error fetching attendance trend:', error)
      }
    }
  )

  // Fetch transport efficiency
  const { data: transportEfficiency } = useQuery(
    'staff-transport-efficiency',
    staffAPI.getTransportEfficiency,
    {
      enabled: user?.role === 'staff' || user?.role === 'admin',
      retry: false,
      onError: (error) => {
        console.error('Error fetching transport efficiency:', error)
      }
    }
  )

  // Fetch data for recent activity
  const { data: students } = useQuery('students', studentsAPI.getAll, {
    enabled: user?.role === 'staff' || user?.role === 'admin',
    retry: false,
    onError: (error) => {
      console.error('Error fetching students:', error)
    }
  })

  const { data: buses } = useQuery('buses', busesAPI.getAll, {
    enabled: user?.role === 'staff' || user?.role === 'admin',
    retry: false,
    onError: (error) => {
      console.error('Error fetching buses:', error)
    }
  })

  // Calculate attendance rate
  const attendanceRate = stats?.total_students 
    ? Math.round((stats.students_present_today / stats.total_students) * 100)
    : 0

  // Prepare chart data
  const attendanceChartData = attendanceTrend?.map(trend => ({
    date: format(parseISO(trend.date), 'yyyy-MM-dd'),
    present: trend.present,
    absent: trend.absent,
    rate: trend.attendance_rate.toFixed(1)
  })) || []

  // KPI Cards
  const kpiCards = [
    {
      title: 'إجمالي الطلاب',
      value: stats?.total_students || 0,
      subtitle: `${stats?.students_present_today || 0} حاضر / ${stats?.students_absent_today || 0} غائب`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      path: '/staff/students',
      description: 'إجمالي الطلاب'
    },
    {
      title: 'إجمالي المدرسين',
      value: stats?.total_teachers || 0,
      subtitle: `${stats?.teachers_active_today || 0} نشط اليوم`,
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      path: '/staff/teachers',
      description: 'مدرسين نشطين'
    },
    {
      title: 'الحافلات',
      value: stats?.active_buses || 0,
      subtitle: `${stats?.total_drivers || 0} سائق نشط`,
      icon: Bus,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      path: '/staff/buses',
      description: 'حافلات نشطة'
    },
    {
      title: 'الحضور اليوم',
      value: `${attendanceRate}%`,
      subtitle: `${stats?.students_present_today || 0} من ${stats?.total_students || 0}`,
      icon: CheckCircle,
      color: attendanceRate >= 90 ? 'from-green-500 to-green-600' : attendanceRate >= 70 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600',
      bgColor: attendanceRate >= 90 ? 'bg-green-50' : attendanceRate >= 70 ? 'bg-yellow-50' : 'bg-red-50',
      borderColor: attendanceRate >= 90 ? 'border-green-200' : attendanceRate >= 70 ? 'border-yellow-200' : 'border-red-200',
      path: '/staff/attendance',
      description: 'نسبة الحضور'
    },
    {
      title: 'طلبات الاستلام',
      value: stats?.todays_pickups || 0,
      subtitle: `${stats?.pending_pickup_approvals || 0} في الانتظار`,
      icon: ClipboardList,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      path: '/staff/approvals',
      description: 'استلام اليوم'
    },
    {
      title: 'طلبات الإنصراف',
      value: stats?.todays_dismissals || 0,
      subtitle: `${stats?.pending_dismissal_approvals || 0} في الانتظار`,
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      path: '/staff/approvals',
      description: 'إنصراف اليوم'
    },
    {
      title: 'التنبيهات',
      value: stats?.alerts_count || 0,
      subtitle: `${stats?.incidents_count || 0} حادث`,
      icon: AlertCircle,
      color: stats?.alerts_count && stats.alerts_count > 0 ? 'from-amber-500 to-amber-600' : 'from-gray-400 to-gray-500',
      bgColor: stats?.alerts_count && stats.alerts_count > 0 ? 'bg-amber-50' : 'bg-gray-50',
      borderColor: stats?.alerts_count && stats.alerts_count > 0 ? 'border-amber-200' : 'border-gray-200',
      path: '/staff/notifications',
      description: 'تنبيهات غير حرجة'
    },
    {
      title: 'الإشعارات',
      value: '12', // This would come from notifications API
      subtitle: 'إشعارات جديدة',
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      path: '/staff/notifications',
      description: 'إشعارات جديدة'
    }
  ]

  // Quick Actions
  const quickActions = [
    {
      title: 'إدارة الطلاب',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/staff/students',
      description: 'عرض وإدارة الطلاب'
    },
    {
      title: 'إدارة المدرسين',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      path: '/staff/teachers',
      description: 'عرض وإدارة المدرسين'
    },
    {
      title: 'الحضور والغياب',
      icon: UserCheck,
      color: 'from-yellow-500 to-yellow-600',
      path: '/staff/attendance',
      description: 'تسجيل الحضور'
    },
    {
      title: 'إدارة الحافلات',
      icon: Bus,
      color: 'from-orange-500 to-orange-600',
      path: '/staff/buses',
      description: 'عرض وتتبع الحافلات'
    },
    {
      title: 'الموافقات',
      icon: ClipboardList,
      color: 'from-indigo-500 to-indigo-600',
      path: '/staff/approvals',
      description: 'الموافقة على الطلبات'
    },
    {
      title: 'السلوك',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      path: '/staff/behavior',
      description: 'تسجيل ملاحظات السلوك'
    },
    {
      title: 'الأنشطة',
      icon: Activity,
      color: 'from-teal-500 to-teal-600',
      path: '/staff/activities',
      description: 'إدارة الأنشطة المدرسية'
    },
    {
      title: 'إدارة الإشعارات',
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      path: '/staff/notifications',
      description: 'إرسال وإدارة الإشعارات'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">لوحة تحكم الموظفين</h1>
                <p className="text-white/90 flex items-center gap-2">
                  <span>مرحباً،</span>
                  <span className="font-bold">{user?.full_name}</span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">{format(new Date(), 'EEEE، d MMMM')}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <button
                key={index}
                onClick={() => navigate(kpi.path)}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 ${kpi.borderColor} hover:border-primary-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${kpi.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <div className="text-right flex-1 mr-4">
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-xs text-gray-600 mt-1">{kpi.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">{kpi.title}</p>
                  <ArrowRight className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" size={18} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">اتجاه الحضور</h2>
                  <p className="text-sm text-gray-600">آخر 7 أيام</p>
                </div>
              </div>
            </div>
            {attendanceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => format(parseISO(value), 'dd/MM')}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    formatter={(value: any) => [value, 'عدد الطلاب']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="حاضر"
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="غائب"
                    dot={{ r: 4, fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500">لا توجد بيانات للحضور</p>
                </div>
              </div>
            )}
          </div>

          {/* Transport Efficiency Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bus className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">كفاءة النقل</h2>
                  <p className="text-sm text-gray-600">نسبة الدقة في الوقت</p>
                </div>
              </div>
            </div>
            {transportEfficiency && transportEfficiency.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transportEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="bus_number" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    formatter={(value: any) => [`${value}%`, 'نسبة الدقة']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="on_time_rate" 
                    fill="#10b981" 
                    name="نسبة الدقة"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Bus className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500">لا توجد بيانات للنقل</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">إجراءات سريعة</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`group relative p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform shadow-lg">
                      <Icon size={28} />
                    </div>
                    <p className="text-sm font-bold text-center">{action.title}</p>
                    <p className="text-xs text-white/80 text-center mt-1">{action.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">الطلاب الأخيرة</h2>
              </div>
                  <button
                    onClick={() => navigate('/staff/students')}
                    className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
                  >
                    عرض الكل
                    <ArrowRight size={16} />
                  </button>
            </div>
            <div className="space-y-3">
              {students && students.length > 0 ? (
                students.slice(0, 5).map((student: any) => (
                  <div
                    key={student.id}
                    className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => navigate(`/dashboard/students`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{student.full_name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{student.grade || '-'} - {student.class_name || '-'}</span>
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="text-green-500" size={18} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">لا توجد بيانات طلاب</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Buses */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bus className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">الحافلات النشطة</h2>
              </div>
                  <button
                    onClick={() => navigate('/staff/buses')}
                    className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
                  >
                    عرض الكل
                    <ArrowRight size={16} />
                  </button>
            </div>
            <div className="space-y-3">
              {buses && buses.length > 0 ? (
                buses.slice(0, 5).map((bus: any) => (
                      <div
                        key={bus.id}
                        className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate(`/staff/buses`)}
                      >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Bus className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">حافلة {bus.bus_number}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{bus.driver_name || 'سائق غير محدد'}</span>
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="text-green-500" size={18} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bus className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">لا توجد حافلات</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
