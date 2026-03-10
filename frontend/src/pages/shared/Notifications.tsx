import { useQuery } from 'react-query'
import { Bell, Check } from 'lucide-react'
import apiClient from '../../api/client'

export default function Notifications() {
  const { data: notifications, isLoading } = useQuery('notifications', async () => {
    const response = await apiClient.get('/notifications/')
    return response.data
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
        <p className="text-gray-600 mt-1">جميع الإشعارات والتنبيهات</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">جاري التحميل...</p>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-3">
            {notifications?.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Bell className="text-primary-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  {notification.status !== 'read' && (
                    <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <Check size={20} className="text-gray-600" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <p>لا توجد إشعارات حالياً</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

