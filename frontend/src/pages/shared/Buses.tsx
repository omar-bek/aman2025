import { useQuery } from 'react-query'
import { busesAPI } from '../../api'
import { Bus, MapPin, Users, Phone } from 'lucide-react'

export default function Buses() {
  const { data: buses, isLoading } = useQuery('buses', busesAPI.getAll)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الحافلات</h1>
        <p className="text-gray-600 mt-1">تتبع الحافلات في الوقت الفعلي</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">جاري التحميل...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses?.map((bus) => (
            <div key={bus.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Bus className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">حافلة {bus.bus_number}</h3>
                    <p className="text-sm text-gray-500">{bus.license_plate}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bus.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {bus.is_active ? 'نشطة' : 'غير نشطة'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>السائق: {bus.driver_name || 'غير محدد'}</span>
                </div>
                {bus.driver_phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{bus.driver_phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>السعة: {bus.capacity} طالب</span>
                </div>
              </div>

              <button className="w-full mt-4 btn-primary">تتبع الموقع</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

