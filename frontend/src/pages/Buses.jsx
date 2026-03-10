import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Bus, MapPin } from 'lucide-react'

const Buses = () => {
  const { data, isLoading } = useQuery('buses', () => api.get('/buses'))

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الحافلات</h1>
        <p className="text-gray-600 mt-2">إدارة وتتبع الحافلات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.data?.map((bus) => (
          <div key={bus._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">حافلة #{bus.busNumber}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  السائق: {bus.driverId?.name || 'غير محدد'}
                </p>
              </div>
              <Bus className="text-primary-600" size={32} />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>الطلاب: {bus.studentIds?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>السعة: {bus.capacity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded ${
                  bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {bus.status === 'active' ? 'نشطة' : 'غير نشطة'}
                </span>
              </div>
            </div>

            <Link
              to={`/buses/${bus._id}/tracking`}
              className="btn btn-primary w-full text-center"
            >
              تتبع الحافلة
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Buses
