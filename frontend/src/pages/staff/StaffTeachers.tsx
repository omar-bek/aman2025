import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  Search, 
  GraduationCap, 
  Users, 
  FileText, 
  Award, 
  MessageSquare, 
  Activity, 
  TrendingUp,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  UserCog
} from 'lucide-react'
import { staffAPI } from '../../api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function StaffTeachers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)

  const { data: teachers, isLoading: teachersLoading } = useQuery('staff-teachers', staffAPI.getAllTeachers, {
    retry: false,
    onError: (error) => {
      console.error('Error fetching teachers:', error)
    }
  })

  const { data: workload, isLoading: workloadLoading } = useQuery('teachers-workload', staffAPI.getTeachersWorkload, {
    retry: false,
    onError: (error) => {
      console.error('Error fetching workload:', error)
    }
  })

  const { data: teacherActivity } = useQuery(
    ['teacher-activity', selectedTeacher],
    () => staffAPI.getTeacherActivity(selectedTeacher!, 30),
    {
      enabled: !!selectedTeacher,
      retry: false
    }
  )

  const { data: teacherClasses } = useQuery(
    ['teacher-classes', selectedTeacher],
    () => staffAPI.getTeacherClasses(selectedTeacher!),
    {
      enabled: !!selectedTeacher,
      retry: false
    }
  )

  const teachersArray = Array.isArray(teachers) ? teachers : []
  const filteredTeachers = teachersArray.filter((teacher: any) =>
    teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Prepare activity chart data for monthly summary
  const activityChartData = teacherActivity?.map(activity => ({
    date: format(parseISO(activity.date), 'yyyy-MM-dd'),
    assignments: activity.assignments_created,
    evaluations: activity.evaluations_done,
    messages: activity.messages_sent,
    total: activity.assignments_created + activity.evaluations_done + activity.messages_sent
  })) || []

  // Daily activity summary (last 7 days)
  const dailyActivityData = teacherActivity?.slice(0, 7).reverse().map(activity => ({
    date: format(parseISO(activity.date), 'EEE', { locale: ar }),
    assignments: activity.assignments_created,
    evaluations: activity.evaluations_done,
    messages: activity.messages_sent,
  })) || []

  // Monthly summary
  const monthlySummary = teacherActivity ? {
    totalAssignments: teacherActivity.reduce((sum: number, a: any) => sum + a.assignments_created, 0),
    totalEvaluations: teacherActivity.reduce((sum: number, a: any) => sum + a.evaluations_done, 0),
    totalMessages: teacherActivity.reduce((sum: number, a: any) => sum + a.messages_sent, 0),
    averageDaily: teacherActivity.length > 0 
      ? teacherActivity.reduce((sum: number, a: any) => sum + (a.assignments_created + a.evaluations_done + a.messages_sent), 0) / teacherActivity.length 
      : 0
  } : null

  const getWorkloadForTeacher = (teacherId: number) => {
    return workload?.find(w => w.teacher_id === teacherId)
  }

  const getActivityLevelColor = (score: number) => {
    if (score >= 70) return 'from-green-500 to-green-600'
    if (score >= 40) return 'from-yellow-500 to-yellow-600'
    return 'from-blue-400 to-blue-500'
  }

  const getActivityLevelText = (score: number) => {
    if (score >= 70) return 'نشط جداً'
    if (score >= 40) return 'نشط'
    return 'نشاط عادي'
  }

  const getActivityIndicator = (score: number) => {
    if (score >= 70) return { color: 'bg-green-500', text: 'نشط جداً' }
    if (score >= 40) return { color: 'bg-yellow-500', text: 'نشط' }
    return { color: 'bg-blue-500', text: 'عادي' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/staff')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
              <GraduationCap className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة المدرسين</h1>
                <p className="text-white/90">عرض وإدارة بيانات المدرسين والعمل اليومي</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن مدرس بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Teachers Grid */}
        {teachersLoading || workloadLoading ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : !filteredTeachers || filteredTeachers.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg mb-2">لا يوجد مدرسين</p>
            <p className="text-gray-500 text-sm">لا توجد بيانات مدرسين متاحة للعرض</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher: any) => {
              const teacherWorkload = getWorkloadForTeacher(teacher.id)
              const activityIndicator = teacherWorkload 
                ? getActivityIndicator(teacherWorkload.activity_score)
                : { color: 'bg-gray-400', text: 'غير متاح' }
              
              return (
                <div
                  key={teacher.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                    selectedTeacher === teacher.id ? 'ring-4 ring-primary-400 border-primary-400' : ''
                  }`}
                  onClick={() => setSelectedTeacher(selectedTeacher === teacher.id ? null : teacher.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${teacherWorkload ? getActivityLevelColor(teacherWorkload.activity_score) : 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                        <GraduationCap className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{teacher.full_name}</h3>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 ${activityIndicator.color} rounded-full`}></div>
                          <span className="text-xs text-gray-500">{activityIndicator.text}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {teacherWorkload && (
                    <div className="space-y-3">
                      {/* Assigned Classes & Students */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="text-blue-600" size={16} />
                            <p className="text-xs font-semibold text-gray-700">الصفوف</p>
                          </div>
                          <p className="text-xl font-bold text-blue-700">{teacherWorkload.total_classes}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="text-green-600" size={16} />
                            <p className="text-xs font-semibold text-gray-700">الطلاب</p>
                          </div>
                          <p className="text-xl font-bold text-green-700">{teacherWorkload.total_students}</p>
                        </div>
                      </div>

                      {/* Workload Overview */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
                        <div className="text-center">
                          <FileText className="text-blue-600 mx-auto mb-1" size={20} />
                          <p className="text-xs text-gray-600 mb-1">واجبات</p>
                          <p className="text-lg font-bold text-gray-900">{teacherWorkload.assignments_count}</p>
                        </div>
                        <div className="text-center">
                          <Award className="text-green-600 mx-auto mb-1" size={20} />
                          <p className="text-xs text-gray-600 mb-1">تقييمات</p>
                          <p className="text-lg font-bold text-gray-900">{teacherWorkload.pending_evaluations}</p>
                        </div>
                        <div className="text-center">
                          <MessageSquare className="text-purple-600 mx-auto mb-1" size={20} />
                          <p className="text-xs text-gray-600 mb-1">رسائل</p>
                          <p className="text-lg font-bold text-gray-900">{teacherWorkload.messages_count}</p>
                        </div>
                      </div>

                      {teacherWorkload.pending_evaluations > 0 && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-medium text-amber-800 flex items-center gap-2">
                            <AlertCircle size={14} />
                            {teacherWorkload.pending_evaluations} تقييم متوقع
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Selected Teacher Details */}
        {selectedTeacher && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل النشاط - {teachers?.find((t: any) => t.id === selectedTeacher)?.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Monthly Summary Cards */}
            {monthlySummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <FileText className="text-blue-600 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mb-1">إجمالي الواجبات</p>
                  <p className="text-2xl font-bold text-blue-700">{monthlySummary.totalAssignments}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <Award className="text-green-600 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mb-1">إجمالي التقييمات</p>
                  <p className="text-2xl font-bold text-green-700">{monthlySummary.totalEvaluations}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <MessageSquare className="text-purple-600 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mb-1">إجمالي الرسائل</p>
                  <p className="text-2xl font-bold text-purple-700">{monthlySummary.totalMessages}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <Activity className="text-yellow-600 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mb-1">المتوسط اليومي</p>
                  <p className="text-2xl font-bold text-yellow-700">{monthlySummary.averageDaily.toFixed(1)}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Daily Activity Chart (Last 7 Days) */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-primary-600" size={20} />
                  <h3 className="text-lg font-bold text-gray-900">النشاط اليومي (آخر 7 أيام)</h3>
                </div>
                {dailyActivityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dailyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="assignments" fill="#3b82f6" name="واجبات" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="evaluations" fill="#10b981" name="تقييمات" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="messages" fill="#8b5cf6" name="رسائل" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center">
                    <p className="text-gray-500">لا توجد بيانات نشاط يومي</p>
                  </div>
                )}
              </div>

              {/* Monthly Activity Trend */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-primary-600" size={20} />
                  <h3 className="text-lg font-bold text-gray-900">الاتجاه الشهري</h3>
                </div>
                {activityChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={activityChartData}>
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
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="assignments" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="واجبات"
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="evaluations" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="تقييمات"
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        name="رسائل"
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center">
                    <p className="text-gray-500">لا توجد بيانات نشاط</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Classes & Students */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-primary-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">الصفوف والطلاب المخصصين</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const teacherClassesArray = Array.isArray(teacherClasses) ? teacherClasses : []
                  return teacherClassesArray.length > 0 ? (
                    teacherClassesArray.map((classItem: any) => (
                    <div key={classItem.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-lg">{classItem.class_name}</h4>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold">{classItem.grade}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Users size={16} />
                            عدد الطلاب
                          </span>
                          <span className="font-bold text-gray-900">{classItem.student_count}</span>
                        </div>
                        {classItem.subject && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">المادة</span>
                            <span className="font-semibold text-gray-900">{classItem.subject}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-xs text-green-700 font-medium">نشط</span>
                        </div>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                      <Users className="mx-auto text-gray-300 mb-3" size={40} />
                      <p className="text-gray-500">لا توجد صفوف مخصصة</p>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Permissions & Role */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-primary-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">الصلاحيات والدور</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white/80 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCog className="text-blue-600" size={18} />
                    <span className="text-sm font-semibold text-gray-700">الدور</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">مدرس</p>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-green-600" size={18} />
                    <span className="text-sm font-semibold text-gray-700">الحالة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={18} />
                    <p className="text-lg font-bold text-green-700">نشط</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-600 mb-2 font-semibold">الصلاحيات المتاحة:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">إدارة الواجبات</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">التقييمات</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">الرسائل</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">الحضور</span>
                </div>
              </div>
            </div>

            {/* Workload Overview Cards */}
            {workload && (() => {
              const teacherWorkload = getWorkloadForTeacher(selectedTeacher)
              if (!teacherWorkload) return null
              
              return (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <FileText className="text-blue-600 mb-2" size={24} />
                    <p className="text-xs text-gray-600 mb-1">الواجبات</p>
                    <p className="text-2xl font-bold text-blue-700">{teacherWorkload.assignments_count}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <Award className="text-green-600 mb-2" size={24} />
                    <p className="text-xs text-gray-600 mb-1">تقييمات متوقعة</p>
                    <p className="text-2xl font-bold text-green-700">{teacherWorkload.pending_evaluations}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <MessageSquare className="text-purple-600 mb-2" size={24} />
                    <p className="text-xs text-gray-600 mb-1">رسائل غير مقروءة</p>
                    <p className="text-2xl font-bold text-purple-700">{teacherWorkload.messages_count}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <Activity className="text-yellow-600 mb-2" size={24} />
                    <p className="text-xs text-gray-600 mb-1">مؤشر النشاط</p>
                    <p className="text-2xl font-bold text-yellow-700">{teacherWorkload.activity_score.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-1">{getActivityLevelText(teacherWorkload.activity_score)}</p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
