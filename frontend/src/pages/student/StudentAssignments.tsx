import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Filter,
  Search,
  Loader,
  FileText,
  AlertCircle
} from 'lucide-react'
import apiClient from '../../api/client'
import { format } from 'date-fns'

interface Assignment {
  id: number
  assignment_name: string
  subject: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed'
  description?: string
  priority?: 'high' | 'medium' | 'low'
}

export default function StudentAssignments() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: assignments, isLoading } = useQuery(
    ['student-assignments', filterStatus],
    async () => {
      try {
        const response = await apiClient.get('/student/assignments')
        return response.data || []
      } catch (error) {
        // Mock data
        return [
          {
            id: 1,
            assignment_name: 'تمارين الجبر - الفصل 3',
            subject: 'الرياضيات',
            due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress',
            description: 'حل التمارين من الصفحة 45-50',
            priority: 'high'
          },
          {
            id: 2,
            assignment_name: 'بحث عن النظام الشمسي',
            subject: 'العلوم',
            due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            description: 'كتابة بحث قصير عن الكواكب',
            priority: 'medium'
          },
          {
            id: 3,
            assignment_name: 'قراءة القصة',
            subject: 'اللغة العربية',
            due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'قراءة القصة من الكتاب',
            priority: 'low'
          },
        ] as Assignment[]
      }
    }
  )

  const { data: assignmentDetail } = useQuery(
    ['assignment-detail', id],
    async () => {
      if (!id) return null
      try {
        const response = await apiClient.get(`/student/assignments/${id}`)
        return response.data
      } catch (error) {
        return null
      }
    },
    { enabled: !!id }
  )

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'in_progress':
        return 'bg-teal-100 text-teal-700 border-teal-200'
      default:
        return 'bg-sand-100 text-gray-700 border-sand-200'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-amber-600'
      case 'medium':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredAssignments = Array.isArray(assignments) ? assignments.filter((assignment: Assignment) => {
    if (filterStatus !== 'all' && assignment.status !== filterStatus) return false
    if (searchQuery && !assignment.assignment_name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) : []

  const pendingCount = Array.isArray(assignments) ? assignments.filter((a: Assignment) => a.status === 'pending').length : 0
  const inProgressCount = Array.isArray(assignments) ? assignments.filter((a: Assignment) => a.status === 'in_progress').length : 0
  const completedCount = Array.isArray(assignments) ? assignments.filter((a: Assignment) => a.status === 'completed').length : 0

  // Focus mode: Show only one assignment if ID is provided
  if (id && assignmentDetail) {
    const assignment = assignmentDetail as Assignment
    const daysUntil = getDaysUntilDue(assignment.due_date)

    return (
      <div className="min-h-screen bg-sand-50">
        <div className="bg-white border-b border-sand-200 shadow-soft">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student/assignments')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">تفاصيل الواجب</h1>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{assignment.assignment_name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {assignment.subject}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                  {assignment.status === 'completed' ? 'مكتمل' : assignment.status === 'in_progress' ? 'قيد التنفيذ' : 'معلق'}
                </span>
              </div>
            </div>

            {assignment.description && (
              <div className="p-4 bg-sand-50 rounded-card border border-sand-200">
                <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-sand-50 rounded-card border border-sand-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-teal-600" size={18} />
                  <p className="text-xs text-gray-600">موعد التسليم</p>
                </div>
                <p className="font-medium text-gray-900">
                  {format(new Date(assignment.due_date), 'EEEE، d MMMM yyyy')}
                </p>
                <p className={`text-sm mt-1 ${daysUntil < 0 ? 'text-red-600' : daysUntil <= 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                  {daysUntil < 0 ? `متأخر ${Math.abs(daysUntil)} يوم` : daysUntil === 0 ? 'اليوم' : daysUntil === 1 ? 'غداً' : `${daysUntil} أيام متبقية`}
                </p>
              </div>

              <div className="p-4 bg-sand-50 rounded-card border border-sand-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={getPriorityColor(assignment.priority)} size={18} />
                  <p className="text-xs text-gray-600">الأولوية</p>
                </div>
                <p className="font-medium text-gray-900">
                  {assignment.priority === 'high' ? 'عالية' : assignment.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </p>
              </div>
            </div>

            {assignment.status !== 'completed' && (
              <div className="pt-4 border-t border-sand-200">
                <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-card font-medium hover:bg-teal-700 transition-colors">
                  {assignment.status === 'in_progress' ? 'متابعة العمل' : 'بدء العمل'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الواجبات</h1>
                <p className="text-sm text-gray-600 mt-1">ركز على إتمام مهمتك التالية</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card text-center">
            <p className="text-2xl font-bold text-gray-900 mb-1">{pendingCount}</p>
            <p className="text-xs text-gray-600">معلق</p>
          </div>
          <div className="bg-white rounded-card-lg p-4 border border-teal-200 shadow-card text-center">
            <p className="text-2xl font-bold text-gray-900 mb-1">{inProgressCount}</p>
            <p className="text-xs text-gray-600">قيد التنفيذ</p>
          </div>
          <div className="bg-white rounded-card-lg p-4 border border-emerald-200 shadow-card text-center">
            <p className="text-2xl font-bold text-gray-900 mb-1">{completedCount}</p>
            <p className="text-xs text-gray-600">مكتمل</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ابحث عن واجب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">الكل</option>
              <option value="pending">معلق</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="mx-auto animate-spin text-teal-600" size={32} />
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map((assignment: Assignment) => {
              const daysUntil = getDaysUntilDue(assignment.due_date)
              const isUrgent = daysUntil <= 2 && daysUntil >= 0
              const isOverdue = daysUntil < 0

              return (
                <button
                  key={assignment.id}
                  onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                  className={`w-full text-right p-5 rounded-card-lg border-2 transition-all hover:shadow-elevated ${isOverdue
                      ? 'bg-red-50 border-red-200'
                      : isUrgent
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-sand-200 hover:border-teal-300'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {assignment.status === 'completed' ? (
                        <CheckCircle className="text-emerald-500" size={24} />
                      ) : assignment.status === 'in_progress' ? (
                        <Clock className="text-teal-500" size={24} />
                      ) : (
                        <Circle className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{assignment.assignment_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <BookOpen size={14} />
                          {assignment.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {format(new Date(assignment.due_date), 'd MMM')}
                        </span>
                      </div>
                      {assignment.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-sand-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                      {assignment.status === 'completed' ? 'مكتمل' : assignment.status === 'in_progress' ? 'قيد التنفيذ' : 'معلق'}
                    </span>
                    <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-gray-600'
                      }`}>
                      {isOverdue ? `متأخر ${Math.abs(daysUntil)} يوم` : daysUntil === 0 ? 'اليوم' : daysUntil === 1 ? 'غداً' : `${daysUntil} أيام`}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-card-lg border border-sand-200 shadow-card">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 mb-1">لا توجد واجبات</p>
            <p className="text-sm text-gray-400">رائع! جميع واجباتك مكتملة 🌟</p>
          </div>
        )}
      </div>
    </div>
  )
}

