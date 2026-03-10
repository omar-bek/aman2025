import { useQuery } from 'react-query'
import api from '../services/api'
import { Calendar } from 'lucide-react'

const Dismissal = () => {
  const { data, isLoading } = useQuery('dismissals', () => api.get('/dismissal'))

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إذونات المغادرة</h1>
        <p className="text-gray-600 mt-2">إدارة طلبات مغادرة الطلاب</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ والوقت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السبب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.data?.map((dismissal) => (
                <tr key={dismissal._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {dismissal.studentId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(dismissal.dismissalDate).toLocaleDateString('ar-SA')} - {dismissal.dismissalTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{dismissal.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      dismissal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      dismissal.status === 'pending_teacher' || dismissal.status === 'pending_admin' ? 'bg-yellow-100 text-yellow-800' :
                      dismissal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {dismissal.status === 'pending_teacher' && 'في انتظار المعلم'}
                      {dismissal.status === 'pending_admin' && 'في انتظار الإدارة'}
                      {dismissal.status === 'approved' && 'موافق عليه'}
                      {dismissal.status === 'rejected' && 'مرفوض'}
                      {dismissal.status === 'completed' && 'مكتمل'}
                    </span>
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

export default Dismissal
