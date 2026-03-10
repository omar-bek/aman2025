import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { studentsAPI } from '../../api'
import { ArrowRight, Users, Search, User, BookOpen, Award, Calendar } from 'lucide-react'
import apiClient from '../../api/client'

export default function TeacherStudents() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  
  const { data: students, isLoading } = useQuery(
    ['teacher-students', selectedClass],
    async () => {
      try {
        const params = selectedClass ? { class_name: selectedClass } : {}
        const response = await apiClient.get('/teacher/students/', { params })
        const data = response.data

        // Normalize to a plain array in all cases
        if (Array.isArray(data)) {
          return data
        }
        if (data && Array.isArray(data.items)) {
          return data.items
        }
        if (data && Array.isArray(data.results)) {
          return data.results
        }
        return []
      } catch (error) {
        console.error('Error fetching students:', error)
        // Fallback to general students API
        return await studentsAPI.getAll()
      }
    }
  )

  const { data: classes } = useQuery(
    'teacher-classes',
    async () => {
      try {
        const response = await apiClient.get('/teacher/dashboard/classes')
        return response.data || []
      } catch (error) {
        return []
      }
    }
  )

  const studentsArray = Array.isArray(students) ? students : []

  const filteredStudents = studentsArray.filter((student: any) => {
    const name = (student.name || '').toString().toLowerCase()
    const studentId = (student.studentId || '').toString().toLowerCase()
    const className = (student.class || '').toString().toLowerCase()
    const term = searchTerm.toLowerCase()

    return name.includes(term) || studentId.includes(term) || className.includes(term)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Users className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">الطلاب</h1>
                <p className="text-white/90">عرض وإدارة الطلاب</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">البحث</label>
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="label">الصف</label>
              <select
                className="input-field"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">جميع الصفوف</option>
                {classes?.map((cls: any) => (
                  <option key={cls.id} value={cls.class_name}>
                    {cls.class_name} - {cls.grade}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student: any) => (
              <div
                key={student._id}
                onClick={() => navigate(`/teacher/students/${student._id}`)}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                      <User className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">#{student.studentId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    student.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {student.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen size={16} />
                      <span>{student.class || student.grade || 'غير محدد'}</span>
                  </div>
                  {student.grade && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award size={16} />
                      <span>الصف: {student.grade}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/teacher/students/${student.id}`)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-bold text-sm"
                  >
                    عرض الملف الشخصي
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/teacher/messages?student_id=${student.id}`)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="إرسال رسالة"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا يوجد طلاب</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-900">{studentsArray.length}</p>
              </div>
              <Users className="text-primary-600" size={32} />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الطلاب النشطون</p>
                <p className="text-3xl font-bold text-green-600">
                  {studentsArray.filter((s: any) => s.is_active).length}
                </p>
              </div>
              <User className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الصفوف</p>
                <p className="text-3xl font-bold text-blue-600">{classes?.length || 0}</p>
              </div>
              <BookOpen className="text-blue-600" size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

