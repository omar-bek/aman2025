import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import { studentsAPI, attendanceAPI, busesAPI } from '../../api'
import { Users, Bus, Calendar, TrendingUp, Bell, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: students } = useQuery('students', studentsAPI.getAll, {
    enabled: user?.role === 'admin' || user?.role === 'teacher',
  })

  const { data: buses } = useQuery('buses', busesAPI.getAll)

  const stats = [
    {
      title: 'الطلاب',
      value: students?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'الحافلات',
      value: buses?.length || 0,
      icon: Bus,
      color: 'bg-green-500',
    },
    {
      title: 'الحضور اليوم',
      value: '95%',
      icon: Calendar,
      color: 'bg-yellow-500',
    },
    {
      title: 'الإشعارات',
      value: '12',
      icon: Bell,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-1">مرحباً بك، {user?.full_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الطلاب</h2>
          <div className="space-y-3">
            {students?.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{student.full_name}</p>
                  <p className="text-sm text-gray-500">{student.grade} - {student.class_name}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  نشط
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الحافلات النشطة</h2>
          <div className="space-y-3">
            {buses?.slice(0, 5).map((bus) => (
              <div
                key={bus.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">حافلة {bus.bus_number}</p>
                  <p className="text-sm text-gray-500">{bus.driver_name}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  نشطة
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
            <Calendar className="mx-auto mb-2 text-primary-600" size={24} />
            <p className="text-sm font-medium text-gray-900">تسجيل حضور</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <Users className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-sm font-medium text-gray-900">إضافة طالب</p>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
            <Bell className="mx-auto mb-2 text-yellow-600" size={24} />
            <p className="text-sm font-medium text-gray-900">إرسال إشعار</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <TrendingUp className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-sm font-medium text-gray-900">تقارير</p>
          </button>
        </div>
      </div>
    </div>
  )
}

