import { useQuery } from 'react-query'
import api from '../services/api'
import { Activity, AlertCircle, CheckCircle } from 'lucide-react'

const Behavior = () => {
  const { data, isLoading } = useQuery('behaviors', () => api.get('/behavior'))

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">السجل السلوكي</h1>
        <p className="text-gray-600 mt-2">تتبع سلوك الطلاب</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوصف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأهمية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.data?.map((behavior) => (
                <tr key={behavior._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {behavior.studentId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {behavior.type === 'positive' ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <AlertCircle className="text-red-600" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{behavior.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      behavior.severity === 'high' ? 'bg-red-100 text-red-800' :
                      behavior.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {behavior.severity === 'high' && 'عالية'}
                      {behavior.severity === 'medium' && 'متوسطة'}
                      {behavior.severity === 'low' && 'منخفضة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(behavior.date).toLocaleDateString('ar-SA')}
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

export default Behavior
