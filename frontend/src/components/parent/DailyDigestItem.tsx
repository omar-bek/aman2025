import { ReactNode } from 'react'
import { Clock } from 'lucide-react'

interface DailyDigestItemProps {
  icon: ReactNode
  text: string
  time: string
  priority?: 'high' | 'normal' | 'low'
}

export default function DailyDigestItem({
  icon,
  text,
  time,
  priority = 'normal',
}: DailyDigestItemProps) {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'text-status-action'
      case 'normal':
        return 'text-gray-700'
      case 'low':
        return 'text-gray-500'
    }
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${getPriorityColor()}`}>{text}</p>
        <div className="flex items-center gap-1 mt-1">
          <Clock size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  )
}


