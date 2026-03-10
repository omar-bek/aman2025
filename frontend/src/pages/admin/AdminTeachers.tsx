import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Search, Plus, Mail, Phone, ArrowRight, CheckCircle, XCircle, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'

interface TeacherFormData {
  full_name: string
  email: string
  phone: string
  password: string
  specialization: string
}

export default function AdminTeachers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState<TeacherFormData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
  })
  const queryClient = useQueryClient()

  const {
    data: teachers,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    'admin-teachers',
    async () => {
      try {
        console.log('Fetching teachers from /staff/teachers/')
        const response = await apiClient.get('/staff/teachers/')
        console.log('Teachers response:', response.data)
        if (Array.isArray(response.data)) {
          return response.data
        }
        return []
      } catch (error: any) {
        console.error('Error fetching teachers:', error)
        console.error('Error response:', error?.response)
        console.error('Error status:', error?.response?.status)
        console.error('Error data:', error?.response?.data)

        if (error?.response?.status === 403) {
          toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة')
        } else if (error?.response?.status === 401) {
          toast.error('يرجى تسجيل الدخول مرة أخرى')
        } else {
          const errorMessage = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'فشل تحميل قائمة المدرسين'
          toast.error(errorMessage)
        }

        throw error
      }
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        console.error('Query error:', error)
      }
    }
  )

  const createMutation = useMutation(
    async (data: TeacherFormData) => {
      const response = await apiClient.post('/auth/register', {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'teacher',
      })

      // If teacher was created and has specialization, add it
      if (response.data?.id && data.specialization?.trim()) {
        try {
          await apiClient.post(`/staff/teachers/${response.data.id}/specialization?specialization=${encodeURIComponent(data.specialization)}`)
        } catch (error) {
          console.error('Error adding specialization:', error)
          // Don't fail the whole operation if specialization fails
        }
      }

      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-teachers')
        toast.success('تم إضافة المدرس بنجاح')
        setShowCreateModal(false)
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          password: '',
          specialization: '',
        })
      },
      onError: (error: any) => {
        const message = error?.response?.data?.detail || 'فشل إضافة المدرس'
        toast.error(message)
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    createMutation.mutate(formData)
  }

  const teachersArray = Array.isArray(teachers) ? teachers : []
  const filteredTeachers = teachersArray.filter((teacher: any) =>
    teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalTeachers = teachersArray.length || 0
  const activeTeachers = teachersArray.filter((t: any) => t.is_active).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة المدرسين</h1>
                <p className="text-white/90">عرض وإدارة بيانات المدرسين</p>
              </div>
            </div>
            <button
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              إضافة مدرس
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {isError && !isLoading && (
          <ErrorState
            title="تعذر تحميل بيانات المدرسين"
            description="حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من الاتصال أو المحاولة مرة أخرى."
            onRetry={() => refetch()}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المدرسين</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeachers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">مدرسين نشطين</p>
                <p className="text-3xl font-bold text-gray-900">{activeTeachers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <XCircle className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">مدرسين غير نشطين</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeachers - activeTeachers}</p>
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
                  placeholder="ابحث عن مدرس بالاسم أو البريد أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-2 mb-2">
                <GraduationCap className="text-gray-500" size={18} />
                الحالة
              </label>
              <select className="input-field">
                <option value="">جميع المدرسين</option>
                <option value="active">نشط فقط</option>
                <option value="inactive">غير نشط فقط</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {isLoading ? (
          <LoadingState />
        ) : filteredTeachers && filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeachers.map((teacher: any) => (
              <div
                key={teacher.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${teacher.is_active
                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                      }`}>
                      <GraduationCap className="text-white" size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{teacher.full_name}</h3>
                      <p className="text-sm text-gray-600 truncate">{teacher.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${teacher.is_active
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {teacher.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Mail className="text-blue-600" size={16} />
                    <span className="text-sm text-gray-700 truncate">{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <Phone className="text-purple-600" size={16} />
                      <span className="text-sm text-gray-700">{teacher.phone}</span>
                    </div>
                  )}
                  {teacher.specialization && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                      <GraduationCap className="text-amber-600" size={16} />
                      <span className="text-sm text-gray-700 truncate">{teacher.specialization}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/admin/teachers/${teacher.id}`)
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
            <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium mb-2">لا توجد نتائج</p>
            <p className="text-gray-500 text-sm">جرب البحث بكلمات مختلفة أو قم بتغيير الفلاتر</p>
          </div>
        )}
      </div>

      {/* Create Teacher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">إضافة مدرس جديد</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="مثال: رياضيات، علوم، لغة عربية"
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">يمكن إضافة أكثر من تخصص مفصولة بفاصلة</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isLoading ? 'جاري الإضافة...' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
