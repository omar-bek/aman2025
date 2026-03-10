import { useQuery } from 'react-query'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Users, Bus, Calendar, Bell, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user, isParent, isTeacher, isAdmin } = useAuth()

  const { data: stats } = useQuery('dashboard-stats', async () => {
    const [students, buses, attendance, notifications] = await Promise.all([
      api.get('/students').catch(() => ({ data: { count: 0 } })),
      api.get('/buses').catch(() => ({ data: { count: 0 } })),
      api.get('/attendance/stats').catch(() => ({ data: { data: { total: 0 } } })),
      api.get('/notifications?isRead=false').catch(() => ({ data: { unreadCount: 0 } }))
    ])
    return {
      students: students.data.count || 0,
      buses: buses.data.count || 0,
      attendance: attendance.data.data?.total || 0,
      notifications: notifications.data.unreadCount || 0
    }
  })

  const statCards = [
    {
      title: 'الطلاب',
      value: stats?.students || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/students'
    },
    {
      title: 'الحافلات',
      value: stats?.buses || 0,
      icon: Bus,
      color: 'bg-green-500',
      link: '/buses'
    },
    {
      title: 'سجلات الحضور',
      value: stats?.attendance || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/attendance'
    },
    {
      title: 'الإشعارات غير المقروءة',
      value: stats?.notifications || 0,
      icon: Bell,
      color: 'bg-red-500',
      link: '/notifications'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">مرحباً، {user?.name}</h1>
        <p className="text-gray-600 mt-2">لوحة التحكم الرئيسية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <a
              key={index}
              href={stat.link}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">آخر الأنشطة</h2>
          <p className="text-gray-600">قريباً...</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">الإشعارات الأخيرة</h2>
          <p className="text-gray-600">قريباً...</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
