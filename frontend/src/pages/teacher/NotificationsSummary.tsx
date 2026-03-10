import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Clock,
  Eye,
  CheckCheck,
  Filter,
  Loader,
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

interface Notification {
  id: number
  title: string
  message: string
  notification_type: 'assignment' | 'message' | 'announcement' | 'system' | 'evaluation'
  priority: 'high' | 'medium' | 'low'
  status: 'read' | 'unread'
  created_at: string
  metadata?: any
}

export default function NotificationsSummary() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('unread')

  const { data: notifications, isLoading } = useQuery(
    ['teacher-notifications', filterType, filterPriority, filterStatus],
    async () => {
      try {
        const params: any = {}
        if (filterType !== 'all') params.type = filterType
        if (filterPriority !== 'all') params.priority = filterPriority
        if (filterStatus !== 'all') params.status = filterStatus
        const response = await apiClient.get('/teacher/notifications', { params })
        return response.data || []
      } catch (error) {
        // Mock data for development
        return [
          {
            id: 1,
            title: 'رسالة جديدة من ولي أمر',
            message: 'أرسل أحمد محمد رسالة بخصوص تقدم الطالب',
            notification_type: 'message',
            priority: 'high',
            status: 'unread',
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'تسليم واجب متأخر',
            message: '5 طلاب لم يسلموا واجب الرياضيات',
            notification_type: 'assignment',
            priority: 'medium',
            status: 'unread',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 3,
            title: 'تحديث النظام',
            message: 'تم تحديث النظام بنجاح',
            notification_type: 'system',
            priority: 'low',
            status: 'read',
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ] as Notification[]
      }
    }
  )

  const markAsReadMutation = useMutation(
    async (id: number) => {
      await apiClient.patch(`/teacher/notifications/${id}/read`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-notifications')
      },
      onError: () => {
        toast.error('فشل تحديث الإشعار')
      }
    }
  )

  const markAllAsReadMutation = useMutation(
    async () => {
      await apiClient.post('/teacher/notifications/mark-all-read')
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-notifications')
        toast.success('تم تعليم جميع الإشعارات كمقروءة')
      },
      onError: () => {
        toast.error('فشل تحديث الإشعارات')
      }
    }
  )

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'unread') {
      markAsReadMutation.mutate(notification.id)
    }

    // Navigate based on notification type
    switch (notification.notification_type) {
      case 'message':
        navigate('/teacher/messages')
        break
      case 'assignment':
        navigate('/teacher/assignments')
        break
      case 'evaluation':
        navigate('/teacher/evaluations')
        break
      case 'announcement':
        navigate('/teacher/announcements')
        break
      default:
        break
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="text-teal-600" size={20} />
      case 'assignment':
        return <Calendar className="text-emerald-600" size={20} />
      case 'evaluation':
        return <CheckCircle className="text-blue-600" size={20} />
      case 'announcement':
        return <Bell className="text-amber-600" size={20} />
      default:
        return <Info className="text-gray-600" size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-amber-300 bg-amber-50'
      case 'medium':
        return 'border-teal-300 bg-teal-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            عالي
          </span>
        )
      case 'medium':
        return (
          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
            متوسط
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            منخفض
          </span>
        )
    }
  }

  const unreadCount = notifications?.filter((n: Notification) => n.status === 'unread').length || 0
  const highPriorityCount = notifications?.filter((n: Notification) => n.priority === 'high' && n.status === 'unread').length || 0

  const filteredNotifications = notifications || []

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="العودة"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ملخص الإشعارات</h1>
                <p className="text-sm text-gray-600 mt-1">نظرة شاملة • أولويات واضحة • إجراءات سريعة</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isLoading}
                className="px-4 py-2 bg-sand-100 text-gray-700 rounded-card text-sm font-medium hover:bg-sand-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {markAllAsReadMutation.isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
                تعليم الكل كمقروء ({unreadCount})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <Bell className="text-teal-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">{notifications?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
          </div>
          <div className="bg-white rounded-card-lg p-4 border border-amber-300 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-amber-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">{unreadCount}</span>
            </div>
            <p className="text-sm text-gray-600">غير مقروء</p>
          </div>
          <div className="bg-white rounded-card-lg p-4 border border-red-300 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-red-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">{highPriorityCount}</span>
            </div>
            <p className="text-sm text-gray-600">أولوية عالية</p>
          </div>
          <div className="bg-white rounded-card-lg p-4 border border-emerald-300 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="text-emerald-600" size={24} />
              <span className="text-2xl font-bold text-gray-900">
                {notifications?.filter((n: Notification) => n.notification_type === 'message').length || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">رسائل</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-gray-600" size={18} />
            <span className="text-sm font-medium text-gray-700">فلترة:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">جميع الأنواع</option>
              <option value="message">رسائل</option>
              <option value="assignment">واجبات</option>
              <option value="evaluation">تقييمات</option>
              <option value="announcement">إعلانات</option>
              <option value="system">نظام</option>
            </select>
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">جميع الأولويات</option>
              <option value="high">عالي</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">الكل</option>
              <option value="unread">غير مقروء</option>
              <option value="read">مقروء</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">الإشعارات ({filteredNotifications.length})</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="mx-auto animate-spin text-teal-600" size={32} />
              <p className="text-gray-600 mt-4">جاري التحميل...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification: Notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-right p-5 rounded-card-lg border-2 transition-all hover:shadow-elevated ${
                    notification.status === 'unread'
                      ? getPriorityColor(notification.priority) + ' ring-2 ring-offset-2 ring-teal-300'
                      : 'bg-white border-sand-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${notification.status === 'unread' ? '' : 'opacity-50'}`}>
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-bold ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(notification.priority)}
                          {notification.status === 'unread' && (
                            <div className="w-2 h-2 bg-teal-600 rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mb-3 ${notification.status === 'unread' ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          عرض التفاصيل
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

