import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import apiClient from '../api/client'
import toast from 'react-hot-toast'

interface Notification {
  id: number
  title: string
  message: string
  type: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  is_read: boolean
  created_at: string
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: notifications } = useQuery(
    'notifications',
    async () => {
      try {
        const response = await apiClient.get('/notifications/')
        return response.data || []
      } catch (error) {
        return []
      }
    },
    {
      refetchInterval: 30000, // Poll every 30 seconds
    }
  )

  const markReadMutation = useMutation(
    async (id: number) => {
      await apiClient.post(`/notifications/${id}/read`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
      }
    }
  )

  const markAllReadMutation = useMutation(
    async () => {
      await apiClient.post('/notifications/read-all')
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
        toast.success('تم تحديد جميع الإشعارات كمقروءة')
      }
    }
  )

  const notificationsList = Array.isArray(notifications) ? notifications : []
  const unreadCount = notificationsList.filter((n: Notification) => !n.is_read).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-300'
      case 'high':
        return 'bg-orange-100 border-orange-300'
      case 'normal':
        return 'bg-blue-100 border-blue-300'
      case 'low':
        return 'bg-gray-100 border-gray-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
      >
        <Bell className="text-white" size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">الإشعارات</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllReadMutation.mutate()}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    تحديد الكل كمقروء
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {notificationsList && notificationsList.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notificationsList.map((notification: Notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''
                        }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markReadMutation.mutate(notification.id)
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-1 border-r-4 pr-3 ${getPriorityColor(notification.priority)}`}>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900">{notification.title}</h4>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.created_at).toLocaleString('ar-SA')}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markReadMutation.mutate(notification.id)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="تحديد كمقروء"
                          >
                            <Check size={18} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="mx-auto mb-4 text-gray-400" size={48} />
                  <p>لا توجد إشعارات</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

