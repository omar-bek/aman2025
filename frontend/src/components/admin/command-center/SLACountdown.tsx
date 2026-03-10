import { Clock, AlertCircle, CheckCircle2, User } from 'lucide-react'
import StatusIndicator from './StatusIndicator'

interface SLACountdownProps {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  timeRemaining: number // minutes
  assignedTo: string
  status: 'pending' | 'in-progress' | 'resolved'
}

export default function SLACountdown({
  title,
  priority,
  timeRemaining,
  assignedTo,
  status,
}: SLACountdownProps) {
  const hours = Math.floor(timeRemaining / 60)
  const minutes = timeRemaining % 60
  const isUrgent = timeRemaining < 60
  const isWarning = timeRemaining < 120 && timeRemaining >= 60

  const priorityColors = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-amber-50 border-amber-200',
    low: 'bg-blue-50 border-blue-200',
  }

  const priorityLabels = {
    high: 'عالي',
    medium: 'متوسط',
    low: 'منخفض',
  }

  const statusLabels = {
    pending: 'في الانتظار',
    'in-progress': 'قيد المعالجة',
    resolved: 'تم الحل',
  }

  return (
    <div
      className={`
        rounded-card p-4 border-2 transition-all
        ${priorityColors[priority]}
        ${isUrgent ? 'ring-2 ring-red-300' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock
              className={`w-4 h-4 ${
                isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-600'
              }`}
            />
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${
                  priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : priority === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }
              `}
            >
              {priorityLabels[priority]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{assignedTo}</span>
            </div>
            <StatusIndicator
              status={status === 'resolved' ? 'safe' : status === 'in-progress' ? 'info' : 'warning'}
              label={statusLabels[status]}
              showIcon
            />
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`
                text-lg font-bold
                ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-700'}
              `}
            >
              {hours > 0 ? `${hours}س ` : ''}
              {minutes}د
            </div>
            <span className="text-xs text-gray-500">متبقي</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-24 flex-shrink-0">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className={`
                h-2 rounded-full transition-all
                ${
                  isUrgent
                    ? 'bg-red-500'
                    : isWarning
                    ? 'bg-amber-500'
                    : 'bg-teal-500'
                }
              `}
              style={{
                width: `${Math.min(100, (timeRemaining / 240) * 100)}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center">SLA</div>
        </div>
      </div>
    </div>
  )
}


