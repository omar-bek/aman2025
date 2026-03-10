import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Heart, AlertTriangle, Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { StatusBadge } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function ConcernDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock concern data - replace with API call
  const concern = {
    id: id || '1',
    type: 'Health Concern',
    typeIcon: <Heart size={24} className="text-teal-600" />,
    childName: 'أحمد علي',
    description: 'Noticed unusual behavior during lunch break. Would like to discuss with teacher about the child\'s recent changes in behavior and activity levels.',
    status: 'in-progress' as 'new' | 'in-progress' | 'resolved' | 'closed',
    progress: 60,
    submittedAt: '2025-01-08 09:00 AM',
    lastUpdate: '2 hours ago',
    priority: 'medium' as const,
    category: 'health',
    updates: [
      {
        id: '1',
        timestamp: '2025-01-08 09:00 AM',
        message: 'تم إرسال القلق بنجاح',
        author: 'أنت',
      },
      {
        id: '2',
        timestamp: '2025-01-08 10:30 AM',
        message: 'تم استلام القلق وتم تعيينه للمراجعة',
        author: 'إدارة المدرسة',
      },
      {
        id: '3',
        timestamp: '2025-01-08 11:00 AM',
        message: 'قيد المعالجة - تم التواصل مع المعلم',
        author: 'إدارة المدرسة',
      },
    ],
  }

  const getStatusConfig = () => {
    switch (concern.status) {
      case 'new':
        return {
          border: 'border-status-info',
          bg: 'bg-status-infoBg',
          badge: (
            <StatusBadge
              status="informational"
              icon={<Clock size={14} />}
              text="قيد المراجعة"
              textEn="Under review"
            />
          ),
        }
      case 'in-progress':
        return {
          border: 'border-teal-400',
          bg: 'bg-teal-50',
          badge: (
            <StatusBadge
              status="safe"
              icon={<AlertTriangle size={14} />}
              text="قيد المعالجة"
              textEn="Being addressed"
            />
          ),
        }
      case 'resolved':
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-50',
          badge: (
            <StatusBadge
              status="safe"
              icon={<CheckCircle size={14} />}
              text="تم الحل"
              textEn="Resolved"
            />
          ),
        }
      case 'closed':
        return {
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          badge: (
            <StatusBadge
              status="informational"
              icon={<Shield size={14} />}
              text="مغلق"
              textEn="Closed"
            />
          ),
        }
      default:
        return {
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          badge: null,
        }
    }
  }

  const getProgressSteps = () => {
    const steps = [
      { id: 1, label: 'تم الإرسال', completed: true },
      { id: 2, label: 'قيد المراجعة', completed: concern.status !== 'new' },
      { id: 3, label: 'قيد المعالجة', completed: concern.status === 'in-progress' || concern.status === 'resolved' || concern.status === 'closed' },
      { id: 4, label: 'تم الحل', completed: concern.status === 'resolved' || concern.status === 'closed' },
    ]
    return steps
  }

  const config = getStatusConfig()
  const steps = getProgressSteps()

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent/concerns')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">تفاصيل القلق</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Concern Card */}
        <div className={`bg-white rounded-card-lg shadow-card border-2 ${config.border} overflow-hidden`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  {concern.typeIcon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{concern.type}</h2>
                  <p className="text-sm text-gray-600">{concern.childName}</p>
                </div>
              </div>
              {config.badge}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">الوصف</label>
              <p className="text-sm text-gray-700 leading-relaxed">{concern.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">تاريخ الإرسال</label>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{concern.submittedAt}</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">آخر تحديث</label>
                <p className="text-sm font-medium text-gray-900">{concern.lastUpdate}</p>
              </div>
            </div>

            {/* Progress Indicator */}
            {concern.status === 'in-progress' && concern.progress !== undefined && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>التقدم</span>
                  <span>{concern.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${concern.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">مراحل المعالجة</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center mt-1">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      step.completed
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-1 ${
                        step.completed ? 'bg-teal-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`text-sm font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Updates Timeline */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={20} className="text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">التحديثات</h3>
          </div>
          <div className="space-y-4">
            {concern.updates.map((update, index) => (
              <div key={update.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  {index < concern.updates.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{update.author}</p>
                    <span className="text-xs text-gray-500">{update.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{update.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button (if not resolved) */}
        {concern.status !== 'resolved' && concern.status !== 'closed' && (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <button className="w-full px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-card font-medium transition-colors border-2 border-teal-200">
              إضافة تعليق
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}

