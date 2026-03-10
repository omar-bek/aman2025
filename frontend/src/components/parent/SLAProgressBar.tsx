import { Clock } from 'lucide-react'

interface SLAProgressBarProps {
  hoursRemaining: number
  totalHours: number
  label?: string
}

export default function SLAProgressBar({
  hoursRemaining,
  totalHours,
  label,
}: SLAProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (hoursRemaining / totalHours) * 100))
  const isExpired = hoursRemaining <= 0
  const isUrgent = hoursRemaining < 1

  const defaultLabel = isExpired
    ? 'انتهت المدة المتوقعة'
    : isUrgent
    ? `أقل من ساعة متبقية`
    : `الرد المتوقع خلال ${Math.ceil(hoursRemaining)} ساعة`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={14} />
          <span>{label || defaultLabel}</span>
        </div>
        {!isExpired && (
          <span className="text-teal-600 font-medium">
            {Math.ceil(hoursRemaining)}h
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isExpired
              ? 'bg-gray-400'
              : isUrgent
              ? 'bg-status-action animate-pulse'
              : 'bg-teal-500'
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={defaultLabel}
        />
      </div>
    </div>
  )
}


