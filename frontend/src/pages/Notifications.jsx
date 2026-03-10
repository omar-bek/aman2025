import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Bell, Check } from 'lucide-react'

const Notifications = () => {
  const queryClient = useQueryClient()
  
  const { data, isLoading } = useQuery('notifications', () => api.get('/notifications'))
  
  const markAsReadMutation = useMutation((id) => api.put(`/notifications/${id}/read`), {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
      toast.success('تم تحديد الإشعار كمقروء')
    }
  })

  const markAllAsReadMutation = useMutation(() => api.put('/notifications/read-all'), {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
      toast.success('تم تحديد جميع الإشعارات كمقروءة')
    }
  })

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-600 mt-2">
            لديك {data?.data?.unreadCount || 0} إشعار غير مقروء
          </p>
        </div>
        {data?.data?.unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            className="btn btn-secondary"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-4">
        {data?.data?.data?.map((notification) => (
          <div
            key={notification._id}
            className={`card ${!notification.isRead ? 'border-r-4 border-primary-600 bg-primary-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={20} className="text-primary-600" />
                  <h3 className="font-bold text-lg">{notification.title}</h3>
                  {!notification.isRead && (
                    <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">جديد</span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString('ar-SA')}
                </p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => markAsReadMutation.mutate(notification._id)}
                  className="btn btn-secondary text-sm"
                >
                  <Check size={16} className="ml-1" />
                  مقروء
                </button>
              )}
            </div>
          </div>
        ))}
        
        {data?.data?.data?.length === 0 && (
          <div className="card text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
