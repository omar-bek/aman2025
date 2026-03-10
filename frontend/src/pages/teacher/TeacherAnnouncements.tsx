import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Bell, Send, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { studentsAPI } from '../../api'

export default function TeacherAnnouncements() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_class: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
    send_notification: true,
  })
  const queryClient = useQueryClient()

  const { data: announcements } = useQuery(
    'teacher-announcements',
    async () => {
      try {
        const response = await apiClient.get('/teacher/announcements/')
        return response.data || []
      } catch (error) {
        console.error('Error fetching announcements:', error)
        return []
      }
    }
  )

  const { data: classes } = useQuery('teacher-classes', async () => {
    try {
      const response = await apiClient.get('/teacher/dashboard/classes')
      return response.data || []
    } catch (error) {
      return []
    }
  })

  const createMutation = useMutation(
    async (data: any) => {
      console.log('Creating announcement with data:', data) // Debug log
      try {
        const response = await apiClient.post('/teacher/announcements/', data, {
          timeout: 10000 // 10 seconds timeout
        })
        console.log('Announcement created successfully:', response.data) // Debug log
        return response.data
      } catch (error: any) {
        console.error('API Error:', error)
        if (error.code === 'ECONNABORTED') {
          throw new Error('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.')
        }
        throw error
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-announcements')
        toast.success('تم إرسال الإعلان بنجاح')
        setShowCreateModal(false)
        setFormData({
          title: '',
          message: '',
          target_class: '',
          priority: 'normal',
          send_notification: true,
        })
      },
      onError: (error: any) => {
        console.error('Error creating announcement:', error) // Debug log
        console.error('Error response:', error.response) // Debug log
        console.error('Error details:', error.response?.data) // Debug log
        const errorMessage = error.response?.data?.detail || error.message || 'فشل إرسال الإعلان'
        toast.error(errorMessage)
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'normal':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عاجل'
      case 'normal':
        return 'عادي'
      case 'low':
        return 'منخفض'
      default:
        return priority
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
              <Bell className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إعلانات الصف</h1>
                <p className="text-white/90">إرسال إعلانات للطلاب وأولياء الأمور</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              إعلان جديد
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Announcements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements?.map((announcement: any) => (
            <div
              key={announcement.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{announcement.target_class || 'جميع الصفوف'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {new Date(announcement.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(announcement.priority)}`}>
                  {getPriorityText(announcement.priority)}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{announcement.message}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {announcement.views_count || 0} مشاهدة
                </span>
                {announcement.send_notification && (
                  <span className="text-xs text-green-600 font-bold">✓ تم الإشعار</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {(!announcements || announcements.length === 0) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد إعلانات</p>
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">إعلان جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">العنوان</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="عنوان الإعلان"
                />
              </div>

              <div>
                <label className="label">الرسالة</label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="محتوى الإعلان..."
                />
              </div>

              <div>
                <label className="label">الصف المستهدف</label>
                <select
                  className="input-field"
                  value={formData.target_class}
                  onChange={(e) => setFormData({ ...formData, target_class: e.target.value })}
                >
                  <option value="">جميع الصفوف</option>
                  {classes?.map((cls: any) => (
                    <option key={cls.id} value={cls.class_name}>
                      {cls.class_name} - {cls.grade}
                    </option>
                  ))}
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
                  <option value="high">عاجل</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="send_notification"
                  checked={formData.send_notification}
                  onChange={(e) => setFormData({ ...formData, send_notification: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="send_notification" className="text-sm text-gray-700">
                  إرسال إشعار للطلاب وأولياء الأمور
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'جاري الإرسال...' : 'إرسال الإعلان'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

