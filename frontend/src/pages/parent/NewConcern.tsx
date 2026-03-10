import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Heart, AlertTriangle, FileText, MessageSquare } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'
import { studentsAPI, concernsAPI } from '../../api'

export default function NewConcern() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'health',
    childId: '',
    priority: 'medium',
    title: '',
    description: '',
  })

  const queryClient = useQueryClient()

  const { data: children = [] } = useQuery(['parent-students-for-concerns'], () =>
    studentsAPI.getByParent('me'),
  )

  const concernTypes = [
    { value: 'health', label: 'مخاوف صحية', icon: <Heart size={20} /> },
    { value: 'safety', label: 'مخاوف أمنية', icon: <Shield size={20} /> },
    { value: 'academic', label: 'مخاوف أكاديمية', icon: <FileText size={20} /> },
    { value: 'behavior', label: 'مخاوف سلوكية', icon: <AlertTriangle size={20} /> },
    { value: 'other', label: 'أخرى', icon: <MessageSquare size={20} /> },
  ]

  const priorities = [
    { value: 'low', label: 'منخفض', color: 'text-gray-600' },
    { value: 'medium', label: 'متوسط', color: 'text-status-info' },
    { value: 'high', label: 'عالي', color: 'text-status-action' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await concernsAPI.create({
        studentId: formData.childId,
        type: formData.type,
        priority: formData.priority as 'low' | 'medium' | 'high',
        title: formData.title,
        description: formData.description,
      })

      await queryClient.invalidateQueries(['parent-concerns'])

      toast.success('تم إرسال القلق بنجاح')
      navigate('/parent/concerns')
    } catch (error: any) {
      toast.error(error.message || 'فشل إرسال القلق')
    } finally {
      setLoading(false)
    }
  }

  const handleAISuggest = async () => {
    if (!formData.childId) {
      toast.error('يرجى اختيار الطفل أولاً قبل استخدام الذكاء الاصطناعي')
      return
    }

    setAiLoading(true)
    try {
      const { suggestion } = await concernsAPI.suggestWithAI(formData.childId)
      setFormData((prev) => ({
        ...prev,
        description: suggestion,
      }))
      toast.success('تم توليد وصف مقترح بنجاح، يمكنك تعديله قبل الإرسال')
    } catch (error: any) {
      toast.error(error.message || 'فشل توليد الوصف بالذكاء الاصطناعي')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent/concerns')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">الإبلاغ عن قلق</h1>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4">
        <div className="bg-teal-50 border-2 border-teal-200 rounded-card-lg p-4">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                نحن هنا للمساعدة
              </p>
              <p className="text-xs text-gray-600">
                مخاوفك تؤخذ على محمل الجد. سنقوم بمراجعة ومعالجة كل قلق بسرعة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Concern Type */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">نوع القلق</label>
            <div className="grid grid-cols-2 gap-2">
              {concernTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-card border-2 transition-all ${
                    formData.type === type.value
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={formData.type === type.value ? 'text-teal-600' : 'text-gray-400'}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Child Selection */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">الطفل</label>
            <select
              className="input-field"
              value={formData.childId}
              onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
              required
            >
              <option value="">اختر الطفل</option>
              {children.map((child) => (
                <option key={child.id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">الأولوية</label>
            <div className="flex items-center gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={`flex-1 px-4 py-2 rounded-card border-2 transition-all ${
                    formData.priority === priority.value
                      ? 'border-teal-500 bg-teal-50 font-bold'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${priority.color}`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">العنوان</label>
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: تغير في السلوك"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">الوصف التفصيلي</label>
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiLoading}
                className="text-xs px-3 py-1 rounded-full border border-teal-500 text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? 'جاري التوليد...' : 'اقتراح تلقائي بالذكاء الاصطناعي'}
              </button>
            </div>
            <textarea
              className="input-field min-h-[150px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="يرجى وصف القلق بالتفصيل..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال القلق'}
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}


