import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import { UserPlus, Check, X } from 'lucide-react'

const Pickup = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  
  const { data, isLoading } = useQuery('pickups', () => api.get('/pickup'))
  
  const createMutation = useMutation((data) => api.post('/pickup', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('pickups')
      toast.success('تم إنشاء طلب الاستلام بنجاح')
      setShowForm(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'فشل إنشاء الطلب')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    createMutation.mutate({
      studentId: formData.get('studentId'),
      pickupDate: formData.get('pickupDate'),
      pickupTime: formData.get('pickupTime'),
      authorizedPerson: {
        name: formData.get('authorizedName'),
        relationship: formData.get('relationship'),
        phone: formData.get('phone')
      }
    })
  }

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طلبات الاستلام</h1>
          <p className="text-gray-600 mt-2">إدارة طلبات استلام الطلاب</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <UserPlus size={20} className="ml-2" />
          طلب استلام جديد
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">طلب استلام جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">رقم الطالب</label>
                <input name="studentId" type="text" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ الاستلام</label>
                <input name="pickupDate" type="date" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">وقت الاستلام</label>
                <input name="pickupTime" type="time" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">اسم المصرح له</label>
                <input name="authorizedName" type="text" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">صلة القرابة</label>
                <input name="relationship" type="text" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                <input name="phone" type="tel" className="input" required />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">إرسال الطلب</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ والوقت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المصرح له</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.data?.map((pickup) => (
                <tr key={pickup._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {pickup.studentId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(pickup.pickupDate).toLocaleDateString('ar-SA')} - {pickup.pickupTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pickup.authorizedPerson?.name} ({pickup.authorizedPerson?.relationship})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      pickup.status === 'approved' ? 'bg-green-100 text-green-800' :
                      pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      pickup.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {pickup.status === 'pending' && 'قيد الانتظار'}
                      {pickup.status === 'approved' && 'موافق عليه'}
                      {pickup.status === 'rejected' && 'مرفوض'}
                      {pickup.status === 'completed' && 'مكتمل'}
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

export default Pickup
