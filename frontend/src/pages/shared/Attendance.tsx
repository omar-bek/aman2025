import { useQuery } from 'react-query'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Calendar, CheckCircle, XCircle, Clock, Users, GraduationCap, User, Search, Filter } from 'lucide-react'
import apiClient from '../../api/client'
import { studentsAPI, attendanceAPI } from '../../api'

type AttendanceType = 'students' | 'teachers' | 'staff'

export default function Attendance() {
  const { user } = useAuthStore()
  const [selectedType, setSelectedType] = useState<AttendanceType>('students')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null)

  // Get students
  const { data: students } = useQuery('students', studentsAPI.getAll, {
    enabled: selectedType === 'students'
  })

  // Get teachers
  const { data: teachers } = useQuery(
    'admin-teachers',
    async () => {
      try {
        const response = await apiClient.get('/staff/teachers/')
        return response.data || []
      } catch (error) {
        return []
      }
    },
    { enabled: selectedType === 'teachers' }
  )

  // Get staff
  const { data: staff } = useQuery(
    'staff-list',
    async () => {
      try {
        const response = await apiClient.get('/staff/teachers/') // Using same endpoint for now
        return Array.isArray(response.data) ? response.data.filter((s: any) => s.role === 'staff') : []
      } catch (error) {
        return []
      }
    },
    { enabled: selectedType === 'staff' }
  )

  // Get attendance for selected person
  const { data: attendance, isLoading: attendanceLoading } = useQuery(
    ['attendance', selectedType, selectedPerson],
    async () => {
      if (!selectedPerson) return []

      if (selectedType === 'students') {
        try {
          const response = await apiClient.get(`/attendance/student/${selectedPerson}`)
          console.log('Attendance data:', response.data)
          return response.data || []
        } catch (error) {
          console.error('Error fetching attendance:', error)
          return []
        }
      }
      // For teachers and staff, return mock data for now
      return []
    },
    { enabled: !!selectedPerson }
  )

  // Get list based on selected type
  const peopleList = selectedType === 'students'
    ? students
    : selectedType === 'teachers'
      ? teachers
      : staff

  // Filter people list
  const filteredPeople = Array.isArray(peopleList) ? peopleList.filter((person: any) =>
    person.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.student_id && person.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : []

  // Filter attendance by selected date
  const filteredAttendance = Array.isArray(attendance) ? attendance.filter((a: any) => {
    if (!a.date) return false
    const recordDate = new Date(a.date).toISOString().split('T')[0]
    return recordDate === selectedDate
  }) : []

  // Calculate stats for all attendance (not just today)
  const presentCount = Array.isArray(attendance) ? attendance.filter((a: any) => a.status === 'present' || a.status === 'PRESENT').length : 0
  const absentCount = Array.isArray(attendance) ? attendance.filter((a: any) => a.status === 'absent' || a.status === 'ABSENT').length : 0
  const lateCount = Array.isArray(attendance) ? attendance.filter((a: any) => a.status === 'late' || a.status === 'LATE').length : 0

  const getTypeLabel = () => {
    switch (selectedType) {
      case 'students': return 'الطلاب'
      case 'teachers': return 'المدرسين'
      case 'staff': return 'الاستاف'
      default: return 'الطلاب'
    }
  }

  const getTypeIcon = () => {
    switch (selectedType) {
      case 'students': return Users
      case 'teachers': return GraduationCap
      case 'staff': return User
      default: return Users
    }
  }

  const TypeIcon = getTypeIcon()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">الحضور والغياب</h1>
                <p className="text-white/90">تتبع حضور {getTypeLabel()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Type Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedType('students')
                setSelectedPerson(null)
              }}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${selectedType === 'students'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={20} />
                <span>الطلاب</span>
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedType('teachers')
                setSelectedPerson(null)
              }}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${selectedType === 'teachers'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <GraduationCap size={20} />
                <span>المدرسين</span>
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedType('staff')
                setSelectedPerson(null)
              }}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${selectedType === 'staff'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User size={20} />
                <span>الاستاف</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats */}
        {selectedPerson && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">حاضر</p>
                  <p className="text-3xl font-bold text-gray-900">{presentCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <XCircle className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">غائب</p>
                  <p className="text-3xl font-bold text-gray-900">{absentCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">متأخر</p>
                  <p className="text-3xl font-bold text-gray-900">{lateCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">التاريخ</p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* People List */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="mb-4">
              <label className="label flex items-center gap-2 mb-2">
                <Search className="text-gray-500" size={18} />
                البحث
              </label>
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`ابحث عن ${getTypeLabel().toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPeople?.map((person: any) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPerson(person.id)}
                  className={`w-full text-right p-4 rounded-xl transition-all ${selectedPerson === person.id
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPerson === person.id
                        ? 'bg-primary-600'
                        : 'bg-gray-300'
                      }`}>
                      <TypeIcon className="text-white" size={24} />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-bold text-gray-900">{person.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {person.email || person.student_id || 'لا يوجد معرف'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Records */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">سجل الحضور</h2>
            {selectedPerson ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {attendanceLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل سجل الحضور...</p>
                  </div>
                ) : filteredAttendance && filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record: any) => {
                    const status = record.status?.toLowerCase() || record.status

                    return (
                      <div
                        key={record.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 ${status === 'present' || status === 'PRESENT'
                            ? 'bg-green-50 border-green-200'
                            : status === 'absent' || status === 'ABSENT'
                              ? 'bg-red-50 border-red-200'
                              : status === 'late' || status === 'LATE'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-blue-50 border-blue-200'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          {status === 'present' || status === 'PRESENT' ? (
                            <CheckCircle className="text-green-600" size={24} />
                          ) : status === 'absent' || status === 'ABSENT' ? (
                            <XCircle className="text-red-600" size={24} />
                          ) : status === 'late' || status === 'LATE' ? (
                            <Clock className="text-yellow-600" size={24} />
                          ) : (
                            <Clock className="text-blue-600" size={24} />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {record.date ? new Date(record.date).toLocaleDateString('ar-SA', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'تاريخ غير محدد'}
                            </p>
                            <p className={`text-sm font-bold ${status === 'present' || status === 'PRESENT'
                                ? 'text-green-700'
                                : status === 'absent' || status === 'ABSENT'
                                  ? 'text-red-700'
                                  : status === 'late' || status === 'LATE'
                                    ? 'text-yellow-700'
                                    : 'text-blue-700'
                              }`}>
                              {status === 'present' || status === 'PRESENT'
                                ? '✅ حاضر'
                                : status === 'absent' || status === 'ABSENT'
                                  ? '❌ غائب'
                                  : status === 'late' || status === 'LATE'
                                    ? '⏰ متأخر'
                                    : '📝 معذور'}
                            </p>
                          </div>
                        </div>
                        {record.notes && (
                          <p className="text-sm text-gray-600 max-w-xs truncate" title={record.notes}>
                            {record.notes}
                          </p>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-600 mb-2">لا توجد سجلات حضور لهذا التاريخ</p>
                    <p className="text-sm text-gray-500">جرب اختيار تاريخ آخر أو تحقق من وجود سجلات</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <TypeIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-600">اختر {getTypeLabel().toLowerCase()} لعرض سجل الحضور</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
