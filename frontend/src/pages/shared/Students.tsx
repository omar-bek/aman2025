import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import { Users, Search, Plus, User, GraduationCap, ArrowRight, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Students() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const { data: students, isLoading } = useQuery('students', studentsAPI.getAll)
  
  const studentsArray = Array.isArray(students) ? students : []
  // Get unique grades
  const grades = studentsArray.length > 0 ? [...new Set(studentsArray.map((s: any) => s.grade).filter(Boolean))] : []
  
  const handleViewStudent = (studentId: number) => {
    if (user?.role === 'teacher') {
      navigate(`/teacher/students/${studentId}`)
    } else {
      // For admin/staff - navigate to general student view
      navigate(`/dashboard/students/${studentId}`)
    }
  }

  const filteredStudents = studentsArray.filter(
    (student: any) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesGrade = !selectedGrade || student.grade === selectedGrade
      
      return matchesSearch && matchesGrade
    }
  )

  const totalStudents = studentsArray.length || 0
  const activeStudents = studentsArray.filter((s: any) => s.is_active).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الطلاب</h1>
                <p className="text-white/90">عرض وإدارة بيانات الطلاب</p>
              </div>
            </div>
            <button 
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
              onClick={() => {/* TODO: Add student modal */}}
            >
              <Plus size={20} />
              إضافة طالب
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">طلاب نشطين</p>
                <p className="text-3xl font-bold text-gray-900">{activeStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <XCircle className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">طلاب غير نشطين</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents - activeStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-2 mb-2">
                <Search className="text-gray-500" size={18} />
                البحث
              </label>
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
            <div>
              <label className="label flex items-center gap-2 mb-2">
                <GraduationCap className="text-gray-500" size={18} />
                المرحلة
              </label>
              <select
                className="input-field"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">جميع المراحل</option>
                {grades.map((grade: string) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student: any) => (
              <div
                key={student._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => handleViewStudent(student.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                      student.is_active 
                        ? 'bg-gradient-to-br from-primary-400 to-primary-600' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      <User className="text-white" size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                    <p className="text-sm text-gray-600">#{student.studentId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                    student.is_active
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {student.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {student.grade && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <GraduationCap className="text-blue-600" size={16} />
                      <span className="text-sm text-gray-700">المرحلة: {student.grade}</span>
                    </div>
                  )}
                  {student.class_name && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <Users className="text-purple-600" size={16} />
                      <span className="text-sm text-gray-700">الصف: {student.class_name}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewStudent(student.id)
                  }}
                  className="w-full mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-primary-200"
                >
                  <Eye size={16} />
                  عرض التفاصيل
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium mb-2">لا توجد نتائج</p>
            <p className="text-gray-500 text-sm">جرب البحث بكلمات مختلفة أو قم بتغيير الفلاتر</p>
          </div>
        )}
      </div>
    </div>
  )
}
