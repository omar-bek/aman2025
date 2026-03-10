import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../services/api'
import { MapPin, Bus, Users } from 'lucide-react'

const BusTracking = () => {
  const { id } = useParams()
  
  const { data: bus } = useQuery(['bus', id], () => 
    api.get(`/buses/${id}`)
  )

  const busData = bus?.data?.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تتبع الحافلة #{busData?.busNumber}</h1>
        <p className="text-gray-600 mt-2">الموقع الحالي للحافلة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold mb-4">الخريطة</h2>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">سيتم إضافة خريطة تفاعلية قريباً</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-3">معلومات الحافلة</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الحافلة:</span>
                <span className="font-medium">{busData?.busNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">السائق:</span>
                <span className="font-medium">{busData?.driverId?.name || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الطلاب:</span>
                <span className="font-medium">{busData?.studentIds?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">الموقع الحالي</h3>
            {busData?.currentLocation?.lat ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">خط العرض:</span>
                  <span className="font-medium">{busData.currentLocation.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">خط الطول:</span>
                  <span className="font-medium">{busData.currentLocation.lng.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر تحديث:</span>
                  <span className="font-medium">
                    {busData.currentLocation.timestamp 
                      ? new Date(busData.currentLocation.timestamp).toLocaleTimeString('ar-SA')
                      : '-'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">لا يوجد موقع متاح</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusTracking
