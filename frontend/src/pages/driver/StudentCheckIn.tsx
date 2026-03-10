import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Users,
  QrCode,
  Loader,
  Clock,
  AlertCircle,
  CheckCheck
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'

interface Student {
  id: number
  name: string
  class_name: string
  student_id: string
  check_in: boolean
  check_out: boolean
  check_in_time?: string
  check_out_time?: string
  photo_url?: string
}

export default function StudentCheckIn() {
  const navigate = useNavigate()
  const { stopId } = useParams()
  const queryClient = useQueryClient()
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr')
  const [scannedCode, setScannedCode] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ['stop-students', stopId],
    async () => {
      try {
        const response = await apiClient.get(`/driver/route/stop/${stopId}/students`)
        return response.data || []
      } catch (error: any) {
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'تعذر تحميل قائمة الطلاب للمحطة الحالية'
        toast.error(message)
        throw error
      }
    },
    { enabled: !!stopId }
  )

  const checkInMutation = useMutation(
    async ({ studentId, checkType }: { studentId: number; checkType: 'in' | 'out' }) => {
      const response = await apiClient.post('/driver/student/check', {
        student_id: studentId,
        stop_id: stopId ? parseInt(stopId) : null,
        check_type: checkType,
        timestamp: new Date().toISOString(),
        method: scanMode
      })
      return response.data
    },
    {
      onSuccess: (_data, variables) => {
        toast.success(
          variables.checkType === 'in' ? 'تم تسجيل الدخول' : 'تم تسجيل الخروج',
          { duration: 1500 }
        )
        queryClient.invalidateQueries(['stop-students', stopId])
        setScannedCode('')
        setSelectedStudent(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل التسجيل')
      }
    }
  )

  const handleQRScan = (code: string) => {
    setScannedCode(code)
    const student = students?.find((s: Student) => s.student_id === code)
    if (student) {
      handleStudentSelect(student.id)
    } else {
      toast.error('رقم الطالب غير موجود')
    }
  }

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudent(studentId)
    const student = students?.find((s: Student) => s.id === studentId)
    if (!student) return

    // Auto-check based on current status
    if (!student.check_in) {
      checkInMutation.mutate({ studentId, checkType: 'in' })
    } else if (!student.check_out) {
      checkInMutation.mutate({ studentId, checkType: 'out' })
    }
  }

  const handleManualCheck = (studentId: number, checkType: 'in' | 'out') => {
    checkInMutation.mutate({ studentId, checkType })
  }

  const studentsArray = Array.isArray(students) ? students : []
  const pendingStudents = studentsArray.filter((s: Student) => !s.check_in) || []
  const checkedInStudents = studentsArray.filter((s: Student) => s.check_in && !s.check_out) || []
  const completedStudents = studentsArray.filter((s: Student) => s.check_in && s.check_out) || []

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/driver/route')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تسجيل الطلاب</h1>
                <p className="text-sm text-gray-600 mt-1">مسح QR أو اختيار يدوي</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScanMode(scanMode === 'qr' ? 'manual' : 'qr')}
                className={`px-4 py-2 rounded-card text-sm font-medium transition-colors ${
                  scanMode === 'qr'
                    ? 'bg-teal-600 text-white'
                    : 'bg-sand-100 text-gray-700'
                }`}
              >
                {scanMode === 'qr' ? 'QR' : 'يدوي'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{pendingStudents.length}</p>
            <p className="text-xs text-gray-600">في الانتظار</p>
          </div>
          <div className="bg-emerald-50 rounded-card-lg p-4 border border-emerald-200 shadow-card text-center">
            <p className="text-3xl font-bold text-emerald-700 mb-1">{checkedInStudents.length}</p>
            <p className="text-xs text-gray-600">مسجلين</p>
          </div>
          <div className="bg-teal-50 rounded-card-lg p-4 border border-teal-200 shadow-card text-center">
            <p className="text-3xl font-bold text-teal-700 mb-1">{completedStudents.length}</p>
            <p className="text-xs text-gray-600">مكتمل</p>
          </div>
        </div>

        {/* QR Scanner Mode */}
        {scanMode === 'qr' && (
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card text-center">
            <div className="w-32 h-32 bg-sand-100 rounded-card-lg flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-gray-400" size={64} />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">امسح رمز QR للطالب</p>
            <p className="text-sm text-gray-600 mb-4">
              أو أدخل رقم الطالب يدوياً
            </p>
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && scannedCode) {
                  handleQRScan(scannedCode)
                }
              }}
              placeholder="رقم الطالب..."
              className="w-full px-4 py-4 bg-sand-50 border-2 border-sand-300 rounded-card text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
              aria-label="إدخال رقم الطالب يدوياً"
            />
          </div>
        )}

        {/* Students List - Large Touch Targets */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">قائمة الطلاب</h2>

          {isError && !isLoading && (
            <ErrorState
              title="تعذر تحميل قائمة الطلاب"
              description="حدث خطأ أثناء جلب بيانات الطلاب لهذه المحطة."
              onRetry={() => refetch()}
            />
          )}

          {isLoading ? (
            <LoadingState />
          ) : pendingStudents.length > 0 ? (
            <div className="space-y-3">
              {pendingStudents.map((student: Student) => (
                <button
                  key={student.id}
                  onClick={() => handleStudentSelect(student.id)}
                  disabled={checkInMutation.isLoading || selectedStudent === student.id}
                  className="w-full p-6 bg-sand-50 border-2 border-sand-200 rounded-card-lg hover:border-teal-300 transition-all disabled:opacity-50 text-right"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xl font-bold text-gray-900 mb-1">{student.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{student.class_name}</span>
                        <span>•</span>
                        <span>ID: {student.student_id}</span>
                      </div>
                    </div>
                    {checkInMutation.isLoading && selectedStudent === student.id ? (
                      <Loader className="animate-spin text-teal-600" size={32} />
                    ) : (
                      <div className="w-16 h-16 bg-teal-100 rounded-card-lg flex items-center justify-center">
                        <CheckCircle className="text-teal-600" size={32} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCheck className="mx-auto text-emerald-500 mb-3" size={48} />
              <p className="text-gray-600">جميع الطلاب تم تسجيلهم</p>
            </div>
          )}
        </div>

        {/* Already Checked In Students */}
        {checkedInStudents.length > 0 && (
          <div className="bg-emerald-50 rounded-card-lg p-6 border border-emerald-200 shadow-card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-emerald-600" size={20} />
              الطلاب المسجلين ({checkedInStudents.length})
            </h2>
            <div className="space-y-2">
              {checkedInStudents.map((student: Student) => (
                <div
                  key={student.id}
                  className="p-4 bg-white rounded-card border border-emerald-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.class_name}</p>
                      {student.check_in_time && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(student.check_in_time).toLocaleTimeString('ar-AE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {student.check_in && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle size={14} />
                          دخول
                        </span>
                      )}
                      {!student.check_out && (
                        <button
                          onClick={() => handleManualCheck(student.id, 'out')}
                          disabled={checkInMutation.isLoading}
                          className="px-6 py-2 bg-teal-600 text-white rounded-card font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                          تسجيل خروج
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Students */}
        {completedStudents.length > 0 && (
          <div className="bg-teal-50 rounded-card-lg p-6 border border-teal-200 shadow-card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCheck className="text-teal-600" size={20} />
              مكتمل ({completedStudents.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {completedStudents.map((student: Student) => (
                <div
                  key={student.id}
                  className="p-4 bg-white rounded-card border border-teal-200"
                >
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.class_name}</p>
                  {student.check_out_time && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      خروج: {new Date(student.check_out_time).toLocaleTimeString('ar-AE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


