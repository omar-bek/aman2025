import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { studentsAPI } from '../../api'
import { evaluationsAPI } from '../../api/teacher'
import { Plus, Search, Award, Calendar, User, CheckCircle, AlertCircle, Clock, TrendingUp, BarChart3, Filter, ArrowRight, Edit, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

interface StudentEvaluation {
  id: number
  student_id: number
  student_name?: string
  evaluation_type: 'daily' | 'monthly'
  commitment?: 'excellent' | 'good' | 'needs_support'
  commitment_level?: 'excellent' | 'good' | 'needs_support'
  interaction?: 'excellent' | 'good' | 'needs_support'
  interaction_level?: 'excellent' | 'good' | 'needs_support'
  behavior?: 'excellent' | 'good' | 'needs_support'
  behavior_level?: 'excellent' | 'good' | 'needs_support'
  participation?: 'excellent' | 'good' | 'needs_support'
  participation_level?: 'excellent' | 'good' | 'needs_support'
  notes?: string
  educational_notes?: string
  evaluation_date: string
  created_at: string
}

export default function TeacherEvaluations() {
  const navigate = useNavigate()
  const [evaluationType, setEvaluationType] = useState<'daily' | 'monthly'>('daily')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const queryClient = useQueryClient()

  const { data: students } = useQuery('students', studentsAPI.getAll)

  const { data: evaluations, isLoading } = useQuery(
    ['evaluations', evaluationType],
    async () => {
      try {
        const response = await apiClient.get('/teacher/evaluations/', {
          params: { evaluation_type: evaluationType }
        })
        return response.data || []
      } catch (error) {
        console.error('Error fetching evaluations:', error)
        return []
      }
    }
  )

  const { data: pendingCount } = useQuery(
    'pending-evaluations-count',
    async () => {
      try {
        const response = await apiClient.get('/teacher/evaluations/pending/count')
        return response.data?.count || 0
      } catch (error) {
        return 0
      }
    }
  )

  // Calculate statistics
  const stats = {
    total: Array.isArray(evaluations) ? evaluations.length : 0,
    today: Array.isArray(evaluations) ? evaluations.filter((e: StudentEvaluation) => {
      const evalDate = new Date(e.evaluation_date || e.created_at)
      const today = new Date()
      return evalDate.toDateString() === today.toDateString()
    }).length : 0,
    excellent: Array.isArray(evaluations) ? evaluations.filter((e: StudentEvaluation) => {
      const level = e.commitment_level || e.commitment || e.interaction_level || e.interaction
      return level === 'excellent'
    }).length : 0,
    needsSupport: Array.isArray(evaluations) ? evaluations.filter((e: StudentEvaluation) => {
      const level = e.commitment_level || e.commitment || e.interaction_level || e.interaction
      return level === 'needs_support'
    }).length : 0,
  }

  // Filter evaluations
  const filteredEvaluations = Array.isArray(evaluations) ? evaluations.filter((evaluation: StudentEvaluation) => {
    const matchesSearch =
      (evaluation.student_name || `طالب #${evaluation.student_id}`)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesClass = !selectedClass || true // Can add class filter if needed
    return matchesSearch && matchesClass
  }) : []

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'needs_support':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'excellent':
        return 'ممتاز'
      case 'good':
        return 'جيد'
      case 'needs_support':
        return 'يحتاج دعم'
      default:
        return 'غير محدد'
    }
  }

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
              <Award className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">تقييم الطلاب</h1>
                <p className="text-white/90">تقييم تربوي إنساني وداعم</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/teacher/evaluations/new')}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              تقييم جديد
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي التقييمات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">تقييمات اليوم</p>
                <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">تقييمات ممتازة</p>
                <p className="text-3xl font-bold text-gray-900">{stats.excellent}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">تحتاج دعم</p>
                <p className="text-3xl font-bold text-gray-900">{stats.needsSupport}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Evaluations Alert */}
        {pendingCount && pendingCount > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">هناك {pendingCount} طلاب يحتاجون تقييم</p>
                <p className="text-sm text-gray-600">تأكد من تقييم جميع الطلاب اليوم</p>
              </div>
              <button
                onClick={() => navigate('/teacher/evaluations/new')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold"
              >
                تقييم الآن
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs and Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEvaluationType('daily')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${evaluationType === 'daily'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Calendar size={18} />
                التقييم اليومي
              </button>
              <button
                onClick={() => setEvaluationType('monthly')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${evaluationType === 'monthly'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <TrendingUp size={18} />
                التقييم الشهري
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
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
        </div>

        {/* Evaluations List */}
        {isLoading ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredEvaluations && filteredEvaluations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvaluations.map((evaluation: StudentEvaluation) => {
              const commitment = evaluation.commitment_level || evaluation.commitment
              const interaction = evaluation.interaction_level || evaluation.interaction
              const behavior = evaluation.behavior_level || evaluation.behavior
              const participation = evaluation.participation_level || evaluation.participation

              return (
                <div
                  key={evaluation.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {evaluation.student_name || `طالب #${evaluation.student_id}`}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="text-gray-400" size={14} />
                          <p className="text-sm text-gray-600">
                            {new Date(evaluation.evaluation_date || evaluation.created_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${evaluationType === 'daily'
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-purple-100 text-purple-700 border-purple-300'
                            }`}>
                            {evaluationType === 'daily' ? 'يومي' : 'شهري'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evaluation Details */}
                  {evaluationType === 'daily' ? (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-gray-400" size={16} />
                          <span className="text-sm font-medium text-gray-700">الالتزام</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(commitment)}`}>
                          {getStatusText(commitment)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="text-gray-400" size={16} />
                          <span className="text-sm font-medium text-gray-700">التفاعل</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(interaction)}`}>
                          {getStatusText(interaction)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <Award className="text-gray-400" size={16} />
                          <span className="text-sm font-medium text-gray-700">السلوك</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(behavior)}`}>
                          {getStatusText(behavior)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <User className="text-gray-400" size={16} />
                          <span className="text-sm font-medium text-gray-700">المشاركة</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(participation)}`}>
                          {getStatusText(participation)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {evaluation.commitment_level && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-sm font-medium text-gray-700">تطور الالتزام</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(evaluation.commitment_level)}`}>
                            {getStatusText(evaluation.commitment_level)}
                          </span>
                        </div>
                      )}
                      {evaluation.interaction_level && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-sm font-medium text-gray-700">تطور التفاعل</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(evaluation.interaction_level)}`}>
                            {getStatusText(evaluation.interaction_level)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Preview */}
                  {(evaluation.notes || evaluation.educational_notes) && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {evaluation.educational_notes || evaluation.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/teacher/evaluations/${evaluation.id}`)}
                      className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={() => navigate(`/teacher/students/${evaluation.student_id}`)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-bold text-sm"
                      title="عرض الملف الشخصي"
                    >
                      <User size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Award className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">لا توجد تقييمات {searchTerm && `مطابقة للبحث`}</p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/teacher/evaluations/new')}
                className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
              >
                إنشاء تقييم جديد
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
