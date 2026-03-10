import { useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, CheckCircle, Clock } from 'lucide-react'
import { DailyDigestItem } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function DailyDigest() {
  const navigate = useNavigate()

  // Mock digest items (max 5)
  const digestItems = [
    {
      id: '1',
      icon: <CheckCircle size={16} className="text-emerald-600" />,
      text: 'وصل جميع الأطفال في الوقت المحدد',
      time: '08:15',
      priority: 'normal' as const,
    },
    {
      id: '2',
      icon: <CheckCircle size={16} className="text-emerald-600" />,
      text: 'لا توجد حوادث أو مخاوف',
      time: '12:00',
      priority: 'normal' as const,
    },
    {
      id: '3',
      icon: <CheckCircle size={16} className="text-teal-600" />,
      text: 'جميع الأنشطة طبيعية',
      time: '14:30',
      priority: 'normal' as const,
    },
    {
      id: '4',
      icon: <Clock size={16} className="text-status-info" />,
      text: 'تم جدولة اجتماع أولياء الأمور الأسبوع القادم',
      time: '15:00',
      priority: 'normal' as const,
    },
    {
      id: '5',
      icon: <CheckCircle size={16} className="text-emerald-600" />,
      text: 'تم الانتهاء من جميع الأنشطة بنجاح',
      time: '16:00',
      priority: 'normal' as const,
    },
  ]

  const today = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">الملخص اليومي</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-sand-100 to-white rounded-card-lg shadow-card border-2 border-sand-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-teal-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{today}</h2>
              <p className="text-sm text-gray-600">Today's Summary</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">5</p>
              <p className="text-xs text-gray-600 mt-1">آمن</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">5</p>
              <p className="text-xs text-gray-600 mt-1">في الوقت</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">0</p>
              <p className="text-xs text-gray-600 mt-1">مخاوف</p>
            </div>
          </div>
        </div>

        {/* Digest Items */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل اليوم</h3>
          <div className="space-y-1">
            {digestItems.map((item) => (
              <DailyDigestItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                time={item.time}
                priority={item.priority}
              />
            ))}
          </div>
        </div>

        {/* Child-Specific Digests (Collapsible) */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ملخصات الأطفال</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-gray-900 mb-2">أحمد علي</h4>
              <div className="space-y-1">
                <DailyDigestItem
                  icon={<CheckCircle size={16} className="text-emerald-600" />}
                  text="حضور جميع الحصص"
                  time="08:30"
                />
                <DailyDigestItem
                  icon={<CheckCircle size={16} className="text-emerald-600" />}
                  text="مشاركة نشطة في الأنشطة"
                  time="14:00"
                />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">فاطمة محمد</h4>
              <div className="space-y-1">
                <DailyDigestItem
                  icon={<CheckCircle size={16} className="text-emerald-600" />}
                  text="حضور جميع الحصص"
                  time="08:30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}


