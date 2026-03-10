import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bell, Send, FileText, Clock, Users, Settings, TrendingUp, Plus, LayoutTemplate, Mail } from 'lucide-react'
import apiClient from '../../api/client'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

interface NotificationCreate {
  title: string
  message: string
  target_role?: string
  target_user_id?: number
  target_class?: string
  priority: string
  send_immediately: boolean
}

interface NotificationHistory {
  id: number
  title: string
  message: string
  target_role?: string
  priority: string
  created_at: string
  sent_at?: string
  created_by: number
  read_count: number
}

interface NotificationTemplate {
  id: number
  name: string
  title_template: string
  message_template: string
  target_role: string
  created_at: string
}

interface QuietHoursConfig {
  enabled: boolean
  start_time: string
  end_time: string
  days_of_week: number[]
}

export default function StaffNotifications() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'broadcast' | 'history' | 'templates' | 'settings'>('broadcast')
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<NotificationCreate>({
    title: '',
    message: '',
    target_role: 'all',
    priority: 'normal',
    send_immediately: true
  })

  // Fetch notification history
  const { data: history } = useQuery(
    ['notification-history'],
    async () => {
      const response = await apiClient.get<NotificationHistory[]>('/staff/notifications/history')
      return response.data
    },
    { retry: false, enabled: activeTab === 'history' }
  )

  // Fetch templates
  const { data: templates } = useQuery(
    ['notification-templates'],
    async () => {
      const response = await apiClient.get<NotificationTemplate[]>('/staff/notifications/templates')
      return response.data
    },
    { retry: false, enabled: activeTab === 'templates' }
  )

  // Fetch quiet hours config
  const { data: quietHours } = useQuery(
    ['quiet-hours'],
    async () => {
      const response = await apiClient.get<QuietHoursConfig>('/staff/notifications/quiet-hours')
      return response.data
    },
    { retry: false, enabled: activeTab === 'settings' }
  )

  // Fetch stats
  const { data: stats } = useQuery(
    ['notification-stats'],
    async () => {
      const response = await apiClient.get('/staff/notifications/stats?days=7')
      return response.data
    },
    { retry: false }
  )

  // Create notification mutation
  const createNotification = useMutation(
    async (data: NotificationCreate) => {
      const response = await apiClient.post('/staff/notifications/broadcast', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notification-history')
        toast.success('تم إرسال الإشعار بنجاح')
        setShowCreateForm(false)
        setFormData({
          title: '',
          message: '',
          target_role: 'all',
          priority: 'normal',
          send_immediately: true
        })
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل إرسال الإشعار')
      }
    }
  )

  // Update quiet hours mutation
  const updateQuietHours = useMutation(
    async (data: QuietHoursConfig) => {
      const response = await apiClient.post('/staff/notifications/quiet-hours', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('quiet-hours')
        toast.success('تم تحديث إعدادات الساعات الهادئة')
      },
      onError: () => {
        toast.error('فشل تحديث الإعدادات')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createNotification.mutate(formData)
  }

  const useTemplate = (template: NotificationTemplate) => {
    setFormData({
      ...formData,
      title: template.title_template,
      message: template.message_template,
      target_role: template.target_role
    })
    setActiveTab('broadcast')
    setShowCreateForm(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'normal': return 'bg-blue-100 text-blue-700'
      case 'low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل'
      case 'high': return 'مهم'
      case 'normal': return 'عادي'
      case 'low': return 'منخفض'
      default: return priority
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'parent': return 'الآباء'
      case 'teacher': return 'المدرسين'
      case 'driver': return 'السائقين'
      case 'student': return 'الطلاب'
      case 'all': return 'الجميع'
      default: return role || 'غير محدد'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/staff')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
              <Bell className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الإشعارات</h1>
                <p className="text-white/90">إرسال وإدارة الإشعارات والإعلانات</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الإشعارات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_sent || 0}</p>
                </div>
                <Mail className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">للآباء</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.by_role?.parent || 0}</p>
                </div>
                <Users className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">للمدرسين</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.by_role?.teacher || 0}</p>
                </div>
                <Users className="text-purple-600" size={32} />
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">للسائقين</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.by_role?.driver || 0}</p>
                </div>
                <Users className="text-orange-600" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border-2 border-gray-200 shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'broadcast'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Send size={18} className="inline-block ml-2" />
              إرسال إشعار
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock size={18} className="inline-block ml-2" />
              السجل
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'templates'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutTemplate size={18} className="inline-block ml-2" />
              القوالب
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={18} className="inline-block ml-2" />
              الإعدادات
            </button>
          </div>
        </div>

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">إرسال إشعار جديد</h2>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  إشعار جديد
                </button>
              )}
            </div>

            {showCreateForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الرسالة</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">المستهدف</label>
                    <select
                      value={formData.target_role}
                      onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">الجميع</option>
                      <option value="parent">الآباء</option>
                      <option value="teacher">المدرسين</option>
                      <option value="driver">السائقين</option>
                      <option value="student">الطلاب</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الأولوية</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">منخفض</option>
                      <option value="normal">عادي</option>
                      <option value="high">مهم</option>
                      <option value="urgent">عاجل</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.send_immediately}
                    onChange={(e) => setFormData({ ...formData, send_immediately: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label className="text-sm text-gray-700">إرسال فوري</label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={createNotification.isLoading}
                    className="btn-primary flex-1"
                  >
                    {createNotification.isLoading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setFormData({
                        title: '',
                        message: '',
                        target_role: 'all',
                        priority: 'normal',
                        send_immediately: true
                      })
                    }}
                    className="btn-secondary"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">سجل الإشعارات</h2>
            
            {history && history.length > 0 ? (
              <div className="space-y-4">
                {history.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{notif.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{format(parseISO(notif.created_at), 'yyyy-MM-dd HH:mm')}</span>
                          <span>•</span>
                          <span>{getRoleLabel(notif.target_role)}</span>
                          {notif.read_count > 0 && (
                            <>
                              <span>•</span>
                              <span>{notif.read_count} قارئ</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(notif.priority)}`}>
                        {getPriorityLabel(notif.priority)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">لا توجد إشعارات في السجل</p>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">قوالب الإشعارات</h2>
            
            {templates && templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all cursor-pointer"
                    onClick={() => useTemplate(template)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <LayoutTemplate className="text-primary-600" size={24} />
                      <h3 className="font-bold text-gray-900">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{template.title_template}</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      {getRoleLabel(template.target_role)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <LayoutTemplate className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">لا توجد قوالب</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && quietHours && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات الساعات الهادئة</h2>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateQuietHours.mutate(quietHours)
              }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={quietHours.enabled}
                  onChange={(e) => {
                    const updated = { ...quietHours, enabled: e.target.checked }
                    queryClient.setQueryData('quiet-hours', updated)
                  }}
                  className="w-5 h-5"
                />
                <label className="text-sm font-bold text-gray-700">تفعيل الساعات الهادئة</label>
              </div>

              {quietHours.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">وقت البداية</label>
                      <input
                        type="time"
                        value={quietHours.start_time}
                        onChange={(e) => {
                          const updated = { ...quietHours, start_time: e.target.value }
                          queryClient.setQueryData('quiet-hours', updated)
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">وقت النهاية</label>
                      <input
                        type="time"
                        value={quietHours.end_time}
                        onChange={(e) => {
                          const updated = { ...quietHours, end_time: e.target.value }
                          queryClient.setQueryData('quiet-hours', updated)
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={updateQuietHours.isLoading}
                className="btn-primary"
              >
                {updateQuietHours.isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

