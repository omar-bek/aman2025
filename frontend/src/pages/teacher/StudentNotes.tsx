import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Loader,
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { studentsAPI } from '../../api'

interface NoteTemplate {
  id: string
  title: string
  category: 'academic' | 'behavior' | 'participation' | 'general'
  content: string
  icon: any
}

const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'academic-progress',
    title: 'تقدم أكاديمي',
    category: 'academic',
    content: 'أظهر الطالب تحسناً ملحوظاً في [الموضوع]. يمكن الاستمرار في [الإجراء].',
    icon: BookOpen
  },
  {
    id: 'academic-needs-support',
    title: 'احتياج دعم أكاديمي',
    category: 'academic',
    content: 'الطالب يحتاج دعم إضافي في [الموضوع]. يوصى بـ [الإجراء].',
    icon: BookOpen
  },
  {
    id: 'positive-behavior',
    title: 'سلوك إيجابي',
    category: 'behavior',
    content: 'الطالب أظهر سلوكاً ممتازاً في [الموقف]. تقدير للجهود.',
    icon: CheckCircle
  },
  {
    id: 'behavior-attention',
    title: 'ملاحظة سلوكية',
    category: 'behavior',
    content: 'لاحظت [السلوك] يحتاج متابعة. تم [الإجراء المتخذ].',
    icon: AlertCircle
  },
  {
    id: 'active-participation',
    title: 'مشاركة فعالة',
    category: 'participation',
    content: 'الطالب مشارك نشط في [النشاط]. يُشجع على الاستمرار.',
    icon: Clock
  },
  {
    id: 'general-note',
    title: 'ملاحظة عامة',
    category: 'general',
    content: '[ملاحظة عامة عن الطالب]',
    icon: FileText
  },
]

interface StudentNote {
  id: number
  student_id: number
  student_name: string
  note_date: string
  note_type: string
  title: string
  description: string
  category: string
  is_private: boolean
  created_at: string
}

