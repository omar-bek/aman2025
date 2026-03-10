import { ReactNode } from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import SLAProgressBar from './SLAProgressBar'

interface RequestCardProps {
  id: string
  type: string
  typeIcon?: ReactNode
  childName: string
  details: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  slaHoursRemaining?: number
  slaTotalHours?: number
  submittedAt: string
  onApprove?: () => void
  onReject?: () => void
  onViewDetails?: () => void
}

export default function RequestCard({
  id,
  type,
  typeIcon,
  childName,
  details,
  status,
  slaHoursRemaining,
  slaTotalHours,
  submittedAt,
  onApprove,
  onReject,
  onViewDetails,
}: RequestCardProps) {
  const getStatusConfig = () => {
    switch (status) {
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
      case 'expired':
        return {
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          badge: (
            <StatusBadge
              status="informational"
              icon={<AlertCircle size={14} />}
              text="منتهي الصلاحية"
              textEn="Expired"
            />
          ),
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={`bg-white rounded-card-lg shadow-card border-2 ${config.border} overflow-hidden transition-all duration-300`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {typeIcon && (
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                {typeIcon}
              </div>
            )}
            <div>
              <h4 className="font-bold text-gray-900">{type}</h4>
              <p className="text-sm text-gray-600">{childName}</p>
            </div>
          </div>
          {config.badge}
        </div>

        {/* Details */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{details}</p>

        {/* SLA Timer (if pending) */}
        {status === 'pending' && slaHoursRemaining !== undefined && slaTotalHours && (
          <div className="mb-4">
            <SLAProgressBar
              hoursRemaining={slaHoursRemaining}
              totalHours={slaTotalHours}
            />
          </div>
        )}

        {/* Submitted At */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Clock size={12} />
          <span>تم الإرسال: {submittedAt}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === 'pending' && onApprove && (
            <>
              <button
                onClick={onApprove}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-card font-medium hover:bg-emerald-600 transition-colors"
              >
                موافقة
              </button>
              {onReject && (
                <button
                  onClick={onReject}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-card font-medium hover:bg-gray-300 transition-colors"
                >
                  رفض
                </button>
              )}
            </>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-card font-medium transition-colors"
            >
              عرض التفاصيل
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


