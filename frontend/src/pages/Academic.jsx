import { useQuery } from 'react-query'
import api from '../services/api'
import { BookOpen } from 'lucide-react'

const Academic = () => {
  const { data: grades } = useQuery('grades', () => api.get('/academic/grades'))
  const { data: exams } = useQuery('exams', () => api.get('/academic/exams'))
  const { data: assignments } = useQuery('assignments', () => api.get('/academic/assignments'))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الأداء الأكاديمي</h1>
        <p className="text-gray-600 mt-2">الدرجات والامتحانات والواجبات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">الدرجات</h2>
          <div className="space-y-2">
            {grades?.data?.data?.slice(0, 5).map((grade) => (
              <div key={grade._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{grade.studentId?.name}</p>
                  <p className="text-sm text-gray-600">{grade.subject}</p>
                </div>
                <span className="font-bold text-primary-600">{grade.grade}/{grade.maxGrade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">الامتحانات</h2>
          <div className="space-y-2">
            {exams?.data?.data?.slice(0, 5).map((exam) => (
              <div key={exam._id} className="p-2 hover:bg-gray-50 rounded">
                <p className="font-medium">{exam.title}</p>
                <p className="text-sm text-gray-600">{exam.subject} - {exam.grade}</p>
                <p className="text-xs text-gray-500">{new Date(exam.date).toLocaleDateString('ar-SA')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">الواجبات</h2>
          <div className="space-y-2">
            {assignments?.data?.data?.slice(0, 5).map((assignment) => (
              <div key={assignment._id} className="p-2 hover:bg-gray-50 rounded">
                <p className="font-medium">{assignment.title}</p>
                <p className="text-sm text-gray-600">{assignment.subject} - {assignment.grade}</p>
                <p className="text-xs text-gray-500">
                  موعد التسليم: {new Date(assignment.dueDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Academic
