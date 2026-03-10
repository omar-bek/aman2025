import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowRight, Bell, Check, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import apiClient from '../../api/client'
import ParentBottomNav from '../../components/ParentBottomNav'

interface Notification {
  id: number
  title: string
  message: string
  type: 'attendance' | 'pickup' | 'dismissal' | 'grade' | 'behavior' | 'activity' | 'general'
  status: 'pending' | 'sent' | 'delivered' | 'read'
  created_at: string
  data?: any
}

export default function ParentNotifications() {
  const navigate = useNavigate()

  const { data: notifications, isLoading } = useQuery('notifications', async () => {
    const response = await apiClient.get('/notifications/')
    return response.data
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <CheckCircle className="text-green-600" size={20} />
      case 'pickup':
        return <Info className="text-blue-600" size={20} />
      case 'dismissal':
        return <AlertTriangle className="text-yellow-600" size={20} />
      case 'grade':
        return <CheckCircle className="text-purple-600" size={20} />
      case 'behavior':
        return <AlertTriangle className="text-red-600" size={20} />
      default:
        return <Bell className="text-primary-600" size={20} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'bg-green-100'
      case 'pickup':
        return 'bg-blue-100'
      case 'dismissal':
        return 'bg-yellow-100'
      case 'grade':
        return 'bg-purple-100'
      case 'behavior':
        return 'bg-red-100'
      default:
        return 'bg-primary-100'
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await apiClient.post(`/notifications/${id}/read`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const notificationsList = Array.isArray(notifications) ? notifications : []

  const unreadCount = notificationsList.filter((n: Notification) => n.status !== 'read').length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
      {/* Header - Premium */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/parent')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <h1 className="text-2xl font-bold text-white">الإشعارات</h1>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : notificationsList.length > 0 ? (
          <div className="space-y-3">
          {notificationsList.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  notification.status !== 'read' 
                    ? 'border-primary-400 bg-gradient-to-r from-primary-50 to-primary-100' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shadow-md ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-base">{notification.title}</h3>
                      {notification.status !== 'read' && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-primary-100 rounded-xl transition-colors"
                        >
                          <Check className="text-primary-600" size={18} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3 font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد إشعارات</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}

