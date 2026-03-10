import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | null

export default function TeacherAttendance() {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [bulkMode, setBulkMode] = useState<'present' | 'absent' | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set())
  const [quickFilters, setQuickFilters] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()

  const { data: students, isLoading: studentsLoading } = useQuery(
    ['teacher-students', selectedClass],
    async () => {
      try {
        const params = selectedClass ? { class_name: selectedClass } : {}
        const response = await apiClient.get('/teacher/students/', { params })
        return response.data || []
      } catch (error) {
        console.error('Error fetching students:', error)
        return []
      }
    }
  )

  const { data: attendance, isLoading: attendanceLoading } = useQuery(
    ['attendance', selectedDate, selectedClass],
    async () => {
      try {
        const response = await apiClient.get('/attendance/', {
          params: { date: selectedDate, class_name: selectedClass }
        })
        return response.data || []
      } catch (error) {
        return []
      }
    }
  )

  const markAttendanceMutation = useMutation(
    async (data: { student_id: number; status: string; date: string }) => {
      const response = await apiClient.post('/attendance/log', {
        student_id: data.student_id,
        attendance_type: data.status,
        device_id: 'teacher-web',
        location: 'classroom',
      })
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('attendance')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل تسجيل الحضور')
      }
    }
  )

  const bulkMarkMutation = useMutation(
    async (data: { student_ids: number[]; status: string; date: string }) => {
      const promises = data.student_ids.map(studentId =>
        apiClient.post('/attendance/log', {
          student_id: studentId,
          attendance_type: data.status,
          device_id: 'teacher-web',
          location: 'classroom',
        })
      )
      await Promise.all(promises)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('attendance')
        setSelectedStudents(new Set())
        setBulkMode(null)
        toast.success(`تم تسجيل ${selectedStudents.size} طالب بنجاح`)
      },
      onError: () => {
        toast.error('فشل تسجيل الحضور المجمع')
      }
    }
  )

  const handleMarkAttendance = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    markAttendanceMutation.mutate({
      student_id: studentId,
      status,
      date: selectedDate,
    })
    toast.success('تم التسجيل', { duration: 1000 })
  }

  const handleBulkApply = () => {
    if (selectedStudents.size === 0 || !bulkMode) return
    bulkMarkMutation.mutate({
      student_ids: Array.from(selectedStudents),
      status: bulkMode === 'present' ? 'PRESENT' : 'ABSENT',
      date: selectedDate,
    })
  }

  const getAttendanceStatus = (studentId: number): AttendanceStatus => {
    const record = attendance?.find((a: any) => a.student_id === studentId)
    return record?.attendance_type || null
  }

  const toggleStudentSelection = (studentId: number) => {
    const newSet = new Set(selectedStudents)
    if (newSet.has(studentId)) {
      newSet.delete(studentId)
    } else {
      newSet.add(studentId)
    }
    setSelectedStudents(newSet)
  }

  const toggleQuickFilter = (filter: string) => {
    const newSet = new Set(quickFilters)
    if (newSet.has(filter)) {
      newSet.delete(filter)
    } else {
      newSet.add(filter)
    }
    setQuickFilters(newSet)
  }

  // Filter students based on quick filters
  const filteredStudents = useMemo(() => {
    if (!students) return []
    if (quickFilters.size === 0) return students

    return students.filter((student: any) => {
      const status = getAttendanceStatus(student.id)
      if (quickFilters.has('unmarked') && !status) return true
      if (quickFilters.has('present') && status === 'PRESENT') return true
      if (quickFilters.has('absent') && status === 'ABSENT') return true
      if (quickFilters.has('late') && status === 'LATE') return true
      return false
    })
  }, [students, quickFilters, attendance])

  const presentCount = Array.isArray(attendance) ? attendance.filter((a: any) => a.attendance_type === 'PRESENT').length : 0
  const absentCount = Array.isArray(attendance) ? attendance.filter((a: any) => a.attendance_type === 'ABSENT').length : 0
  const lateCount = Array.isArray(attendance) ? attendance.filter((a: any) => a.attendance_type === 'LATE').length : 0
  const unmarkedCount = (students?.length || 0) - (presentCount + absentCount + lateCount)
  const totalCount = students?.length || 0

  const isLoading = studentsLoading || attendanceLoading || markAttendanceMutation.isLoading

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - UAE Premium Design */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="العودة"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تسجيل الحضور</h1>
                <p className="text-sm text-gray-600 mt-1">سريع • دقيق • في أقل من 10 ثواني</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
        {/* Quick Stats - One glance view */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-card p-4 border border-emerald-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="text-2xl font-bold text-gray-900">{presentCount}</span>
            </div>
            <p className="text-xs text-gray-600">حاضر</p>
          </div>
          <div className="bg-white rounded-card p-4 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="text-gray-400" size={20} />
              <span className="text-2xl font-bold text-gray-900">{absentCount}</span>
            </div>
            <p className="text-xs text-gray-600">غائب</p>
          </div>
          <div className="bg-white rounded-card p-4 border border-gray-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-gray-400" size={20} />
              <span className="text-2xl font-bold text-gray-900">{lateCount}</span>
            </div>
            <p className="text-xs text-gray-600">متأخر</p>
          </div>
          <div className="bg-white rounded-card p-4 border border-amber-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-amber-500" size={20} />
              <span className="text-2xl font-bold text-gray-900">{unmarkedCount}</span>
            </div>
            <p className="text-xs text-gray-600">لم يسجل</p>
          </div>
        </div>

        {/* Filters & Bulk Actions Bar */}
        <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Class Filter */}
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">جميع الصفوف</option>
              <option value="1A">1A</option>
              <option value="2A">2A</option>
              <option value="3A">3A</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleQuickFilter('unmarked')}
                className={`px-3 py-1.5 rounded-card text-xs font-medium transition-all ${quickFilters.has('unmarked')
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-sand-50 text-gray-600 border border-sand-300 hover:bg-sand-100'
                  }`}
              >
                غير مسجل ({unmarkedCount})
              </button>
              <button
                onClick={() => toggleQuickFilter('present')}
                className={`px-3 py-1.5 rounded-card text-xs font-medium transition-all ${quickFilters.has('present')
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-sand-50 text-gray-600 border border-sand-300 hover:bg-sand-100'
                  }`}
              >
                حاضر ({presentCount})
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-sand-200">
            <span className="text-sm font-medium text-gray-700">إجراءات سريعة:</span>
            <button
              onClick={() => {
                setBulkMode(bulkMode === 'present' ? null : 'present')
                if (bulkMode !== 'present') {
                  // Select all unmarked students
                  const unmarkedIds = filteredStudents
                    .filter((s: any) => !getAttendanceStatus(s.id))
                    .map((s: any) => s.id)
                  setSelectedStudents(new Set(unmarkedIds))
                }
              }}
              className={`px-4 py-2 rounded-card text-sm font-medium transition-all flex items-center gap-2 ${bulkMode === 'present'
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
                  : 'bg-sand-50 text-gray-700 border border-sand-300 hover:bg-sand-100'
                }`}
            >
              <CheckCircle size={16} />
              تسجيل الحضور للكل
            </button>
            <button
              onClick={() => {
                setBulkMode(bulkMode === 'absent' ? null : 'absent')
                if (bulkMode !== 'absent') {
                  const unmarkedIds = filteredStudents
                    .filter((s: any) => !getAttendanceStatus(s.id))
                    .map((s: any) => s.id)
                  setSelectedStudents(new Set(unmarkedIds))
                }
              }}
              className={`px-4 py-2 rounded-card text-sm font-medium transition-all flex items-center gap-2 ${bulkMode === 'absent'
                  ? 'bg-red-100 text-red-700 border-2 border-red-400'
                  : 'bg-sand-50 text-gray-700 border border-sand-300 hover:bg-sand-100'
                }`}
            >
              <XCircle size={16} />
              تسجيل الغياب للكل
            </button>
            {bulkMode && selectedStudents.size > 0 && (
              <button
                onClick={handleBulkApply}
                disabled={bulkMarkMutation.isLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto"
              >
                {bulkMarkMutation.isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                تطبيق على {selectedStudents.size} طالب
              </button>
            )}
          </div>
        </div>

        {/* Students List - Optimized for speed */}
        <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">قائمة الطلاب</h2>
            <span className="text-sm text-gray-600">{filteredStudents.length} من {totalCount}</span>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="mx-auto animate-spin text-teal-600" size={32} />
              <p className="text-gray-600 mt-4">جاري التحميل...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">لا يوجد طلاب</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStudents.map((student: any) => {
                const status = getAttendanceStatus(student.id)
                const isSelected = selectedStudents.has(student.id)
                const isUnmarked = !status

                return (
                  <div
                    key={student.id}
                    className={`relative p-4 rounded-card border-2 transition-all ${status === 'PRESENT'
                        ? 'bg-emerald-50 border-emerald-200'
                        : status === 'ABSENT'
                          ? 'bg-red-50 border-red-200'
                          : status === 'LATE'
                            ? 'bg-amber-50 border-amber-200'
                            : bulkMode && isUnmarked
                              ? isSelected
                                ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-300'
                                : 'bg-white border-sand-200 hover:border-teal-300'
                              : 'bg-white border-sand-200 hover:border-teal-300'
                      }`}
                  >
                    {/* Selection checkbox in bulk mode */}
                    {bulkMode && isUnmarked && (
                      <button
                        onClick={() => toggleStudentSelection(student.id)}
                        className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                            ? 'bg-teal-600 border-teal-600'
                            : 'bg-white border-gray-300'
                          }`}
                      >
                        {isSelected && <Check size={14} className="text-white" />}
                      </button>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm mb-1">{student.full_name}</p>
                        <p className="text-xs text-gray-600">{student.class_name || student.grade}</p>
                      </div>
                      {status && (
                        <div className="ml-3">
                          {status === 'PRESENT' && (
                            <CheckCircle className="text-emerald-500" size={20} />
                          )}
                          {status === 'ABSENT' && (
                            <XCircle className="text-red-500" size={20} />
                          )}
                          {status === 'LATE' && (
                            <Clock className="text-amber-500" size={20} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick action buttons - One tap */}
                    {!status && !bulkMode && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'PRESENT')}
                          className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-card text-xs font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} />
                          حاضر
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'ABSENT')}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-card text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} />
                          غائب
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'LATE')}
                          className="px-3 py-2 bg-amber-500 text-white rounded-card text-xs font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
                        >
                          <Clock size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
