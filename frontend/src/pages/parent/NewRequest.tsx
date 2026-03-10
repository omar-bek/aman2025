import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, FileText, UserCheck } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'
import toast from 'react-hot-toast'
import { useQueryClient, useQuery } from 'react-query'
import { studentsAPI, requestsAPI } from '../../api'

export default function NewRequest() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'early_pickup',
    childId: '',
    requestedDate: '',
    requestedTime: '',
    reason: '',
    details: '',
  })

  const queryClient = useQueryClient()

  const { data: children = [] } = useQuery(['parent-students-for-request'], () =>
    studentsAPI.getByParent('me'),
  )

  const requestTypes = [
    { value: 'early_pickup', label: 'استلام مبكر', icon: <UserCheck size={20} /> },
    { value: 'absence', label: 'طلب غياب', icon: <Calendar size={20} /> },
    { value: 'permission', label: 'إذن', icon: <FileText size={20} /> },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await requestsAPI.createForParent({
        type:
          formData.type === 'early_pickup'
            ? 'early_pickup'
            : formData.type === 'absence'
              ? 'absence'
              : 'early_leave',
        childId: formData.childId,
        requestedDate: formData.requestedDate,
        requestedTime: formData.requestedTime,
        reason: formData.reason,
        details: formData.details,
      })

      await queryClient.invalidateQueries(['parent-requests'])

      toast.success('تم إرسال الطلب بنجاح')
      navigate('/parent/requests')
    } catch (error: any) {
      toast.error(error.message || 'فشل إرسال الطلب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent/requests')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">طلب جديد</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Request Type */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">نوع الطلب</label>
            <div className="grid grid-cols-3 gap-2">
              {requestTypes.map((type) => (
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

          {/* Requested Date */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">
              <Calendar size={16} className="inline ml-2" />
              التاريخ المطلوب
            </label>
            <input
              type="date"
              className="input-field"
              value={formData.requestedDate}
              onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
              required
            />
          </div>

          {/* Requested Time */}
          {formData.type === 'early_pickup' && (
            <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
              <label className="label">
                <Clock size={16} className="inline ml-2" />
                الوقت المطلوب
              </label>
              <input
                type="time"
                className="input-field"
                value={formData.requestedTime}
                onChange={(e) => setFormData({ ...formData, requestedTime: e.target.value })}
                required
              />
            </div>
          )}

          {/* Reason */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">السبب</label>
            <input
              type="text"
              className="input-field"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="مثال: موعد طبي"
              required
            />
          </div>

          {/* Details */}
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <label className="label">التفاصيل الإضافية</label>
            <textarea
              className="input-field min-h-[100px]"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="أضف أي تفاصيل إضافية..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}


