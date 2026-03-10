import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Calendar, BookOpen, Clock, Users, Edit, Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { format } from 'date-fns'

export default function TeacherExams() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    exam_name: '',
    subject: '',
    exam_type: 'quiz' as 'quiz' | 'midterm' | 'final',
    class_name: '',
    exam_date: new Date().toISOString().slice(0, 16),
    duration_minutes: 60,
    max_grade: 100,
    description: '',
  })
  const queryClient = useQueryClient()

  const { data: exams } = useQuery(
    'teacher-exams',
    async () => {
      try {
        const response = await apiClient.get('/teacher/exams/')
        return response.data || []
      } catch (error) {
        console.error('Error fetching exams:', error)
        return []
      }
    }
  )

  const createMutation = useMutation(
    async ({ formData, file }: { formData: any, file?: File | null }) => {
      const formDataToSend = new FormData()
      formDataToSend.append('exam_name', formData.exam_name)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('exam_type', formData.exam_type)
      // Always append these fields, even if empty
      if (formData.class_name) {
        formDataToSend.append('class_name', formData.class_name)
      }
      if (formData.exam_date) {
        formDataToSend.append('exam_date', formData.exam_date)
      }
      formDataToSend.append('duration_minutes', String(formData.duration_minutes || 60))
      formDataToSend.append('max_grade', String(formData.max_grade || 100))
      
      if (formData.description) {
        formDataToSend.append('description', formData.description)
      }
      
      if (file) {
        formDataToSend.append('file', file)
      }

      console.log('Sending exam data:', {
        exam_name: formData.exam_name,
        subject: formData.subject,
        exam_type: formData.exam_type,
        duration_minutes: formData.duration_minutes,
        max_grade: formData.max_grade,
        hasFile: !!file
      })

      // Don't set Content-Type manually - axios will set it automatically for FormData
      const response = await apiClient.post('/teacher/exams/', formDataToSend)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-exams')
        toast.success('تم إنشاء الامتحان بنجاح')
        setShowCreateModal(false)
        setSelectedFile(null)
        setFormData({
          exam_name: '',
          subject: '',
          exam_type: 'quiz',
          class_name: '',
          exam_date: new Date().toISOString().slice(0, 16),
          duration_minutes: 60,
          max_grade: 100,
          description: '',
        })
      },
      onError: (error: any) => {
        console.error('Error creating exam:', error)
        const errorMessage = error.response?.data?.detail || error.message || 'فشل إنشاء الامتحان'
        console.error('Error details:', error.response?.data)
        toast.error(errorMessage)
      }
    }
  )

  const deleteMutation = useMutation(
    async (id: number) => {
      await apiClient.delete(`/teacher/exams/${id}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-exams')
        toast.success('تم حذف الامتحان بنجاح')
      },
      onError: () => {
        toast.error('فشل حذف الامتحان')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ formData, file: selectedFile })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('يجب أن يكون الملف بصيغة PDF')
        e.target.value = ''
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('حجم الملف يجب أن يكون أقل من 10 ميجابايت')
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'midterm':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'final':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getExamTypeText = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'اختبار'
      case 'midterm':
        return 'نصفي'
      case 'final':
        return 'نهائي'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Calendar className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">جدول الامتحانات</h1>
                <p className="text-white/90">إدارة الامتحانات والاختبارات</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              امتحان جديد
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Exams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams?.map((exam: any) => (
            <div
              key={exam.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{exam.exam_name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{exam.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{exam.class_name || 'جميع الصفوف'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {format(new Date(exam.exam_date), 'dd MMM yyyy - HH:mm')}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getExamTypeColor(exam.exam_type)}`}>
                  {getExamTypeText(exam.exam_type)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-bold text-gray-900">{exam.duration_minutes} دقيقة</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">الدرجة الكاملة:</span>
                  <span className="font-bold text-gray-900">{exam.max_grade}</span>
                </div>
              </div>

              {exam.description && (
                <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg">{exam.description}</p>
              )}

              {exam.file_path && (
                <div className="mb-4">
                  <a
                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/api/teacher/exams/${exam.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      const token = localStorage.getItem('token')
                      if (token) {
                        const url = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/api/teacher/exams/${exam.id}/download`
                        fetch(url, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        }).then(res => res.blob()).then(blob => {
                          const downloadUrl = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = downloadUrl
                          a.download = `${exam.exam_name}.pdf`
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(downloadUrl)
                          document.body.removeChild(a)
                        }).catch(() => {
                          toast.error('فشل تحميل الملف')
                        })
                        e.preventDefault()
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-bold text-sm cursor-pointer"
                  >
                    <Download size={16} />
                    تحميل ملف PDF
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {/* Edit functionality */}}
                  className="flex-1 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-bold text-sm"
                >
                  <Edit size={16} className="inline ml-1" />
                  تعديل
                </button>
                <button
                  onClick={() => deleteMutation.mutate(exam.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!exams || exams.length === 0) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد امتحانات</p>
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">امتحان جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">اسم الامتحان</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.exam_name}
                  onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                  required
                  placeholder="مثال: اختبار الفصل الأول"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">المادة</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="الرياضيات"
                  />
                </div>
                <div>
                  <label className="label">نوع الامتحان</label>
                  <select
                    className="input-field"
                    value={formData.exam_type}
                    onChange={(e) => setFormData({ ...formData, exam_type: e.target.value as any })}
                  >
                    <option value="quiz">اختبار</option>
                    <option value="midterm">نصفي</option>
                    <option value="final">نهائي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">الصف</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  placeholder="مثال: 3A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">تاريخ ووقت الامتحان</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">المدة (دقيقة)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="label">الدرجة الكاملة</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.max_grade}
                  onChange={(e) => setFormData({ ...formData, max_grade: Number(e.target.value) })}
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="label">الوصف (اختياري)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ملاحظات أو تعليمات..."
                />
              </div>

              <div>
                <label className="label">رفع ملف PDF (اختياري)</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="input-field"
                />
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ تم اختيار الملف: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">الحجم الأقصى: 10 ميجابايت</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'جاري الحفظ...' : 'إنشاء الامتحان'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

