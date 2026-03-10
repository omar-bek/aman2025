import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Users, Search } from 'lucide-react'

const Students = () => {
  const { data, isLoading } = useQuery('students', () => api.get('/students'))

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الطلاب</h1>
          <p className="text-gray-600 mt-2">إدارة معلومات الطلاب</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن طالب..."
              className="input pr-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الطالب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الفصل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.data?.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="text-primary-600" size={20} />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        {student.arabicName && (
                          <div className="text-sm text-gray-500">{student.arabicName}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/students/${student._id}`}
                      className="text-primary-600 hover:text-primary-900 font-medium"
                    >
                      عرض التفاصيل
                    </Link>
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

export default Students
