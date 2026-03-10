import { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Send, AlertCircle, Globe, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

export default function SuperAdminBroadcast() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all' as 'all' | 'schools' | 'parents' | 'teachers',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    schools: [] as number[],
  })

  const broadcastMutation = useMutation(
    async (data: any) => {
      const response = await apiClient.post('/super-admin/broadcast/', data)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('تم إرسال البث بنجاح')
        setFormData({
          title: '',
          message: '',
          target: 'all',
          priority: 'normal',
          schools: [],
        })
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل إرسال البث')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    broadcastMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/super-admin')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <AlertCircle className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">بث عاجل</h1>
                <p className="text-white/90">إرسال إشعارات عاجلة على مستوى الدولة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">العنوان</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="عنوان البث العاجل"
                />
              </div>

              <div>
                <label className="label">الرسالة</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="محتوى البث العاجل..."
                />
              </div>

              <div>
                <label className="label">المستهدف</label>
                <select
                  className="input-field"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                >
                  <option value="all">الجميع</option>
                  <option value="schools">المدارس فقط</option>
                  <option value="parents">أولياء الأمور</option>
                  <option value="teachers">المدرسين</option>
                </select>
              </div>

              <div>
                <label className="label">الأولوية</label>
                <select
                  className="input-field"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="low">منخفض</option>
                  <option value="normal">عادي</option>
                  <option value="high">عالي</option>
                  <option value="urgent">عاجل</option>
                </select>
              </div>

              {formData.priority === 'urgent' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="font-bold text-red-900">تنبيه: بث عاجل</p>
                  </div>
                  <p className="text-sm text-red-700">
                    سيتم إرسال هذا البث لجميع المستخدمين فوراً مع إشعارات Push و SMS
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={broadcastMutation.isLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {broadcastMutation.isLoading ? 'جاري الإرسال...' : 'إرسال البث'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/super-admin')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

