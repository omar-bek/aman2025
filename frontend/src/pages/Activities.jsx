import { useQuery } from 'react-query'
import api from '../services/api'
import { Activity, Calendar, MapPin } from 'lucide-react'

const Activities = () => {
  const { data, isLoading } = useQuery('activities', () => api.get('/activities'))

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الأنشطة المدرسية</h1>
        <p className="text-gray-600 mt-2">الفعاليات والأنشطة المدرسية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.data?.map((activity) => (
          <div key={activity._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
              <Activity className="text-primary-600" size={24} />
            </div>
            
            <p className="text-gray-600 mb-4">{activity.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>{new Date(activity.date).toLocaleDateString('ar-SA')}</span>
              </div>
              {activity.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{activity.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  activity.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status === 'upcoming' && 'قادمة'}
                  {activity.status === 'ongoing' && 'جارية'}
                  {activity.status === 'completed' && 'مكتملة'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities
