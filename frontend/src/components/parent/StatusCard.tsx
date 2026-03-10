import { ReactNode } from 'react'
import { Shield, CheckCircle, AlertCircle, MapPin, Heart, Activity, Battery, Phone, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

interface StatusIndicator {
  type: 'location' | 'health' | 'activity'
  label: string
  value: string
  status: 'ok' | 'warning' | 'unknown'
  icon?: ReactNode
}

interface StatusCardProps {
  childId: number
  childName: string
  status: 'safe' | 'informational' | 'action-required'
  lastUpdate: string
  indicators: StatusIndicator[]
  battery?: number
  alert?: string
  onViewDetails?: () => void
  onContactSchool?: () => void
}

export default function StatusCard({
  childId,
  childName,
  status,
  lastUpdate,
  indicators,
  battery,
  alert,
  onViewDetails,
  onContactSchool,
}: StatusCardProps) {
  const navigate = useNavigate()

  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return {
          border: 'border-emerald-400',
          shadow: 'shadow-emerald-200/50',
          icon: Shield,
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          text: 'آمن',
          textEn: 'Safe',
        }
      case 'informational':
        return {
          border: 'border-status-info',
          shadow: 'shadow-yellow-200/50',
          icon: AlertCircle,
          iconColor: 'text-status-info',
          bgColor: 'bg-status-infoBg',
          text: 'يرجى الملاحظة',
          textEn: 'Please Note',
        }
      case 'action-required':
        return {
          border: 'border-status-action',
          shadow: 'shadow-red-200/50',
          icon: AlertCircle,
          iconColor: 'text-status-action',
          bgColor: 'bg-status-actionBg',
          text: 'إجراء مطلوب',
          textEn: 'Action Needed',
        }
    }
  }

  const getIndicatorIcon = (type: string) => {
    switch (type) {
      case 'location':
        return MapPin
      case 'health':
        return Heart
      case 'activity':
        return Activity
      default:
        return Activity
    }
  }

  const getIndicatorColor = (indicatorStatus: string) => {
    switch (indicatorStatus) {
      case 'ok':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: 'text-emerald-600',
        }
      case 'warning':
        return {
          bg: 'bg-status-infoBg',
          border: 'border-status-info',
          icon: 'text-status-info',
        }
      case 'unknown':
        return {
          bg: 'bg-status-actionBg',
          border: 'border-status-action',
          icon: 'text-status-action',
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  const safeChildName =
    typeof childName === 'string'
      ? childName
      : childName !== undefined && childName !== null
        ? String(childName)
        : ''

  const initials = safeChildName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const safeIndicators = Array.isArray(indicators) ? indicators : []

  return (
    <div
      className={`bg-white rounded-card-lg shadow-card border-2 ${config.border} ${config.shadow} overflow-hidden transition-all duration-300`}
    >
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-br from-white to-sand-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-card-lg flex items-center justify-center shadow-lg ${
                status === 'safe'
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                  : status === 'informational'
                  ? 'bg-gradient-to-br from-status-info to-yellow-600'
                  : 'bg-gradient-to-br from-status-action to-red-600'
              }`}
            >
              <span className="text-white font-bold text-lg">{initials}</span>
            </div>

            {/* Name and Status */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{childName}</h3>
              <StatusBadge
                status={status}
                icon={<StatusIcon size={14} />}
                text={config.text}
                textEn={config.textEn}
              />
            </div>
          </div>

          {/* Battery Indicator */}
          {battery !== undefined && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 ${
                battery < 20
                  ? 'text-status-action'
                  : battery < 50
                  ? 'text-status-info'
                  : 'text-emerald-600'
              }`}
            >
              <Battery size={20} />
              <span className="text-sm font-bold">{battery}%</span>
            </div>
          )}
        </div>

        {/* Status Indicators Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {safeIndicators.map((indicator, index) => {
            const IndicatorIcon = getIndicatorIcon(indicator.type)
            const colors = getIndicatorColor(indicator.status)
            return (
              <div
                key={index}
                className={`flex flex-col gap-2 p-3 rounded-xl shadow-soft border ${colors.bg} ${colors.border}`}
              >
                <IndicatorIcon className={colors.icon} size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium mb-1">{indicator.label}</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{indicator.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Alert Banner */}
        {alert && (
          <div
            className={`mb-4 p-3 rounded-xl flex items-center gap-3 shadow-soft border-2 ${
              status === 'action-required'
                ? 'bg-status-actionBg border-status-action'
                : 'bg-status-infoBg border-status-info'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                status === 'action-required'
                  ? 'bg-gradient-to-br from-status-action to-red-600'
                  : 'bg-gradient-to-br from-status-info to-yellow-600'
              }`}
            >
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <p
              className={`text-sm flex-1 font-medium ${
                status === 'action-required' ? 'text-red-900' : 'text-yellow-900'
              }`}
            >
              {alert}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/parent/route/${childId}`)}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-500 text-teal-600 rounded-card font-bold hover:bg-teal-50 transition-all duration-300 shadow-soft hover:shadow-card"
          >
            <Map size={18} />
            <span className="text-sm">عرض المسار</span>
          </button>
          <button
            onClick={onContactSchool}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-card font-bold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-card hover:shadow-elevated"
          >
            <Phone size={18} />
            <span className="text-sm">الاتصال بالمدرسة</span>
          </button>
        </div>

        {/* View Details Link */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full mt-4 text-center text-sm font-medium text-teal-600 hover:text-teal-700 py-2 rounded-lg hover:bg-teal-50 transition-colors"
          >
            اضغط لعرض التفاصيل &gt;
          </button>
        )}

        {/* Last Update */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          آخر تحديث: {lastUpdate}
        </p>
      </div>
    </div>
  )
}


