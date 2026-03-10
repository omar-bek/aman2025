import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { studentsAPI } from '../../api'
import { ArrowRight, Award, User, Calendar, Edit, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

interface StudentEvaluation {
  id: number
  student_id: number
  student_name?: string
  evaluation_type: 'daily' | 'monthly'
  evaluation_date: string
  commitment_level?: 'excellent' | 'good' | 'needs_support'
  interaction_level?: 'excellent' | 'good' | 'needs_support'
  behavior_level?: 'excellent' | 'good' | 'needs_support'
  participation_level?: 'excellent' | 'good' | 'needs_support'
  performance_trend?: 'excellent' | 'good' | 'needs_support'
  interaction_trend?: 'excellent' | 'good' | 'needs_support'
  commitment_trend?: 'excellent' | 'good' | 'needs_support'
  educational_notes?: string
  private_notes?: string
  shared_notes?: string
  created_at: string
  updated_at?: string
}

export default function TeacherEvaluationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const { data: evaluation, isLoading } = useQuery(
    ['evaluation', id],
    async () => {
      try {
        const response = await apiClient.get(`/teacher/evaluations/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching evaluation:', error)
        throw error
      }
    },
    { enabled: !!id, retry: false }
  )

  const { data: student } = useQuery(
    ['student', evaluation?.student_id],
    () => studentsAPI.getById(evaluation!.student_id),
    { enabled: !!evaluation?.student_id }
  )

  const [formData, setFormData] = useState<Partial<StudentEvaluation>>({})

  useEffect(() => {
    if (evaluation) {
      setFormData({
        commitment_level: evaluation.commitment_level || 'good',
        interaction_level: evaluation.interaction_level || 'good',
        behavior_level: evaluation.behavior_level || 'good',
        participation_level: evaluation.participation_level || 'good',
        performance_trend: evaluation.performance_trend,
        interaction_trend: evaluation.interaction_trend,
        commitment_trend: evaluation.commitment_trend,
        educational_notes: evaluation.educational_notes || '',
        private_notes: evaluation.private_notes || '',
        shared_notes: evaluation.shared_notes || '',
      })
    }
  }, [evaluation])

  const updateMutation = useMutation(
    async (data: Partial<StudentEvaluation>) => {
      // Map frontend fields to backend schema
      const backendData = {
        student_id: evaluation!.student_id,
        evaluation_type: evaluation!.evaluation_type,
        evaluation_date: evaluation!.evaluation_date,
        commitment_level: data.commitment_level,
        interaction_level: data.interaction_level,
        behavior_level: data.behavior_level,
        participation_level: data.participation_level,
        performance_trend: data.performance_trend,
        interaction_trend: data.interaction_trend,
        commitment_trend: data.commitment_trend,
        educational_notes: data.educational_notes,
        private_notes: data.private_notes,
        shared_notes: data.shared_notes,
      }
      const response = await apiClient.put(`/teacher/evaluations/${id}`, backendData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['evaluation', id])
        queryClient.invalidateQueries('evaluations')
        toast.success('تم تحديث التقييم بنجاح')
        setIsEditing(false)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل تحديث التقييم')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Award className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">التقييم غير موجود</p>
          <button
            onClick={() => navigate('/teacher/evaluations')}
            className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    )
  }

  const isDaily = evaluation.evaluation_type === 'daily'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/teacher/evaluations')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Award className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {isDaily ? 'التقييم اليومي' : 'التقييم الشهري'}
                </h1>
                <p className="text-white/90">
                  {student?.full_name || `طالب #${evaluation.student_id}`}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
              >
                <Edit size={20} />
                تعديل
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Student Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student?.full_name || `طالب #${evaluation.student_id}`}</h2>
              <p className="text-sm text-gray-600">{student?.class_name || student?.grade || 'غير محدد'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {new Date(evaluation.evaluation_date).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {isDaily ? (
              /* Daily Evaluation Fields */
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">التقييم اليومي</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">الالتزام</label>
                    <select
                      className="input-field"
                      value={formData.commitment_level || 'good'}
                      onChange={(e) => setFormData({ ...formData, commitment_level: e.target.value as any })}
                    >
                      <option value="excellent">ممتاز</option>
                      <option value="good">جيد</option>
                      <option value="needs_support">يحتاج دعم</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">التفاعل</label>
                    <select
                      className="input-field"
                      value={formData.interaction_level || 'good'}
                      onChange={(e) => setFormData({ ...formData, interaction_level: e.target.value as any })}
                    >
                      <option value="excellent">ممتاز</option>
                      <option value="good">جيد</option>
                      <option value="needs_support">يحتاج دعم</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">السلوك</label>
                    <select
                      className="input-field"
                      value={formData.behavior_level || 'good'}
                      onChange={(e) => setFormData({ ...formData, behavior_level: e.target.value as any })}
                    >
                      <option value="excellent">ممتاز</option>
                      <option value="good">جيد</option>
                      <option value="needs_support">يحتاج دعم</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">المشاركة</label>
                    <select
                      className="input-field"
                      value={formData.participation_level || 'good'}
                      onChange={(e) => setFormData({ ...formData, participation_level: e.target.value as any })}
                    >
                      <option value="excellent">ممتاز</option>
                      <option value="good">جيد</option>
                      <option value="needs_support">يحتاج دعم</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="label">ملاحظات تربوية</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={formData.educational_notes || ''}
                    onChange={(e) => setFormData({ ...formData, educational_notes: e.target.value })}
                    placeholder="ملاحظات داعمة وتربوية..."
                  />
                </div>
              </div>
            ) : (
              /* Monthly Evaluation Fields */
              <>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">التقييم الشهري</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">تطور الأداء</label>
                      <select
                        className="input-field"
                        value={formData.performance_trend || ''}
                        onChange={(e) => setFormData({ ...formData, performance_trend: e.target.value as any })}
                      >
                        <option value="">اختر...</option>
                        <option value="excellent">ممتاز</option>
                        <option value="good">جيد</option>
                        <option value="needs_support">يحتاج دعم</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">تطور التفاعل</label>
                      <select
                        className="input-field"
                        value={formData.interaction_trend || ''}
                        onChange={(e) => setFormData({ ...formData, interaction_trend: e.target.value as any })}
                      >
                        <option value="">اختر...</option>
                        <option value="excellent">ممتاز</option>
                        <option value="good">جيد</option>
                        <option value="needs_support">يحتاج دعم</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">تطور الالتزام</label>
                      <select
                        className="input-field"
                        value={formData.commitment_trend || ''}
                        onChange={(e) => setFormData({ ...formData, commitment_trend: e.target.value as any })}
                      >
                        <option value="">اختر...</option>
                        <option value="excellent">ممتاز</option>
                        <option value="good">جيد</option>
                        <option value="needs_support">يحتاج دعم</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">الملاحظات</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="label">ملاحظات تربوية (مشتركة مع ولي الأمر)</label>
                      <textarea
                        className="input-field"
                        rows={4}
                        value={formData.educational_notes || ''}
                        onChange={(e) => setFormData({ ...formData, educational_notes: e.target.value })}
                        placeholder="ملاحظات داعمة وتربوية..."
                      />
                    </div>
                    <div>
                      <label className="label">ملاحظات خاصة (للمدرس فقط)</label>
                      <textarea
                        className="input-field"
                        rows={4}
                        value={formData.private_notes || ''}
                        onChange={(e) => setFormData({ ...formData, private_notes: e.target.value })}
                        placeholder="ملاحظات خاصة للمدرس..."
                      />
                    </div>
                    <div>
                      <label className="label">ملاحظات مشتركة</label>
                      <textarea
                        className="input-field"
                        rows={4}
                        value={formData.shared_notes || ''}
                        onChange={(e) => setFormData({ ...formData, shared_notes: e.target.value })}
                        placeholder="ملاحظات مشتركة..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {updateMutation.isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  if (evaluation) {
                    setFormData({
                      commitment_level: evaluation.commitment_level || 'good',
                      interaction_level: evaluation.interaction_level || 'good',
                      behavior_level: evaluation.behavior_level || 'good',
                      participation_level: evaluation.participation_level || 'good',
                      performance_trend: evaluation.performance_trend,
                      interaction_trend: evaluation.interaction_trend,
                      commitment_trend: evaluation.commitment_trend,
                      educational_notes: evaluation.educational_notes || '',
                      private_notes: evaluation.private_notes || '',
                      shared_notes: evaluation.shared_notes || '',
                    })
                  }
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold flex items-center gap-2"
              >
                <X size={20} />
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <>
            {isDaily ? (
              /* Daily Evaluation View */
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">التقييم اليومي</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">الالتزام</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.commitment_level)}`}>
                      {getStatusText(evaluation.commitment_level)}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">التفاعل</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.interaction_level)}`}>
                      {getStatusText(evaluation.interaction_level)}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">السلوك</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.behavior_level)}`}>
                      {getStatusText(evaluation.behavior_level)}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">المشاركة</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.participation_level)}`}>
                      {getStatusText(evaluation.participation_level)}
                    </span>
                  </div>
                </div>
                {evaluation.educational_notes && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-bold text-gray-900 mb-2">ملاحظات تربوية</p>
                    <p className="text-sm text-gray-700">{evaluation.educational_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Monthly Evaluation View */
              <>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">التقييم الشهري</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">تطور الأداء</p>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.performance_trend)}`}>
                        {getStatusText(evaluation.performance_trend)}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">تطور التفاعل</p>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.interaction_trend)}`}>
                        {getStatusText(evaluation.interaction_trend)}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">تطور الالتزام</p>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(evaluation.commitment_trend)}`}>
                        {getStatusText(evaluation.commitment_trend)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">الملاحظات</h2>
                  <div className="space-y-4">
                    {evaluation.educational_notes && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-bold text-gray-900 mb-2">ملاحظات تربوية (مشتركة مع ولي الأمر)</p>
                        <p className="text-sm text-gray-700">{evaluation.educational_notes}</p>
                      </div>
                    )}
                    {evaluation.private_notes && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <p className="text-sm font-bold text-gray-900 mb-2">ملاحظات خاصة (للمدرس فقط)</p>
                        <p className="text-sm text-gray-700">{evaluation.private_notes}</p>
                      </div>
                    )}
                    {evaluation.shared_notes && (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-sm font-bold text-gray-900 mb-2">ملاحظات مشتركة</p>
                        <p className="text-sm text-gray-700">{evaluation.shared_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/teacher/students/${evaluation.student_id}`)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <User className="inline ml-2" size={20} />
              عرض الملف الشخصي للطالب
            </button>
            <button
              onClick={() => navigate(`/teacher/messages?student_id=${evaluation.student_id}`)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar className="inline ml-2" size={20} />
              إرسال رسالة
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

