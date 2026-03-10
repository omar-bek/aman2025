import { useState } from 'react'
import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  BookOpen,
  Award,
  Clock,
  Bell,
  TrendingUp,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  Loader
} from 'lucide-react'
import apiClient from '../../api/client'
import { format } from 'date-fns'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [currentTime] = useState(new Date())

  const { data: myDay, isLoading: myDayLoading } = useQuery('student-my-day', async () => {
    try {
      const response = await apiClient.get('/student/my-day')
      return response.data?.data || { schedule: [], homework: [], summary: {} }
    } catch {
      return { schedule: [], homework: [], summary: {} }
    }
  })

  const { data: todayEvents } = useQuery('student-today-events', async () => {
    try {
      const response = await apiClient.get('/student/events/today')
      return response.data?.data || []
    } catch {
      return []
    }
  })

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'صباح الخير'
    if (hour < 17) return 'مساء الخير'
    return 'مساء الخير'
  }

  const schedule = Array.isArray(myDay?.schedule) ? myDay.schedule : []

  const upcomingAssignments = Array.isArray(myDay?.homework)
    ? myDay.homework.filter((hw: any) => {
    const dueDate = new Date(hw.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate >= today
  })
    : []

  const completedToday = myDay?.summary?.completed_tasks || 0
  const inProgressTasks = myDay?.summary?.in_progress || upcomingAssignments.length

  const isLoading = myDayLoading
  const homeworkLoading = myDayLoading
  const progress: any = myDay?.summary || { achievements: [] }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - UAE Premium Design */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/student/wellbeing')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="الرفاهية"
              >
                <Sparkles className="text-teal-600" size={24} />
              </button>
              <button
                onClick={() => navigate('/student/notifications')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors relative"
                aria-label="الإشعارات"
              >
                <Bell className="text-teal-600" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Today's Overview */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card flex items-center justify-center">
                <Sun className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">يومي</h2>
                <p className="text-sm text-gray-600">{format(currentTime, 'EEEE، d MMMM yyyy')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-card-lg p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="text-emerald-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{completedToday}</span>
              </div>
              <p className="text-xs text-gray-600">مكتمل اليوم</p>
            </div>
              <div className="bg-teal-50 rounded-card-lg p-4 border border-teal-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-teal-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{inProgressTasks}</span>
              </div>
              <p className="text-xs text-gray-600">قيد التنفيذ</p>
            </div>
            <div className="bg-amber-50 rounded-card-lg p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="text-amber-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</span>
              </div>
              <p className="text-xs text-gray-600">واجبات قادمة</p>
            </div>
            <div className="bg-blue-50 rounded-card-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-blue-600" size={20} />
                <span className="text-2xl font-bold text-gray-900">
                  {Array.isArray(myDay?.schedule) ? myDay.schedule.length : 0}
                </span>
              </div>
              <p className="text-xs text-gray-600">حصص اليوم</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-sand-200">
            <button
              onClick={() => navigate('/student/assignments')}
              className="p-4 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-teal-300 transition-all group"
            >
              <BookOpen className="text-teal-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-sm font-medium text-gray-900">الواجبات</p>
            </button>
            <button
              onClick={() => navigate('/student/progress')}
              className="p-4 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-emerald-300 transition-all group"
            >
              <TrendingUp className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-sm font-medium text-gray-900">التقدم</p>
            </button>
            <button
              onClick={() => navigate('/student/wellbeing')}
              className="p-4 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-amber-300 transition-all group"
            >
              <Sparkles className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-sm font-medium text-gray-900">الرفاهية</p>
            </button>
            <button
              onClick={() => navigate('/student/schedule')}
              className="p-4 bg-sand-50 border border-sand-200 rounded-card-lg hover:bg-white hover:border-blue-300 transition-all group"
            >
              <Calendar className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
              <p className="text-sm font-medium text-gray-900">الجدول</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">جدول اليوم</h2>
              <Calendar className="text-teal-600" size={20} />
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader className="mx-auto animate-spin text-teal-600" size={24} />
                <p className="text-sm text-gray-600 mt-2">جاري التحميل...</p>
              </div>
            ) : schedule && schedule.length > 0 ? (
              <div className="space-y-3">
                {schedule.slice(0, 5).map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-sand-50 rounded-card border border-sand-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card flex items-center justify-center">
                        <Clock className="text-white" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.subject}</p>
                        <p className="text-xs text-gray-600">{item.time}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs font-medium border border-sand-300">
                      {item.classroom || 'قاعة'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-300 mb-3" size={32} />
                <p className="text-sm text-gray-500">لا يوجد جدول لهذا اليوم</p>
              </div>
            )}
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">الواجبات القادمة</h2>
              <button
                onClick={() => navigate('/student/assignments')}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                عرض الكل
                <ArrowRight size={16} />
              </button>
            </div>
            {homeworkLoading ? (
              <div className="text-center py-8">
                <Loader className="mx-auto animate-spin text-teal-600" size={24} />
                <p className="text-sm text-gray-600 mt-2">جاري التحميل...</p>
              </div>
            ) : upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.slice(0, 3).map((hw: any) => {
                  const dueDate = new Date(hw.due_date)
                  const daysUntil = Math.ceil((dueDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <button
                      key={hw.id}
                      onClick={() => navigate(`/student/assignments/${hw.id}`)}
                      className="w-full text-right p-4 bg-sand-50 rounded-card border border-sand-200 hover:border-teal-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm mb-1">{hw.assignment_name}</p>
                          <p className="text-xs text-gray-600 mb-2">{hw.subject}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="text-gray-400" size={14} />
                            <span className="text-xs text-gray-600">
                              {daysUntil === 0 ? 'اليوم' : daysUntil === 1 ? 'غداً' : `${daysUntil} أيام`}
                            </span>
                          </div>
                        </div>
                        {hw.status === 'completed' && (
                          <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto text-gray-300 mb-3" size={32} />
                <p className="text-sm text-gray-500">لا توجد واجبات قادمة</p>
                <p className="text-xs text-gray-400 mt-1">استمر في التقدم! 🌟</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievements & Encouragement */}
        {progress?.achievements && progress.achievements.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-card-lg p-6 border border-emerald-200 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-emerald-600" size={24} />
              <h2 className="text-lg font-bold text-gray-900">إنجازاتك</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {progress.achievements.slice(0, 4).map((achievement: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-card p-4 border border-emerald-200 text-center"
                >
                  <Award className="mx-auto mb-2 text-emerald-600" size={24} />
                  <p className="text-xs font-medium text-gray-900">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
