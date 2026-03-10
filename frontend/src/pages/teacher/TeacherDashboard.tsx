import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import { studentsAPI, assignmentsAPI } from '../../api'
import { teacherDashboardAPI, evaluationsAPI } from '../../api/teacher'
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  AlertCircle,
  FileText,
  Award,
  Sparkles,
  CheckCircle,
  Calendar,
  GraduationCap,
  ArrowRight,
  Eye,
  Send,
  User
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationCenter from '../../components/NotificationCenter'

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Fetch dashboard stats
  const { data: dashboardStats } = useQuery(
    'teacher-dashboard-stats',
    async () => {
      const response = await teacherDashboardAPI.getStats()
      return response.data
    },
    {
      enabled: user?.role === 'teacher',
      retry: false,
      onError: (error) => {
        console.error('Error fetching dashboard stats:', error)
      }
    }
  )

  // Fetch students
  const { data: students } = useQuery(
    'teacher-students',
    async () => {
      return await studentsAPI.getAll()
    },
    {
      enabled: user?.role === 'teacher',
      retry: false,
      onError: (error) => {
        console.error('Error fetching students:', error)
      }
    }
  )

  // Fetch recent assignments
  const { data: assignmentsResponse } = useQuery(
    'teacher-assignments',
    async () => {
      return await assignmentsAPI.getAll()
    },
    {
      enabled: user?.role === 'teacher',
      retry: false,
      onError: (error) => {
        console.error('Error fetching assignments:', error)
      }
    }
  )
  
  const assignments = assignmentsResponse?.data || []

  // Fetch pending evaluations
  const { data: evaluationsResponse } = useQuery(
    'teacher-evaluations',
    async () => {
      return await evaluationsAPI.getAll()
    },
    {
      enabled: user?.role === 'teacher',
      retry: false,
      onError: (error) => {
        console.error('Error fetching evaluations:', error)
      }
    }
  )
  
  const evaluations = evaluationsResponse?.data || []

  // Stats with real data and enhanced icons
  const stats = [
    {
      title: 'الطلاب اليوم',
      value: dashboardStats?.students_today || students?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      path: '/teacher/students',
      description: 'إجمالي طلابك'
    },
    {
      title: 'واجبات اليوم',
      value: dashboardStats?.assignments_today || assignments?.length || 0,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      path: '/teacher/assignments',
      description: 'الواجبات المقررة'
    },
    {
      title: 'تقييمات قيد الانتظار',
      value: dashboardStats?.pending_evaluations || 0,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      path: '/teacher/evaluations',
      description: 'تحتاج تقييم'
    },
    {
      title: 'رسائل غير مقروءة',
      value: dashboardStats?.unread_messages || 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      path: '/teacher/messages',
      description: 'رسائل جديدة'
    }
  ]

  // Get recent assignments (last 5)
  const recentAssignments = (assignments && Array.isArray(assignments)) 
    ? assignments.slice(0, 5).map((assignment) => ({
        id: assignment.id,
        name: assignment.assignment_name,
        subject: assignment.subject,
        class: assignment.class_name || assignment.grade || 'غير محدد',
        dueDate: new Date(assignment.due_date).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        submissions: 0, // TODO: Get from submissions API
        total: students?.length || 0
      }))
    : []

  // Get recent evaluations (last 5)
  const recentEvaluations = (evaluations && Array.isArray(evaluations))
    ? evaluations.slice(0, 5).map((evaluation: any) => {
        const student = students?.find((s: any) => s.id === evaluation.student_id)
        return {
          id: evaluation.id,
          studentName: student?.full_name || `طالب #${evaluation.student_id}`,
          date: new Date(evaluation.evaluation_date || evaluation.created_at).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          type: evaluation.evaluation_type,
          status: 'completed'
        }
      })
    : []

  // Quick actions with enhanced design
  const quickActions = [
    {
      title: 'إضافة واجب',
      icon: FileText,
      color: 'from-primary-500 to-primary-600',
      path: '/teacher/assignments/new',
      description: 'إنشاء واجب جديد'
    },
    {
      title: 'تقييم جديد',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      path: '/teacher/evaluations/new',
      description: 'تسجيل تقييم طالب'
    },
    {
      title: 'رسالة جديدة',
      icon: Send,
      color: 'from-purple-500 to-purple-600',
      path: '/teacher/messages',
      description: 'إرسال رسالة لولي أمر'
    },
    {
      title: 'إعلان صف',
      icon: Bell,
      color: 'from-indigo-500 to-indigo-600',
      path: '/teacher/announcements',
      description: 'إرسال إعلان للصف'
    },
    {
      title: 'تسجيل حضور',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      path: '/teacher/attendance',
      description: 'تسجيل حضور الطلاب'
    },
    {
      title: 'جدول امتحانات',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      path: '/teacher/exams',
      description: 'إدارة الامتحانات'
    },
    {
      title: 'عرض الطلاب',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/teacher/students',
      description: 'عرض قائمة الطلاب'
    },
    {
      title: 'تقليل العبء',
      icon: Sparkles,
      color: 'from-pink-500 to-pink-600',
      path: '/teacher/workload-reduction',
      description: 'نصائح AI'
    }
  ]

  // Alerts based on stats
  const alerts = []
  if (dashboardStats?.pending_evaluations && dashboardStats.pending_evaluations > 0) {
    alerts.push({
      id: 1,
      type: 'evaluation',
      message: `${dashboardStats.pending_evaluations} طالب يحتاجون تقييم اليوم`,
      priority: 'medium',
      icon: Award,
      action: () => navigate('/teacher/evaluations/new')
    })
  }
  if (dashboardStats?.unread_messages && dashboardStats.unread_messages > 0) {
    alerts.push({
      id: 2,
      type: 'message',
      message: `${dashboardStats.unread_messages} رسالة جديدة من أولياء الأمور`,
      priority: 'low',
      icon: MessageSquare,
      action: () => navigate('/teacher/messages')
    })
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - UAE Premium Design */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card-lg flex items-center justify-center shadow-card">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدرس</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <span>مرحباً،</span>
                  <span className="font-medium text-teal-700">{user?.full_name}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/teacher/profile')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="الملف الشخصي"
              >
                <User className="text-teal-600" size={24} />
              </button>
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* KPIs - UAE Premium Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <button
                key={index}
                onClick={() => navigate(stat.path)}
                className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card hover:shadow-elevated transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                    <Icon className="text-white" size={24} />
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-teal-600 transition-colors" size={18} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Alerts - UAE Premium Design */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-card-lg p-5 border border-amber-200 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-card flex items-center justify-center">
                <AlertCircle className="text-amber-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">تنبيهات مهمة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {alerts.map((alert) => {
                const AlertIcon = alert.icon
                return (
                  <button
                    key={alert.id}
                    onClick={alert.action}
                    className="p-4 rounded-card border border-sand-200 bg-sand-50 hover:bg-white hover:border-teal-300 transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      <AlertIcon className="text-teal-600 flex-shrink-0" size={18} />
                      <p className="text-sm font-medium text-gray-900 flex-1">{alert.message}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Actions - Core Screens */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">الشاشات الرئيسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/teacher/attendance')}
              className="p-5 bg-emerald-50 border border-emerald-200 rounded-card-lg hover:bg-emerald-100 transition-all group"
            >
              <CheckCircle className="text-emerald-600 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="font-bold text-gray-900 text-sm mb-1">تسجيل الحضور</p>
              <p className="text-xs text-gray-600">سريع • دقيق</p>
            </button>
            <button
              onClick={() => navigate('/teacher/insights')}
              className="p-5 bg-teal-50 border border-teal-200 rounded-card-lg hover:bg-teal-100 transition-all group"
            >
              <Sparkles className="text-teal-600 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="font-bold text-gray-900 text-sm mb-1">تحليلات الصف</p>
              <p className="text-xs text-gray-600">رؤى مجمعة</p>
            </button>
            <button
              onClick={() => navigate('/teacher/notes')}
              className="p-5 bg-sand-100 border border-sand-300 rounded-card-lg hover:bg-sand-200 transition-all group"
            >
              <FileText className="text-gray-700 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="font-bold text-gray-900 text-sm mb-1">ملاحظات الطلاب</p>
              <p className="text-xs text-gray-600">قوالب جاهزة</p>
            </button>
            <button
              onClick={() => navigate('/teacher/notifications')}
              className="p-5 bg-white border border-sand-200 rounded-card-lg hover:bg-sand-50 transition-all group"
            >
              <Bell className="text-teal-600 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="font-bold text-gray-900 text-sm mb-1">ملخص الإشعارات</p>
              <p className="text-xs text-gray-600">نظرة شاملة</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assignments */}
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-card flex items-center justify-center">
                  <BookOpen className="text-emerald-600" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">الواجبات الأخيرة</h2>
              </div>
              <button
                onClick={() => navigate('/teacher/assignments')}
                className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
            >
              عرض الكل
                <ArrowRight size={16} />
              </button>
          </div>
          <div className="space-y-3">
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 bg-sand-50 rounded-card border border-sand-200 hover:border-teal-300 hover:shadow-soft transition-all cursor-pointer group"
                    onClick={() => navigate(`/teacher/assignments`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="text-primary-600" size={18} />
                          <h3 className="font-bold text-gray-900">{assignment.name}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <GraduationCap size={14} />
                            {assignment.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {assignment.class}
                          </span>
                        </div>
                      </div>
                      <div className="text-left bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-500 mb-1">موعد التسليم</p>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                          <Calendar size={14} />
                          {assignment.dueDate}
                  </p>
                </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.max(0, (assignment.submissions / assignment.total) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700 min-w-fit">
                        {assignment.submissions}/{assignment.total}
                </span>
              </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">لا توجد واجبات حديثة</p>
                  <button
                    onClick={() => navigate('/teacher/assignments/new')}
                    className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-bold text-sm"
                  >
                    إضافة واجب جديد
                  </button>
                </div>
            )}
          </div>
        </div>

          {/* Recent Evaluations */}
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-card flex items-center justify-center">
                  <Award className="text-amber-600" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">التقييمات الأخيرة</h2>
              </div>
              <button
                onClick={() => navigate('/teacher/evaluations')}
                className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
            >
              عرض الكل
                <ArrowRight size={16} />
              </button>
          </div>
          <div className="space-y-3">
              {recentEvaluations.length > 0 ? (
                recentEvaluations.map((evaluation) => (
              <div
                    key={evaluation.id}
                    className="p-4 bg-amber-50 rounded-card border border-amber-200 hover:border-amber-300 hover:shadow-soft transition-all cursor-pointer group"
                    onClick={() => navigate(`/teacher/evaluations/${evaluation.id}`)}
              >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="text-white" size={20} />
                        </div>
                <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{evaluation.studentName}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {evaluation.date}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              evaluation.type === 'daily' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {evaluation.type === 'daily' ? 'يومي' : 'شهري'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Eye className="text-gray-400 group-hover:text-primary-600 transition-colors" size={18} />
                    </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">لا توجد تقييمات حديثة</p>
                  <button
                    onClick={() => navigate('/teacher/evaluations/new')}
                    className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-bold text-sm"
                  >
                    تقييم جديد
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>

        {/* Additional Quick Actions */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-card flex items-center justify-center">
              <Sparkles className="text-teal-600" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">إجراءات إضافية</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.slice(0, 4).map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="p-4 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-teal-300 transition-all group"
                >
                  <Icon className="text-teal-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-sm font-medium text-gray-900 mb-1">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