export default function StudentNotes() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const [noteForm, setNoteForm] = useState({
    student_id: '',
    note_type: 'educational',
    title: '',
    description: '',
    category: 'general',
    is_private: false
  })

  const { data: students } = useQuery(
    'teacher-students',
    async () => {
      try {
        return await studentsAPI.getAll()
      } catch (error) {
        return []
      }
    }
  )

  const { data: notes, isLoading: notesLoading } = useQuery(
    ['student-notes', selectedStudent, selectedCategory],
    async () => {
      try {
        const params: any = {}
        if (selectedStudent) params.student_id = selectedStudent
        if (selectedCategory !== 'all') params.category = selectedCategory
        const response = await apiClient.get('/teacher/notes', { params })
        return response.data || []
      } catch (error) {
        return []
      }
    }
  )

  const createNoteMutation = useMutation(
    async (data: any) => {
      const response = await apiClient.post('/teacher/notes', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-notes')
        toast.success('تم حفظ الملاحظة بنجاح')
        setIsCreating(false)
        setNoteForm({
          student_id: '',
          note_type: 'educational',
          title: '',
          description: '',
          category: 'general',
          is_private: false
        })
        setSelectedTemplate(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل حفظ الملاحظة')
      }
    }
  )

  const updateNoteMutation = useMutation(
    async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.put(`/teacher/notes/${id}`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-notes')
        toast.success('تم تحديث الملاحظة')
        setEditingNote(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل تحديث الملاحظة')
      }
    }
  )

  const deleteNoteMutation = useMutation(
    async (id: number) => {
      await apiClient.delete(`/teacher/notes/${id}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('student-notes')
        toast.success('تم حذف الملاحظة')
      },
      onError: () => {
        toast.error('فشل حذف الملاحظة')
      }
    }
  )

  const handleTemplateSelect = (template: NoteTemplate) => {
    setSelectedTemplate(template.id)
    setNoteForm({
      ...noteForm,
      title: template.title,
      description: template.content,
      category: template.category
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteForm.student_id || !noteForm.title || !noteForm.description) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote, data: noteForm })
    } else {
      createNoteMutation.mutate({
        ...noteForm,
        student_id: parseInt(noteForm.student_id)
      })
    }
  }

  const filteredNotes = notes?.filter((note: StudentNote) => {
    if (searchQuery) {
      return note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             note.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  }) || []

  const getCategoryIcon = (category: string) => {
    const template = NOTE_TEMPLATES.find(t => t.category === category)
    return template?.icon || FileText
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700'
      case 'behavior':
        return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'participation':
        return 'bg-teal-50 border-teal-200 text-teal-700'
      default:
        return 'bg-sand-100 border-sand-300 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="العودة"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ملاحظات الطلاب</h1>
                <p className="text-sm text-gray-600 mt-1">قوالب جاهزة • ملاحظات مقيدة • خصوصية محمية</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              ملاحظة جديدة
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-card-lg p-4 border border-sand-200 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ابحث عن ملاحظة أو طالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">جميع الطلاب</option>
              {students?.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">جميع الفئات</option>
              <option value="academic">أكاديمي</option>
              <option value="behavior">سلوكي</option>
              <option value="participation">مشاركة</option>
              <option value="general">عام</option>
            </select>
          </div>
        </div>

        {/* Create/Edit Note Form */}
        {(isCreating || editingNote) && (
          <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingNote ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setEditingNote(null)
                  setSelectedTemplate(null)
                  setNoteForm({
                    student_id: '',
                    note_type: 'educational',
                    title: '',
                    description: '',
                    category: 'general',
                    is_private: false
                  })
                }}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">اختر قالب (اختياري)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {NOTE_TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template)}
                        className={`p-4 rounded-card border-2 text-right transition-all ${
                          selectedTemplate === template.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-sand-200 bg-white hover:border-teal-300'
                        }`}
                      >
                        <Icon className={`mb-2 ${selectedTemplate === template.id ? 'text-teal-600' : 'text-gray-400'}`} size={20} />
                        <p className="text-xs font-medium text-gray-900">{template.title}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الطالب *</label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={noteForm.student_id}
                    onChange={(e) => setNoteForm({ ...noteForm, student_id: e.target.value })}
                  >
                    <option value="">اختر طالب</option>
                    {students?.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة *</label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                  >
                    <option value="general">عام</option>
                    <option value="academic">أكاديمي</option>
                    <option value="behavior">سلوكي</option>
                    <option value="participation">مشاركة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_private"
                  className="w-4 h-4 text-teal-600 border-sand-300 rounded focus:ring-teal-500"
                  checked={noteForm.is_private}
                  onChange={(e) => setNoteForm({ ...noteForm, is_private: e.target.checked })}
                />
                <label htmlFor="is_private" className="text-sm text-gray-700">
                  ملاحظة خاصة (للمدرس فقط - غير مرئية لولي الأمر)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-sand-200">
                <button
                  type="submit"
                  disabled={createNoteMutation.isLoading || updateNoteMutation.isLoading}
                  className="px-6 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {(createNoteMutation.isLoading || updateNoteMutation.isLoading) ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingNote(null)
                  }}
                  className="px-6 py-2 bg-sand-100 text-gray-700 rounded-card text-sm font-medium hover:bg-sand-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">الملاحظات ({filteredNotes.length})</h2>

          {notesLoading ? (
            <div className="text-center py-12">
              <Loader className="mx-auto animate-spin text-teal-600" size={32} />
              <p className="text-gray-600 mt-4">جاري التحميل...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 mb-4">لا توجد ملاحظات</p>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                إنشاء ملاحظة جديدة
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note: StudentNote) => {
                const CategoryIcon = getCategoryIcon(note.category)
                return (
                  <div
                    key={note.id}
                    className={`p-5 rounded-card-lg border-2 ${getCategoryColor(note.category)} transition-all hover:shadow-elevated`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CategoryIcon size={20} />
                        <div>
                          <h3 className="font-bold text-gray-900">{note.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {note.student_name} • {new Date(note.note_date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      {note.is_private && (
                        <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                          خاص
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{note.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingNote(note.id)
                          setIsCreating(false)
                          setNoteForm({
                            student_id: note.student_id.toString(),
                            note_type: note.note_type,
                            title: note.title,
                            description: note.description,
                            category: note.category,
                            is_private: note.is_private
                          })
                        }}
                        className="px-3 py-1.5 bg-white text-gray-700 rounded-card text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <Edit size={14} />
                        تعديل
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
                            deleteNoteMutation.mutate(note.id)
                          }
                        }}
                        className="px-3 py-1.5 bg-white text-red-700 rounded-card text-xs font-medium hover:bg-red-50 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

