import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Users, Eye, GraduationCap } from 'lucide-react'
import { studentsAPI } from '../../api'
import toast from 'react-hot-toast'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'

export default function StaffStudents() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useQuery('students', studentsAPI.getAll, {
    retry: 1,
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'تعذر تحميل بيانات الطلاب'
      toast.error(message)
    },
  })

  const studentsArray = Array.isArray(students) ? students : []
  const filteredStudents = studentsArray.filter((student: any) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewStudent = (studentId: number) => {
    navigate(`/staff/students/${studentId}`)
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
              <Users className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الطلاب</h1>
                <p className="text-white/90">عرض وإدارة بيانات الطلاب</p>
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
              placeholder="ابحث عن طالب بالاسم أو الرقم أو الصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {isError && !isLoading && (
          <ErrorState
            title="تعذر تحميل بيانات الطلاب"
            description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
            onRetry={() => refetch()}
          />
        )}

        {/* Students Grid */}
        {isLoading ? (
          <LoadingState />
        ) : filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student: any) => (
              <div
              key={student._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>الصف: {student.grade} - الفصل: {student.class}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewStudent(student._id)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  عرض التفاصيل
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا يوجد طلاب</p>
          </div>
        )}
      </div>
    </div>
  )
}

