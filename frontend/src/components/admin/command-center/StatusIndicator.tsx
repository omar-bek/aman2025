import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'

interface StatusIndicatorProps {
  status: 'safe' | 'warning' | 'info' | 'action' | 'error'
  label: string
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export default function StatusIndicator({
  status,
  label,
  showIcon = false,
  size = 'sm',
}: StatusIndicatorProps) {
  const statusConfig = {
    safe: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    action: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full
        ${config.bg} ${config.text} ${config.border} border
        text-xs font-medium
      `}
      role="status"
      aria-label={label}
    >
      {showIcon && <Icon className={`${iconSize} ${config.iconColor}`} />}
      <span>{label}</span>
    </span>
  )
}


