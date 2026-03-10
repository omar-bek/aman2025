import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { studentsAPI } from '../../api'
import { ArrowRight, Send, Search, User, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'

interface Message {
  id: string
  student_id: string
  student_name?: string
  parent_name?: string
  message: string
  sender_role: 'teacher' | 'parent'
  created_at: string
  is_read: boolean
}

export default function TeacherMessages() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const studentIdParam = searchParams.get('student_id')

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    studentIdParam ?? null
  )
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useQuery('students', studentsAPI.getAll)

  const {
    data: messages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    refetch: refetchMessages,
  } = useQuery(
    ['teacher-messages', selectedStudentId],
    async () => {
      try {
        const response = await apiClient.get('/teacher/messages/', {
          params: { student_id: selectedStudentId || undefined }
        })
        return response.data || []
      } catch (error: any) {
        console.error('Error fetching messages:', error)
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'تعذر تحميل الرسائل'
        toast.error(message)
        throw error
      }
    },
    { enabled: true, retry: 1 }
  )

  const sendMutation = useMutation(
    async (data: { student_id: string; message: string }) => {
      const response = await apiClient.post('/teacher/messages/', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-messages')
        setMessageText('')
        toast.success('تم إرسال الرسالة بنجاح')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل إرسال الرسالة')
      }
    }
  )

  const markReadMutation = useMutation(
    async (messageId: string) => {
      const response = await apiClient.post(`/teacher/messages/${messageId}/read`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-messages')
      }
    }
  )

  const studentsArray = Array.isArray(students) ? students : []
  const messagesArray = Array.isArray(messages) ? messages : []

  const filteredStudents = studentsArray.filter((student: any) =>
    (student.full_name ?? student.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const studentMessages = messagesArray.filter((msg: Message) =>
    selectedStudentId ? msg.student_id === selectedStudentId : true
  )

  // Mark parent messages as read when opening a thread
  useEffect(() => {
    if (!selectedStudentId || !messagesArray.length) return

    const unreadParentMessages = messagesArray.filter(
      (msg: Message) =>
        msg.student_id === selectedStudentId &&
        msg.sender_role === 'parent' &&
        !msg.is_read
    )

    if (!unreadParentMessages.length) return

    unreadParentMessages.forEach((msg) => {
      markReadMutation.mutate(msg.id)
    })
  }, [selectedStudentId, messagesArray, markReadMutation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId || !messageText.trim()) {
      toast.error('يرجى اختيار طالب وكتابة رسالة')
      return
    }
    sendMutation.mutate({ student_id: selectedStudentId, message: messageText })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
            <MessageSquare className="text-white" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">الرسائل</h1>
              <p className="text-white/90">التواصل مع أولياء الأمور</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
              {(isStudentsLoading || isStudentsError) && (
                <div className="mb-4">
                  {isStudentsLoading && <LoadingState inline message="جاري تحميل الطلاب..." />}
                  {isStudentsError && !isStudentsLoading && (
                    <ErrorState
                      title="تعذر تحميل قائمة الطلاب"
                      description="حدث خطأ أثناء جلب بيانات الطلاب."
                      onRetry={() => refetchStudents()}
                    />
                  )}
                </div>
              )}

              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredStudents.map((student: any) => {
                  const studentKey = String(student.id ?? student._id)
                  const unreadCount =
                    messagesArray.filter(
                      (msg: Message) =>
                        msg.student_id === studentKey &&
                        !msg.is_read &&
                        msg.sender_role === 'parent'
                    ).length || 0

                  return (
                    <button
                      key={studentKey}
                      onClick={() => setSelectedStudentId(studentKey)}
                      className={`w-full p-4 rounded-xl text-right transition-all ${
                        selectedStudentId === studentKey
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              selectedStudentId === studentKey
                                ? 'bg-white/20'
                                : 'bg-primary-100'
                            }`}
                          >
                            <User
                              className={
                                selectedStudentId === studentKey
                                  ? 'text-white'
                                  : 'text-primary-600'
                              }
                              size={20}
                            />
                          </div>
                          <div>
                            <p className="font-bold">{student.full_name ?? student.name}</p>
                            <p className="text-xs opacity-80">{student.class_name ?? student.class}</p>
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            {selectedStudentId ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-lg flex flex-col h-[calc(100vh-200px)]">
                {(isMessagesLoading || isMessagesError) && (
                  <div className="p-4 border-b-2 border-gray-200">
                    {isMessagesLoading && (
                      <LoadingState inline message="جاري تحميل الرسائل..." />
                    )}
                    {isMessagesError && !isMessagesLoading && (
                      <ErrorState
                        title="تعذر تحميل الرسائل"
                        description="حدث خطأ أثناء جلب المحادثة."
                        onRetry={() => refetchMessages()}
                      />
                    )}
                  </div>
                )}
                {/* Messages Header */}
                <div className="p-4 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <User className="text-primary-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {studentsArray.find((s: any) => String(s.id ?? s._id) === selectedStudentId)?.full_name ??
                            studentsArray.find((s: any) => String(s.id ?? s._id) === selectedStudentId)?.name}
                        </h3>
                        <p className="text-sm text-gray-600">ولي الأمر</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {studentMessages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_role === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
                          message.sender_role === 'teacher'
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.sender_role === 'parent' && (
                          <p className="text-xs font-medium mb-1 opacity-80">{message.parent_name || 'ولي الأمر'}</p>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1.5 ${message.sender_role === 'teacher' ? 'text-white/80' : 'text-gray-500'}`}>
                          {new Date(message.created_at).toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!studentMessages || studentMessages.length === 0) && (
                    <div className="text-center py-12">
                      <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">لا توجد رسائل</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t-2 border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="اكتب رسالة..."
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      disabled={sendMutation.isLoading || !messageText.trim()}
                      className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">اختر طالباً لعرض الرسائل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
