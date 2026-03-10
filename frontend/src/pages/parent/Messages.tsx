import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Send, Search, Phone, Video } from 'lucide-react'
import { useQuery } from 'react-query'
import apiClient from '../../api/client'
import ParentBottomNav from '../../components/ParentBottomNav'

interface Message {
  id: number
  sender: string
  senderRole: string
  message: string
  timestamp: string
  isRead: boolean
  avatar?: string
}

export default function Messages() {
  const navigate = useNavigate()
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [messageText, setMessageText] = useState('')

  const { data: messages } = useQuery('messages', async () => {
    const response = await apiClient.get('/notifications/')
    return response.data
  })

  // Mock conversations
  const conversations = [
    {
      id: 1,
      name: 'المدرسة - الإدارة',
      role: 'إدارة',
      lastMessage: 'تم تسجيل حضور الطالب بنجاح',
      timestamp: 'منذ 5 دقائق',
      unread: 2,
      avatar: '🏫'
    },
    {
      id: 2,
      name: 'المعلم أحمد',
      role: 'معلم',
      lastMessage: 'الطالب يحتاج إلى متابعة إضافية',
      timestamp: 'منذ ساعة',
      unread: 0,
      avatar: '👨‍🏫'
    },
    {
      id: 3,
      name: 'الممرضة سارة',
      role: 'ممرضة',
      lastMessage: 'تم فحص الطالب وهو بصحة جيدة',
      timestamp: 'أمس',
      unread: 1,
      avatar: '👩‍⚕️'
    }
  ]

  const chatMessages: Message[] = selectedChat === 1 ? [
    {
      id: 1,
      sender: 'المدرسة - الإدارة',
      senderRole: 'إدارة',
      message: 'مرحباً، نود إبلاغكم بأن الطالب قد وصل إلى المدرسة بأمان',
      timestamp: '9:30 AM',
      isRead: true
    },
    {
      id: 2,
      sender: 'أنت',
      senderRole: 'ولي أمر',
      message: 'شكراً لكم على المتابعة',
      timestamp: '9:32 AM',
      isRead: true
    },
    {
      id: 3,
      sender: 'المدرسة - الإدارة',
      senderRole: 'إدارة',
      message: 'تم تسجيل حضور الطالب بنجاح',
      timestamp: '9:35 AM',
      isRead: false
    }
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header - Premium */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/parent')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">الرسائل</h1>
          </div>
        </div>
      </div>

      {!selectedChat ? (
        /* Conversations List */
        <div className="p-4 space-y-3">
          {/* Search - Premium */}
          <div className="relative mb-4">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث في المحادثات..."
              className="w-full pr-12 pl-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-md transition-all"
            />
          </div>

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 hover:border-primary-400 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-base">{conversation.name}</h3>
                    <span className="text-xs text-gray-500 font-medium">{conversation.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-700 truncate font-medium">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{conversation.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Chat View */
        <div className="flex flex-col h-[calc(100vh-60px)]">
          {/* Chat Header - Premium */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <ArrowRight size={24} className="text-white" />
                </button>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/30">
                  {conversations.find(c => c.id === selectedChat)?.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {conversations.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-white/90">
                    {conversations.find(c => c.id === selectedChat)?.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-white/20 rounded-xl transition-colors">
                  <Phone className="text-white" size={20} />
                </button>
                <button className="p-2.5 hover:bg-white/20 rounded-xl transition-colors">
                  <Video className="text-white" size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages - Premium */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'أنت' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
                    message.sender === 'أنت'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                      : 'bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-900'
                  }`}
                >
                  {message.sender !== 'أنت' && (
                    <p className="text-xs font-bold mb-1.5 opacity-90">{message.sender}</p>
                  )}
                  <p className="text-sm font-medium">{message.message}</p>
                  <p className={`text-xs mt-1.5 ${message.sender === 'أنت' ? 'text-white/80' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input - Premium */}
          <div className="bg-white/95 backdrop-blur-lg border-t-2 border-gray-200 shadow-2xl px-4 py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="اكتب رسالة..."
                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && messageText.trim()) {
                    // Send message
                    setMessageText('')
                  }
                }}
              />
              <button
                onClick={() => {
                  if (messageText.trim()) {
                    // Send message
                    setMessageText('')
                  }
                }}
                className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <ParentBottomNav />

      <div className="h-20"></div>
    </div>
  )
}

