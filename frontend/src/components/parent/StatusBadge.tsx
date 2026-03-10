import { ReactNode } from 'react'

interface StatusBadgeProps {
  status: 'safe' | 'informational' | 'action-required'
  icon: ReactNode
  text: string
  textEn?: string
  variant?: 'pill' | 'inline'
}

export default function StatusBadge({
  status,
  icon,
  text,
  textEn,
  variant = 'pill',
}: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'safe':
        return {
          bg: 'bg-status-safeBg',
          text: 'text-emerald-700',
          border: 'border-emerald-300',
        }
      case 'informational':
        return {
          bg: 'bg-status-infoBg',
          text: 'text-status-info',
          border: 'border-status-info',
        }
      case 'action-required':
        return {
          bg: 'bg-status-actionBg',
          text: 'text-status-action',
          border: 'border-status-action',
        }
    }
  }

  const styles = getStatusStyles()

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${styles.text}`}>
        {icon}
        <span>{text}</span>
        {textEn && <span className="text-xs opacity-75">({textEn})</span>}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-badge text-xs font-bold shadow-soft border ${styles.bg} ${styles.text} ${styles.border}`}
      role="status"
      aria-label={`${text}${textEn ? ` (${textEn})` : ''}`}
    >
      {icon}
      <span>{text}</span>
      {textEn && <span className="text-xs opacity-75">({textEn})</span>}
    </span>
  )
}


