import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Users, Search, GraduationCap, ArrowRight, CheckCircle, XCircle, Eye, BookOpen, User } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'

export default function AdminClasses() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  
  const {
    data: classes,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    'admin-classes',
    async () => {
      try {
        const response = await apiClient.get('/admin/classes/')
        return response.data || []
      } catch (error: any) {
        console.error('Error fetching classes:', error)
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'تعذر تحميل بيانات الصفوف'
        toast.error(message)
        throw error
      }
    }
  )

  const classesArray = Array.isArray(classes) ? classes : []
  // Get unique grades
  const grades = classesArray.length > 0 ? [...new Set(classesArray.map((c: any) => c.grade).filter(Boolean))] : []

  const filteredClasses = classesArray.filter(
    (cls: any) => {
      const matchesSearch = 
        cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesGrade = !selectedGrade || cls.grade === selectedGrade
      
      return matchesSearch && matchesGrade
    }
  )

  const totalClasses = classesArray.length || 0
  const totalStudents = classesArray.reduce((sum: number, cls: any) => sum + (cls.student_count || 0), 0) || 0
  const classesWithTeachers = classesArray.filter((c: any) => c.teacher_name).length || 0

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
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الصفوف</h1>
                <p className="text-white/90">عرض وإدارة الصفوف الدراسية</p>
              </div>
            </div>
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
                <p className="text-sm text-gray-600 mb-1">إجمالي الصفوف</p>
                <p className="text-3xl font-bold text-gray-900">{totalClasses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">صفوف مع مدرسين</p>
                <p className="text-3xl font-bold text-gray-900">{classesWithTeachers}</p>
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
                  placeholder="ابحث عن صف بالاسم أو المرحلة أو المدرس..."
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
                {(grades as string[]).map((grade: string) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isError && !isLoading && (
          <ErrorState
            title="تعذر تحميل بيانات الصفوف"
            description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
            onRetry={() => refetch()}
          />
        )}

        {/* Classes Grid */}
        {isLoading ? (
          <LoadingState />
        ) : filteredClasses && filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredClasses.map((cls: any) => (
              <div
                key={cls.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-primary-400 to-primary-600">
                      <Users className="text-white" size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{cls.class_name}</h3>
                      <p className="text-sm text-gray-600">المرحلة: {cls.grade}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Users className="text-blue-600" size={16} />
                    <span className="text-sm text-gray-700">{cls.student_count || 0} طالب</span>
                  </div>
                  {cls.teacher_name && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <GraduationCap className="text-green-600" size={16} />
                      <span className="text-sm text-gray-700 truncate">المدرس: {cls.teacher_name}</span>
                    </div>
                  )}
                  {cls.subject && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <BookOpen className="text-purple-600" size={16} />
                      <span className="text-sm text-gray-700 truncate">{cls.subject}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Navigate to class details or students in this class
                    navigate(`/students?class=${encodeURIComponent(cls.class_name)}&grade=${encodeURIComponent(cls.grade)}`)
                  }}
                  className="w-full mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-primary-200"
                >
                  <Eye size={16} />
                  عرض الطلاب
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
