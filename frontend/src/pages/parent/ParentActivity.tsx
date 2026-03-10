import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, Calendar, Activity as ActivityIcon } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function ParentActivity() {
  const navigate = useNavigate()

  const activities = [
    {
      id: 1,
      type: 'attendance',
      title: 'وصل إلى المدرسة',
      time: '7:35 AM',
      date: 'اليوم',
      location: 'Bus Stop',
      status: 'normal'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'صعد الحافلة',
      time: '7:20 AM',
      date: 'اليوم',
      location: 'Home',
      status: 'normal'
    },
    {
      id: 3,
      type: 'pickup',
      title: 'طلب استلام',
      time: '3:00 PM',
      date: 'أمس',
      location: 'School Gate',
      status: 'pending'
    },
    {
      id: 4,
      type: 'dismissal',
      title: 'إذن مغادرة',
      time: '2:30 PM',
      date: 'أمس',
      location: 'Classroom',
      status: 'approved'
    },
    {
      id: 5,
      type: 'grade',
      title: 'نتيجة امتحان',
      time: '10:00 AM',
      date: 'منذ 3 أيام',
      location: 'Math Exam',
      status: 'completed'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Clock className="text-green-600" size={20} />
      case 'pickup':
        return <MapPin className="text-blue-600" size={20} />
      case 'dismissal':
        return <Calendar className="text-yellow-600" size={20} />
      case 'grade':
        return <ActivityIcon className="text-purple-600" size={20} />
      default:
        return <ActivityIcon className="text-gray-600" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'approved':
        return 'bg-blue-100 text-blue-700'
      case 'completed':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'طبيعي'
      case 'pending':
        return 'قيد الانتظار'
      case 'approved':
        return 'موافق عليه'
      case 'completed':
        return 'مكتمل'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
      {/* Header - Premium */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/parent')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">النشاط</h1>
          </div>
        </div>
      </div>

      {/* Filter Tabs - Premium */}
      <div className="bg-white/90 backdrop-blur-sm px-4 py-4 border-b-2 border-gray-200 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full text-sm font-bold whitespace-nowrap shadow-lg">
            الكل
          </button>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            الحضور
          </button>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            الاستلام
          </button>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            الدرجات
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-4 space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-md">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-base">{activity.title}</h3>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${getStatusColor(activity.status)}`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-700 mt-3 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>{activity.date}</span>
                  </div>
                  {activity.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}

