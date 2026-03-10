import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, UserCheck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { StatusBadge, SLAProgressBar } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock request data - replace with API call
  const request = {
    id: id || '1',
    type: 'Early Pickup',
    typeIcon: <UserCheck size={24} className="text-teal-600" />,
    childName: 'أحمد علي',
    details: 'Request for early pickup at 2:00 PM due to medical appointment. The child needs to leave school early for a scheduled medical checkup.',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    slaHoursRemaining: 1.5,
    slaTotalHours: 4,
    submittedAt: '2025-01-08 10:00 AM',
    requestedDate: '2025-01-08',
    requestedTime: '2:00 PM',
    reason: 'Medical appointment',
    attachments: [],
  }

  const getStatusConfig = () => {
    switch (request.status) {
      case 'pending':
        return {
          border: 'border-status-info',
          bg: 'bg-status-infoBg',
          badge: (
            <StatusBadge
              status="informational"
              icon={<Clock size={14} />}
              text="في انتظار الموافقة"
              textEn="Awaiting approval"
            />
          ),
        }
      case 'approved':
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-50',
          badge: (
            <StatusBadge
              status="safe"
              icon={<CheckCircle size={14} />}
              text="موافق عليه"
              textEn="Approved"
            />
          ),
        }
      case 'rejected':
        return {
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          badge: (
            <StatusBadge
              status="informational"
              icon={<XCircle size={14} />}
              text="غير موافق"
              textEn="Not approved"
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

  const config = getStatusConfig()

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent/requests')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Request Card */}
        <div className={`bg-white rounded-card-lg shadow-card border-2 ${config.border} overflow-hidden`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  {request.typeIcon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{request.type}</h2>
                  <p className="text-sm text-gray-600">{request.childName}</p>
                </div>
              </div>
              {config.badge}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">التفاصيل</label>
                <p className="text-sm text-gray-700">{request.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">التاريخ المطلوب</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{request.requestedDate}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">الوقت المطلوب</label>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{request.requestedTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">السبب</label>
                <p className="text-sm text-gray-700">{request.reason}</p>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">تاريخ الإرسال</label>
                <p className="text-sm text-gray-700">{request.submittedAt}</p>
              </div>

              {/* SLA Timer (if pending) */}
              {request.status === 'pending' && request.slaHoursRemaining !== undefined && (
                <div className="pt-4 border-t border-gray-200">
                  <SLAProgressBar
                    hoursRemaining={request.slaHoursRemaining}
                    totalHours={request.slaTotalHours}
                    label="الرد المتوقع خلال"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions (if pending) */}
        {request.status === 'pending' && (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">الإجراءات</h3>
            <div className="flex items-center gap-2">
              <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-card font-medium hover:bg-emerald-600 transition-colors">
                موافقة
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-card font-medium hover:bg-gray-300 transition-colors">
                رفض
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}

