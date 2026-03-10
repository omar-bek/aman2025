import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../services/api'
import { User, Calendar, BookOpen, Activity } from 'lucide-react'

const StudentDetail = () => {
  const { id } = useParams()
  
  const { data: student, isLoading } = useQuery(['student', id], () => 
    api.get(`/students/${id}`)
  )
  
  const { data: attendance } = useQuery(['attendance', id], () =>
    api.get(`/students/${id}/attendance`)
  )

  if (isLoading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  const studentData = student?.data?.data

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="text-primary-600" size={40} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{studentData?.name}</h1>
            {studentData?.arabicName && (
              <p className="text-xl text-gray-600 mt-1">{studentData.arabicName}</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">رقم الطالب</p>
                <p className="text-lg font-medium">{studentData?.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الصف</p>
                <p className="text-lg font-medium">{studentData?.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الفصل</p>
                <p className="text-lg font-medium">{studentData?.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                <p className="text-lg font-medium">
                  {studentData?.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString('ar-SA') : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href={`/attendance?studentId=${id}`} className="card hover:shadow-lg transition-shadow cursor-pointer">
          <Calendar className="text-primary-600 mb-2" size={24} />
          <h3 className="font-bold text-lg mb-1">الحضور</h3>
          <p className="text-gray-600 text-sm">{attendance?.data?.count || 0} سجل</p>
        </a>
        
        <a href={`/academic?studentId=${id}`} className="card hover:shadow-lg transition-shadow cursor-pointer">
          <BookOpen className="text-primary-600 mb-2" size={24} />
          <h3 className="font-bold text-lg mb-1">الأكاديمي</h3>
          <p className="text-gray-600 text-sm">عرض الدرجات</p>
        </a>
        
        <a href={`/behavior?studentId=${id}`} className="card hover:shadow-lg transition-shadow cursor-pointer">
          <Activity className="text-primary-600 mb-2" size={24} />
          <h3 className="font-bold text-lg mb-1">السلوك</h3>
          <p className="text-gray-600 text-sm">عرض السجل السلوكي</p>
        </a>
      </div>
    </div>
  )
}

export default StudentDetail
