import { useQuery } from 'react-query'
import api from '../services/api'
import { Calendar, MapPin } from 'lucide-react'

const Attendance = () => {
  const { data, isLoading } = useQuery('attendance', () => api.get('/attendance'))

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">سجلات الحضور</h1>
        <p className="text-gray-600 mt-2">تتبع دخول وخروج الطلاب</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطريقة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.data?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.studentId?.name || 'غير محدد'}
                    </div>
                    <div className="text-sm text-gray-500">{record.studentId?.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      record.type === 'school_entry' || record.type === 'bus_boarding' || record.type === 'home_arrival'
                        ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.type === 'school_entry' && 'دخول المدرسة'}
                      {record.type === 'school_exit' && 'خروج المدرسة'}
                      {record.type === 'bus_boarding' && 'صعود الحافلة'}
                      {record.type === 'bus_alighting' && 'نزول الحافلة'}
                      {record.type === 'home_arrival' && 'الوصول للمنزل'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.location === 'school' && 'المدرسة'}
                    {record.location === 'bus' && 'الحافلة'}
                    {record.location === 'home' && 'المنزل'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.method === 'rfid' && 'RFID'}
                    {record.method === 'smartwatch' && 'ساعة ذكية'}
                    {record.method === 'qr' && 'QR Code'}
                    {record.method === 'manual' && 'يدوي'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Attendance
