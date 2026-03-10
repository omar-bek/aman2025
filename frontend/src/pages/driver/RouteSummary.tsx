import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  FileText,
  Download,
  Calendar,
  Loader,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import apiClient from '../../api/client'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'

interface RouteLog {
  id: number
  event_type: 'departure' | 'arrival' | 'check_in' | 'check_out' | 'delay' | 'incident'
  location: string
  timestamp: string
  student_name?: string
  student_id?: string
  notes?: string
  proof_photo?: string
}

interface RouteSummaryData {
  route_id: number
  route_name: string
  type: 'pickup' | 'dismissal'
  start_time: string
  end_time?: string
  duration_minutes?: number
  total_stops: number
  completed_stops: number
  total_students: number
  checked_in_students: number
  delays: number
  incidents: number
  logs: RouteLog[]
}

export default function RouteSummary() {
  const navigate = useNavigate()
  const { routeId } = useParams()

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ['route-summary', routeId ?? 'latest'],
    async () => {
      try {
        const url = routeId
          ? `/driver/route/${routeId}/summary`
          : '/driver/route/latest/summary'
        const response = await apiClient.get(url)
        return response.data as RouteSummaryData
      } catch (error: any) {
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'تعذر تحميل ملخص الرحلة'
        toast.error(message)
        throw error
      }
    },
    {
      enabled: true,
      retry: 1,
    }
  )

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'departure':
      case 'arrival':
        return <MapPin className="text-teal-600" size={20} />
      case 'check_in':
      case 'check_out':
        return <Users className="text-emerald-600" size={20} />
      case 'delay':
        return <Clock className="text-amber-600" size={20} />
      case 'incident':
        return <AlertTriangle className="text-red-600" size={20} />
      default:
        return <CheckCircle className="text-gray-600" size={20} />
    }
  }

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'departure':
        return 'انطلاق'
      case 'arrival':
        return 'وصول'
      case 'check_in':
        return 'دخول'
      case 'check_out':
        return 'خروج'
      case 'delay':
        return 'تأخير'
      case 'incident':
        return 'حادث'
      default:
        return eventType
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'departure':
      case 'arrival':
        return 'bg-teal-50 border-teal-200'
      case 'check_in':
      case 'check_out':
        return 'bg-emerald-50 border-emerald-200'
      case 'delay':
        return 'bg-amber-50 border-amber-200'
      case 'incident':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-sand-50 border-sand-200'
    }
  }

  const handleDownloadReport = () => {
    // Generate and download PDF report
    toast.success('جاري تحميل التقرير...')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <LoadingState inline message="جاري تحميل ملخص الرحلة..." />
      </div>
    )
  }

  if (isError || !summary) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <ErrorState
          title="تعذر تحميل ملخص الرحلة"
          description="حدث خطأ أثناء جلب بيانات الرحلة. حاول مرة أخرى أو عد إلى لوحة التحكم."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/driver')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ملخص الرحلة</h1>
                <p className="text-sm text-gray-600 mt-1">{summary.route_name}</p>
              </div>
            </div>
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              تحميل التقرير
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-teal-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {summary.duration_minutes || 0} د
              </span>
            </div>
            <p className="text-xs text-gray-600">المدة</p>
          </div>
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="text-emerald-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {summary.completed_stops || 0} / {summary.total_stops || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600">المحطات</p>
          </div>
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-blue-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {summary.checked_in_students || 0} / {summary.total_students || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600">الطلاب</p>
          </div>
          <div className="bg-white rounded-card-lg p-5 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-amber-600" size={20} />
              <span className="text-2xl font-bold text-gray-900">
                {summary.delays || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600">تأخيرات</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">سجل الرحلة</h2>
            </div>
            <div className="text-sm text-gray-600">
              {summary.start_time && format(new Date(summary.start_time), 'EEEE، d MMMM yyyy')}
            </div>
          </div>

          <div className="space-y-4">
            {summary.logs && summary.logs.length > 0 ? (
              summary.logs.map((log: RouteLog) => (
                <div
                  key={log.id}
                  className={`p-5 rounded-card-lg border-2 ${getEventColor(log.event_type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(log.event_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                            {getEventLabel(log.event_type)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{log.location}</span>
                          {log.student_name && (
                            <span className="text-sm text-gray-600">• {log.student_name}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          {format(new Date(log.timestamp), 'HH:mm:ss')}
                        </div>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-gray-700 mt-2 bg-white/50 rounded-card p-3">
                          {log.notes}
                        </p>
                      )}
                      {log.proof_photo && (
                        <div className="mt-3">
                          <img
                            src={log.proof_photo}
                            alt="إثبات الحدث"
                            className="w-32 h-32 object-cover rounded-card border border-sand-200"
                          />
                        </div>
                      )}
                      {log.student_id && (
                        <p className="text-xs text-gray-500 mt-2">ID: {log.student_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto text-gray-300 mb-3" size={32} />
                <p>لا توجد سجلات</p>
              </div>
            )}
          </div>
        </div>

        {/* Route Timeline Visualization */}
        {summary.logs && summary.logs.length > 0 && (
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">خط زمني</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-sand-200" />
              
              <div className="space-y-6">
                {summary.logs.map((log: RouteLog) => (
                  <div key={log.id} className="relative flex items-start gap-4">
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white ${
                        log.event_type === 'departure' || log.event_type === 'arrival'
                          ? 'border-teal-500'
                          : log.event_type === 'check_in' || log.event_type === 'check_out'
                          ? 'border-emerald-500'
                          : 'border-amber-500'
                      }`}>
                        {getEventIcon(log.event_type)}
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{getEventLabel(log.event_type)} - {log.location}</p>
                        <p className="text-sm text-gray-600">{format(new Date(log.timestamp), 'HH:mm')}</p>
                      </div>
                      {log.student_name && (
                        <p className="text-sm text-gray-600">{log.student_name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-card-lg p-6 border border-emerald-200 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-emerald-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">ملخص الأداء</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-card p-4 border border-emerald-200">
              <p className="text-sm text-gray-600 mb-1">معدل الإتمام</p>
              <p className="text-2xl font-bold text-emerald-600">
                {summary.total_stops
                  ? Math.round((summary.completed_stops / summary.total_stops) * 100)
                  : 0}%
              </p>
            </div>
            <div className="bg-white rounded-card p-4 border border-emerald-200">
              <p className="text-sm text-gray-600 mb-1">معدل تسجيل الطلاب</p>
              <p className="text-2xl font-bold text-emerald-600">
                {summary.total_students
                  ? Math.round((summary.checked_in_students / summary.total_students) * 100)
                  : 0}%
              </p>
            </div>
            <div className="bg-white rounded-card p-4 border border-emerald-200">
              <p className="text-sm text-gray-600 mb-1">الوقت المتوقع</p>
              <p className="text-2xl font-bold text-emerald-600">
                {summary.duration_minutes || 0} دقيقة
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/driver')}
            className="flex-1 py-4 bg-white border-2 border-sand-300 text-gray-700 rounded-card-lg text-lg font-medium hover:bg-sand-50 transition-colors"
          >
            العودة للوحة التحكم
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex-1 py-4 bg-teal-600 text-white rounded-card-lg text-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={20} />
            تحميل التقرير الكامل
          </button>
        </div>
      </div>
    </div>
  )
}


