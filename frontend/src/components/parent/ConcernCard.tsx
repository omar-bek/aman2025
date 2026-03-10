import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface ConcernCardProps {
  id: string
  type: string
  typeIcon?: ReactNode
  childName: string
  description: string
  status: 'new' | 'in-progress' | 'resolved' | 'closed'
  progress?: number
  lastUpdate: string
  onViewDetails?: () => void
}

export default function ConcernCard({
  id,
  type,
  typeIcon,
  childName,
  description,
  status,
  progress,
  lastUpdate,
  onViewDetails,
}: ConcernCardProps) {
  const getStatusConfig = () => {
    switch (status) {
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
              icon={<AlertCircle size={14} />}
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
    }
  }

  const getProgressSteps = () => {
    const steps = ['تم الإرسال', 'قيد المراجعة', 'قيد المعالجة', 'تم الحل']
    const currentStep = status === 'new' ? 1 : status === 'in-progress' ? 3 : status === 'resolved' ? 4 : 4
    return { steps, currentStep }
  }

  const config = getStatusConfig()
  const { steps, currentStep } = getProgressSteps()

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

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{description}</p>

        {/* Progress Indicator */}
        {status === 'in-progress' && progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>التقدم</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Progress Steps */}
        {status !== 'closed' && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div
                    className={`flex-1 h-1 rounded-full ${
                      index + 1 <= currentStep ? 'bg-teal-500' : 'bg-gray-200'
                    }`}
                  />
                  {index < steps.length - 1 && (
                    <div
                      className={`w-2 h-2 rounded-full mx-1 ${
                        index + 1 < currentStep
                          ? 'bg-teal-500'
                          : index + 1 === currentStep
                          ? 'bg-teal-500 animate-pulse'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>الخطوة {currentStep} من {steps.length}</span>
            </div>
          </div>
        )}

        {/* Last Update */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Clock size={12} />
          <span>آخر تحديث: {lastUpdate}</span>
        </div>

        {/* Action */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-card font-medium transition-colors"
          >
            عرض التفاصيل
          </button>
        )}
      </div>
    </div>
  )
}


