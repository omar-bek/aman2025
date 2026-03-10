import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { studentsAPI } from '../../api'
import { evaluationsAPI } from '../../api/teacher'
import { ArrowRight, Award, User, Calendar, Save, X, Info, Heart, TrendingUp, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

export default function TeacherEvaluationNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedStudentId = searchParams.get('student_id')
  const queryClient = useQueryClient()

  const [evaluationType, setEvaluationType] = useState<'daily' | 'monthly'>('daily')
  const [formData, setFormData] = useState({
    student_id: preSelectedStudentId ? Number(preSelectedStudentId) : 0,
    evaluation_type: 'daily' as 'daily' | 'monthly',
    evaluation_date: new Date().toISOString().split('T')[0],
    // Daily evaluation fields
    commitment_level: 'good' as 'excellent' | 'good' | 'needs_support',
    interaction_level: 'good' as 'excellent' | 'good' | 'needs_support',
    behavior_level: 'good' as 'excellent' | 'good' | 'needs_support',
    participation_level: 'good' as 'excellent' | 'good' | 'needs_support',
    // Monthly evaluation fields
    performance_trend: '' as '' | 'excellent' | 'good' | 'needs_support',
    interaction_trend: '' as '' | 'excellent' | 'good' | 'needs_support',
    commitment_trend: '' as '' | 'excellent' | 'good' | 'needs_support',
    // Notes
    educational_notes: '',
    private_notes: '',
    shared_notes: '',
  })

  const { data: students } = useQuery('students', studentsAPI.getAll)

  const selectedStudent = students?.find((s: any) => s.id === formData.student_id)

  const createMutation = useMutation(
    async (data: any) => {
      // Parse evaluation_date to datetime
      const evaluationDate = new Date(data.evaluation_date)
      evaluationDate.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues

      const backendData: any = {
        student_id: data.student_id,
        evaluation_type: data.evaluation_type,
        evaluation_date: evaluationDate.toISOString(),
      }

      if (data.evaluation_type === 'daily') {
        backendData.commitment_level = data.commitment_level
        backendData.interaction_level = data.interaction_level
        backendData.behavior_level = data.behavior_level
        backendData.participation_level = data.participation_level
        backendData.educational_notes = data.educational_notes || null
      } else {
        // Monthly evaluation
        if (data.performance_trend) backendData.performance_trend = data.performance_trend
        if (data.interaction_trend) backendData.interaction_trend = data.interaction_trend
        if (data.commitment_trend) backendData.commitment_trend = data.commitment_trend
        backendData.educational_notes = data.educational_notes || null
        backendData.private_notes = data.private_notes || null
        backendData.shared_notes = data.shared_notes || null
      }

      const response = await apiClient.post('/teacher/evaluations/', backendData)
      return response.data
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('evaluations')
        queryClient.invalidateQueries(['evaluations', evaluationType])
        toast.success('تم تسجيل التقييم بنجاح')
        navigate(`/teacher/evaluations/${data.id}`)
      },
      onError: (error: any) => {
        console.error('Error creating evaluation:', error)
        const errorMessage = error.response?.data?.detail || error.message || 'فشل تسجيل التقييم'
        toast.error(errorMessage)
      }
    }
  )

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      evaluation_type: evaluationType,
      student_id: preSelectedStudentId ? Number(preSelectedStudentId) : prev.student_id
    }))
  }, [evaluationType, preSelectedStudentId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.student_id) {
      toast.error('يرجى اختيار الطالب')
      return
    }

    if (evaluationType === 'monthly') {
      if (!formData.performance_trend || !formData.interaction_trend || !formData.commitment_trend) {
        toast.error('يرجى ملء جميع حقول التقييم الشهري')
        return
      }
    }

    createMutation.mutate(formData)
  }

  const getStatusColor = (status: string) => {
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
                <h1 className="text-3xl font-bold text-white mb-1">تقييم جديد</h1>
                <p className="text-white/90">تقييم تربوي إنساني وداعم</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Evaluation Type Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEvaluationType('daily')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                evaluationType === 'daily'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="inline ml-2" size={20} />
              التقييم اليومي
            </button>
            <button
              onClick={() => setEvaluationType('monthly')}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                evaluationType === 'monthly'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="inline ml-2" size={20} />
              التقييم الشهري
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="text-primary-600" size={24} />
              معلومات الطالب
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">اختر الطالب *</label>
                <select
                  className="input-field"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: Number(e.target.value) })}
                  required
                >
                  <option value="0">-- اختر الطالب --</option>
                  {students?.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} - {student.class_name || student.grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">تاريخ التقييم *</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.evaluation_date}
                  onChange={(e) => setFormData({ ...formData, evaluation_date: e.target.value })}
                  required
                />
              </div>
            </div>
            {selectedStudent && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedStudent.full_name}</p>
                    <p className="text-sm text-gray-600">{selectedStudent.class_name || selectedStudent.grade}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {evaluationType === 'daily' ? (
            /* Daily Evaluation Form */
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="text-primary-600" size={24} />
                التقييم اليومي
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">الالتزام *</label>
                    <select
                      className="input-field"
                      value={formData.commitment_level}
                      onChange={(e) => setFormData({ ...formData, commitment_level: e.target.value as any })}
                      required
                    >
                      <option value="excellent">ممتاز - التزام عالي</option>
                      <option value="good">جيد - التزام مناسب</option>
                      <option value="needs_support">يحتاج دعم - يحتاج متابعة</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">التفاعل *</label>
                    <select
                      className="input-field"
                      value={formData.interaction_level}
                      onChange={(e) => setFormData({ ...formData, interaction_level: e.target.value as any })}
                      required
                    >
                      <option value="excellent">ممتاز - تفاعل نشط</option>
                      <option value="good">جيد - تفاعل جيد</option>
                      <option value="needs_support">يحتاج دعم - يحتاج تشجيع</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">السلوك *</label>
                    <select
                      className="input-field"
                      value={formData.behavior_level}
                      onChange={(e) => setFormData({ ...formData, behavior_level: e.target.value as any })}
                      required
                    >
                      <option value="excellent">ممتاز - سلوك إيجابي</option>
                      <option value="good">جيد - سلوك مناسب</option>
                      <option value="needs_support">يحتاج دعم - يحتاج توجيه</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">المشاركة *</label>
                    <select
                      className="input-field"
                      value={formData.participation_level}
                      onChange={(e) => setFormData({ ...formData, participation_level: e.target.value as any })}
                      required
                    >
                      <option value="excellent">ممتاز - مشاركة فعالة</option>
                      <option value="good">جيد - مشاركة جيدة</option>
                      <option value="needs_support">يحتاج دعم - يحتاج تحفيز</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">ملاحظات تربوية (مشتركة مع ولي الأمر)</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={formData.educational_notes}
                    onChange={(e) => setFormData({ ...formData, educational_notes: e.target.value })}
                    placeholder="اكتب ملاحظات داعمة وتربوية... (مثال: الطالب يظهر تحسن في التفاعل، ننصح بمتابعة الدعم في المنزل)"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Info size={14} />
                    هذه الملاحظات ستكون مرئية لولي الأمر
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Monthly Evaluation Form */
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-primary-600" size={24} />
                  التطورات الشهرية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">تطور الأداء *</label>
                    <select
                      className="input-field"
                      value={formData.performance_trend}
                      onChange={(e) => setFormData({ ...formData, performance_trend: e.target.value as any })}
                      required
                    >
                      <option value="">-- اختر --</option>
                      <option value="excellent">ممتاز - تطور واضح</option>
                      <option value="good">جيد - تطور مستقر</option>
                      <option value="needs_support">يحتاج دعم - يحتاج متابعة</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">تطور التفاعل *</label>
                    <select
                      className="input-field"
                      value={formData.interaction_trend}
                      onChange={(e) => setFormData({ ...formData, interaction_trend: e.target.value as any })}
                      required
                    >
                      <option value="">-- اختر --</option>
                      <option value="excellent">ممتاز - تطور واضح</option>
                      <option value="good">جيد - تطور مستقر</option>
                      <option value="needs_support">يحتاج دعم - يحتاج متابعة</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">تطور الالتزام *</label>
                    <select
                      className="input-field"
                      value={formData.commitment_trend}
                      onChange={(e) => setFormData({ ...formData, commitment_trend: e.target.value as any })}
                      required
                    >
                      <option value="">-- اختر --</option>
                      <option value="excellent">ممتاز - تطور واضح</option>
                      <option value="good">جيد - تطور مستقر</option>
                      <option value="needs_support">يحتاج دعم - يحتاج متابعة</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="text-primary-600" size={24} />
                  الملاحظات
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">ملاحظات تربوية (مشتركة مع ولي الأمر) *</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={formData.educational_notes}
                      onChange={(e) => setFormData({ ...formData, educational_notes: e.target.value })}
                      placeholder="ملاحظات داعمة وتربوية مرئية لولي الأمر..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Info size={14} />
                      هذه الملاحظات ستكون مرئية لولي الأمر
                    </p>
                  </div>
                  <div>
                    <label className="label">ملاحظات خاصة (للمدرس فقط)</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={formData.private_notes}
                      onChange={(e) => setFormData({ ...formData, private_notes: e.target.value })}
                      placeholder="ملاحظات خاصة للمدرس فقط (غير مرئية لولي الأمر)..."
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Info size={14} />
                      هذه الملاحظات خاصة بك فقط
                    </p>
                  </div>
                  <div>
                    <label className="label">ملاحظات مشتركة</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={formData.shared_notes}
                      onChange={(e) => setFormData({ ...formData, shared_notes: e.target.value })}
                      placeholder="ملاحظات إضافية مشتركة..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {createMutation.isLoading ? 'جاري الحفظ...' : 'حفظ التقييم'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teacher/evaluations')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold flex items-center gap-2"
            >
              <X size={20} />
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

