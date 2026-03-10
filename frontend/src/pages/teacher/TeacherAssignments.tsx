import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { assignmentsAPI, type Assignment, type AssignmentCreate } from '../../api'
import { Plus, Search, Calendar, BookOpen, Users, FileText, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function TeacherAssignments() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: assignmentsResponse } = useQuery(
    'teacher-assignments',
    async () => {
      return await assignmentsAPI.getAll()
    }
  )

  const assignmentsData = assignmentsResponse?.data
  const assignments = Array.isArray(assignmentsData) ? assignmentsData : []

  const { data: submissionsResponse } = useQuery(
    ['assignment-submissions', selectedAssignment?.id],
    async () => {
      if (!selectedAssignment) return { data: [] }
      return await assignmentsAPI.getSubmissions(selectedAssignment.id)
    },
    { enabled: !!selectedAssignment }
  )

  const submissionsData = submissionsResponse?.data
  const submissions = Array.isArray(submissionsData) ? submissionsData : []

  const deleteMutation = useMutation(assignmentsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('teacher-assignments')
      toast.success('تم حذف الواجب بنجاح')
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الواجب')
    },
  })

  const filteredAssignments = Array.isArray(assignments) ? assignments.filter((assignment: Assignment) =>
    assignment.assignment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">الواجبات المدرسية</h1>
              <p className="text-white/90">إدارة ومتابعة الواجبات</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              إضافة واجب جديد
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث في الواجبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Assignments List */}
        {filteredAssignments && filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment: Assignment) => (
              <div key={assignment.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {assignment.assignment_name}
                    </h3>
                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="عرض التفاصيل"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(assignment.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen size={16} />
                    <span>{assignment.class_name || 'جميع الصفوف'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      {format(new Date(assignment.due_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{assignment.assignment_type === 'individual' ? 'فردي' : 'جماعي'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {assignment.description || 'لا يوجد وصف'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد واجبات</p>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <CreateAssignmentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            queryClient.invalidateQueries('teacher-assignments')
          }}
        />
      )}

      {/* Submissions Modal */}
      {selectedAssignment && (
        <SubmissionsModal
          assignment={selectedAssignment}
          submissions={submissions}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  )
}

function CreateAssignmentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<AssignmentCreate>({
    assignment_name: '',
    subject: '',
    description: '',
    due_date: new Date().toISOString().slice(0, 16),
    max_grade: 100,
    class_name: '',
    grade: '',
    assignment_type: 'individual',
  })

  const createMutation = useMutation(assignmentsAPI.create, {
    onSuccess: () => {
      toast.success('تم إنشاء الواجب بنجاح')
      onSuccess()
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء الواجب')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">إضافة واجب جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">اسم الواجب</label>
            <input
              type="text"
              required
              value={formData.assignment_name}
              onChange={(e) => setFormData({ ...formData, assignment_name: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">المادة</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">الصف</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">الصف الدراسي</label>
            <input
              type="text"
              value={formData.class_name}
              onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              className="input-field"
              placeholder="مثال: 1A"
            />
          </div>

          <div>
            <label className="label">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">موعد التسليم</label>
              <input
                type="datetime-local"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">الدرجة الكاملة</label>
              <input
                type="number"
                value={formData.max_grade}
                onChange={(e) => setFormData({ ...formData, max_grade: Number(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">نوع الواجب</label>
            <select
              value={formData.assignment_type}
              onChange={(e) => setFormData({ ...formData, assignment_type: e.target.value as 'individual' | 'group' })}
              className="input-field"
            >
              <option value="individual">فردي</option>
              <option value="group">جماعي</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              إلغاء
            </button>
            <button type="submit" className="btn-primary" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? 'جاري الحفظ...' : 'إنشاء الواجب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SubmissionsModal({
  assignment,
  submissions,
  onClose,
}: {
  assignment: Assignment
  submissions: any[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{assignment.assignment_name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">الطالب #{submission.student_id}</p>
                  <p className="text-sm text-gray-500">
                    الحالة: {submission.submission_status}
                  </p>
                </div>
                {submission.grade && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {submission.grade} / {assignment.max_grade}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

