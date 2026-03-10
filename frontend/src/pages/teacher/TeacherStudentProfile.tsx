import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import { ArrowRight, User, Calendar, BookOpen, Award, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import apiClient from '../../api/client'

export default function TeacherStudentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: student } = useQuery(
    ['student', id],
    () => studentsAPI.getById(id as string),
    { enabled: !!id }
  )

  const { data: attendance } = useQuery(
    ['student-attendance', id],
    async () => {
      try {
        const response = await apiClient.get(`/attendance/student/${id}`)
        return response.data || []
      } catch (error) {
        console.error('Error fetching attendance:', error)
        return []
      }
    },
    { enabled: !!id }
  )

  const { data: evaluations } = useQuery(
    ['student-evaluations', id],
    async () => {
      try {
        const response = await apiClient.get('/teacher/evaluations/', {
          params: { student_id: id }
        })
        const data = response.data
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Error fetching evaluations:', error)
        return []
      }
    },
    { enabled: !!id }
  )

  const { data: assignments } = useQuery(
    ['student-assignments', id],
    async () => {
      try {
        const response = await apiClient.get('/academic/assignments')
        // Filter by student's class if needed
        return response.data || []
      } catch (error) {
        console.error('Error fetching assignments:', error)
        return []
      }
    },
    { enabled: !!id }
  )

  const attendanceRate = Array.isArray(attendance) && attendance.length > 0
    ? (attendance.filter((a: any) => a.status === 'PRESENT').length / attendance.length * 100).toFixed(0)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{student?.full_name}</h1>
              <p className="text-white/90">{student?.grade} - {student?.class_name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-blue-600" size={24} />
              <span className="text-3xl font-bold text-gray-900">{attendanceRate}%</span>
            </div>
            <p className="text-sm font-bold text-gray-700">نسبة الحضور</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="text-green-600" size={24} />
              <span className="text-3xl font-bold text-gray-900">
                {Array.isArray(assignments) ? assignments.length : 0}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-700">الواجبات</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="text-yellow-600" size={24} />
              <span className="text-3xl font-bold text-gray-900">
                {Array.isArray(evaluations) ? evaluations.length : 0}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-700">التقييمات</p>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">التقييمات الأخيرة</h2>
            <button
              onClick={() => navigate('/teacher/evaluations')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {(Array.isArray(evaluations) ? evaluations : []).slice(0, 5).map((evaluation: any) => (
              <div key={evaluation.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {new Date(evaluation.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {evaluation.evaluation_type === 'daily' ? 'يومي' : 'شهري'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">الالتزام</p>
                    <p className="text-sm font-bold text-gray-900">
                      {(evaluation.commitment_level || evaluation.commitment) === 'excellent' ? 'ممتاز' : (evaluation.commitment_level || evaluation.commitment) === 'good' ? 'جيد' : 'يحتاج دعم'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">التفاعل</p>
                    <p className="text-sm font-bold text-gray-900">
                      {(evaluation.interaction_level || evaluation.interaction) === 'excellent' ? 'ممتاز' : (evaluation.interaction_level || evaluation.interaction) === 'good' ? 'جيد' : 'يحتاج دعم'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">السلوك</p>
                    <p className="text-sm font-bold text-gray-900">
                      {(evaluation.behavior_level || evaluation.behavior) === 'excellent' ? 'ممتاز' : (evaluation.behavior_level || evaluation.behavior) === 'good' ? 'جيد' : 'يحتاج دعم'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">المشاركة</p>
                    <p className="text-sm font-bold text-gray-900">
                      {(evaluation.participation_level || evaluation.participation) === 'excellent' ? 'ممتاز' : (evaluation.participation_level || evaluation.participation) === 'good' ? 'جيد' : 'يحتاج دعم'}
                    </p>
                  </div>
                </div>
                {(evaluation.educational_notes || evaluation.notes) && (
                  <p className="text-sm text-gray-700 mt-3 p-2 bg-blue-50 rounded-lg">{evaluation.educational_notes || evaluation.notes}</p>
                )}
              </div>
            ))}
            {(!evaluations || !Array.isArray(evaluations) || evaluations.length === 0) && (
              <p className="text-center text-gray-500 py-4">لا توجد تقييمات</p>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">الواجبات</h2>
            <button
              onClick={() => navigate('/teacher/assignments')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {(Array.isArray(assignments) ? assignments : []).slice(0, 5).map((assignment: any) => (
              <div key={assignment.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{assignment.assignment_name}</h3>
                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">موعد التسليم</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(assignment.due_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!assignments || !Array.isArray(assignments) || assignments.length === 0) && (
              <p className="text-center text-gray-500 py-4">لا توجد واجبات</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/teacher/evaluations/new?student_id=${id}`)}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Award className="inline ml-2" size={20} />
            تقييم جديد
          </button>
          <button
            onClick={() => navigate(`/teacher/messages?student_id=${id}`)}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <MessageSquare className="inline ml-2" size={20} />
            إرسال رسالة
          </button>
        </div>
      </div>
    </div>
  )
}

