import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import apiClient from '../../api/client'
import { 
  ArrowRight, 
  User, 
  Calendar, 
  Bus, 
  Award, 
  Shield, 
  Download, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StaffStudentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Fetch student data
  const { data: student, isLoading: studentLoading } = useQuery(
    ['student', id],
    () => studentsAPI.getById(Number(id!)),
    { enabled: !!id }
  )

  // Fetch attendance history
  const { data: attendanceHistory } = useQuery(
    ['student-attendance', id],
    async () => {
      const response = await apiClient.get(`/attendance/student/${id}`)
      return response.data || []
    },
    { enabled: !!id }
  )

  // Fetch behavior logs
  const { data: behaviorLogs } = useQuery(
    ['student-behavior', id],
    async () => {
      const response = await apiClient.get(`/behavior/student/${id}`)
      return response.data || []
    },
    { enabled: !!id }
  )

  // Fetch academic grades
  const { data: grades } = useQuery(
    ['student-grades', id],
    async () => {
      const response = await apiClient.get(`/academic/grades/${id}`)
      return response.data || []
    },
    { enabled: !!id }
  )

  // Fetch bus info if student has one
  const { data: bus } = useQuery(
    ['student-bus', student?.bus_id],
    async () => {
      if (!student?.bus_id) return null
      const response = await apiClient.get(`/buses/${student.bus_id}`)
      return response.data
    },
    { enabled: !!student?.bus_id }
  )

  // Fetch pickup requests
  const { data: pickupRequests } = useQuery(
    ['student-pickup', id],
    async () => {
      const response = await apiClient.get(`/pickup/requests/${id}`)
      return response.data || []
    },
    { enabled: !!id }
  )

  // Prepare attendance chart data (last 30 days)
  const attendanceHistoryArray = Array.isArray(attendanceHistory) ? attendanceHistory : []
  const attendanceChartData = attendanceHistoryArray.slice(0, 30).reverse().map((att: any) => ({
    date: format(parseISO(att.date), 'yyyy-MM-dd'),
    present: att.status === 'present' ? 1 : 0,
    absent: att.status === 'absent' ? 1 : 0,
    late: att.status === 'late' ? 1 : 0
  }))

  // Calculate statistics
  const totalDays = attendanceHistoryArray.length || 0
  const presentDays = attendanceHistoryArray.filter((a: any) => a.status === 'present').length || 0
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  const handleExport = async (format: 'pdf' | 'excel') => {
    // TODO: Implement export functionality
    console.log(`Exporting student data to ${format}`)
  }

  if (studentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطالب...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">الطالب غير موجود</p>
          <button
            onClick={() => navigate('/dashboard/students')}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            العودة لقائمة الطلاب
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard/students')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <User className="text-white" size={32} />
              </div>
              <div>
              <h1 className="text-3xl font-bold text-white mb-1">{student.name}</h1>
                <p className="text-white/90">{student.grade} - {student.class_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
              >
                <Download size={20} />
                تصدير PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
              >
                <FileText size={20} />
                تصدير Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info Card */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">المعلومات الأساسية</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">الرقم التعريفي</p>
                <p className="text-lg font-bold text-gray-900">{student.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الصف</p>
                <p className="text-lg font-bold text-gray-900">{student.grade || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الفصل</p>
                <p className="text-lg font-bold text-gray-900">{student.class_name || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الحالة</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  student.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {student.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إحصائيات الحضور</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل الحضور</span>
                  <span className="text-2xl font-bold text-gray-900">{attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      attendanceRate >= 90 ? 'bg-green-500' : 
                      attendanceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">حاضر</p>
                  <p className="text-xl font-bold text-green-700">{presentDays}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">غائب</p>
                  <p className="text-xl font-bold text-red-700">{totalDays - presentDays}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Trend Chart */}
        {attendanceChartData.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">اتجاه الحضور (آخر 30 يوم)</h2>
            </div>
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
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="حاضر"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Timeline & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance History */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">سجل الحضور</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {attendanceHistoryArray && attendanceHistoryArray.length > 0 ? (
                attendanceHistoryArray.slice(0, 20).map((att: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      att.status === 'present' ? 'bg-green-100' : 
                      att.status === 'late' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {att.status === 'present' ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : att.status === 'late' ? (
                        <Clock className="text-yellow-600" size={20} />
                      ) : (
                        <XCircle className="text-red-600" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {format(parseISO(att.date), 'EEEE، d MMMM yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {att.status === 'present' ? 'حاضر' : 
                         att.status === 'late' ? 'متأخر' : 'غائب'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">لا توجد سجلات حضور</p>
                </div>
              )}
            </div>
          </div>

          {/* Behavior Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">ملخص السلوك</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(() => {
                const behaviorLogsArray = Array.isArray(behaviorLogs) ? behaviorLogs : []
                return behaviorLogsArray.length > 0 ? (
                  behaviorLogsArray.slice(0, 10).map((log: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.behavior_type === 'positive' ? 'bg-green-100 text-green-700' :
                        log.behavior_type === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.behavior_type === 'positive' ? 'إيجابي' :
                         log.behavior_type === 'negative' ? 'سلبي' : 'محايد'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(parseISO(log.behavior_date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{log.description}</p>
                    {log.location && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} />
                        {log.location}
                      </p>
                    )}
                  </div>
                ))
                ) : (
                  <div className="text-center py-8">
                    <Shield className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500">لا توجد سجلات سلوك</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Transport & Pickup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bus Assignment */}
          {bus && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Bus className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">الحافلة المخصصة</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">رقم الحافلة</p>
                  <p className="text-lg font-bold text-gray-900">{bus.bus_number}</p>
                </div>
                {bus.route_name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">اسم الخط</p>
                    <p className="text-lg font-bold text-gray-900">{bus.route_name}</p>
                  </div>
                )}
                {bus.driver_name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">السائق</p>
                    <p className="text-lg font-bold text-gray-900">{bus.driver_name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pickup Permissions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">طلبات الاستلام الأخيرة</h2>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(() => {
                const pickupRequestsArray = Array.isArray(pickupRequests) ? pickupRequests : []
                return pickupRequestsArray.length > 0 ? (
                  pickupRequestsArray.slice(0, 5).map((req: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {req.status === 'approved' ? 'موافق' :
                         req.status === 'pending' ? 'في الانتظار' : 'مرفوض'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(parseISO(req.pickup_date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{req.recipient_name}</p>
                    <p className="text-xs text-gray-600">{req.recipient_relation}</p>
                  </div>
                ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500">لا توجد طلبات استلام</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Academic Summary */}
        {(() => {
          const gradesArray = Array.isArray(grades) ? grades : []
          return gradesArray.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">ملخص الأكاديمي</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-3 px-4 text-sm font-bold text-gray-700">المادة</th>
                      <th className="py-3 px-4 text-sm font-bold text-gray-700">الدرجة</th>
                      <th className="py-3 px-4 text-sm font-bold text-gray-700">الفصل</th>
                      <th className="py-3 px-4 text-sm font-bold text-gray-700">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesArray.slice(0, 10).map((grade: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{grade.subject}</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900">{grade.score}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{grade.semester || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {format(parseISO(grade.created_at), 'dd/MM/yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )
        })()}
      </div>
    </div>
  )
}

