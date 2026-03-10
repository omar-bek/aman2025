import { useQuery } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react'
import apiClient from '../../api/client'

export default function AdminTeacherDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: teacher, isLoading } = useQuery(
    ['admin-teacher-detail', id],
    async () => {
      try {
        const response = await apiClient.get(`/staff/teachers/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching teacher details:', error)
        return null
      }
    },
    {
      enabled: !!id,
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">المدرس غير موجود</p>
            <button
              onClick={() => navigate('/admin/teachers')}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              العودة لقائمة المدرسين
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/teachers')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">تفاصيل المدرس</h1>
                <p className="text-white/90">{teacher.full_name}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold ${
                teacher.is_active
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {teacher.is_active ? 'نشط' : 'غير نشط'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Teacher Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المعلومات الشخصية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الاسم الكامل</p>
                <p className="text-lg font-bold text-gray-900">{teacher.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                <p className="text-lg font-bold text-gray-900">{teacher.email}</p>
              </div>
            </div>
            {teacher.phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">رقم الهاتف</p>
                  <p className="text-lg font-bold text-gray-900">{teacher.phone}</p>
                </div>
              </div>
            )}
            {teacher.specialization && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">التخصص</p>
                  <p className="text-lg font-bold text-gray-900">{teacher.specialization}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-900">{teacher.total_students || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الواجبات</p>
                <p className="text-3xl font-bold text-gray-900">{teacher.assignments_count || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">الصفوف</p>
                <p className="text-3xl font-bold text-gray-900">{teacher.classes?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes */}
        {teacher.classes && teacher.classes.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">الصفوف المخصصة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacher.classes.map((classItem: any) => (
                <div
                  key={classItem.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-400 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{classItem.class_name}</h3>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                      {classItem.grade}
                    </span>
                  </div>
                  {classItem.subject && (
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="text-gray-500" size={16} />
                      <span className="text-sm text-gray-700">{classItem.subject}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-700">{classItem.student_count} طالب</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


