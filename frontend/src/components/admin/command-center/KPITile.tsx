import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPITileProps {
  title: string
  titleEn: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: LucideIcon
  color: 'emerald' | 'teal'
  onClick?: () => void
}

export default function KPITile({
  title,
  titleEn,
  value,
  trend = 'neutral',
  trendValue,
  icon: Icon,
  color,
  onClick,
}: KPITileProps) {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    teal: {
      bg: 'bg-teal-50',
      icon: 'bg-teal-500',
      border: 'border-teal-200',
    },
  }

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-teal-600',
    neutral: 'text-gray-600',
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <button
      onClick={onClick}
      className={`
        bg-white rounded-card-lg p-5 border border-gray-200 shadow-card
        hover:shadow-elevated transition-all text-right
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${colorClasses[color].icon} rounded-card flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mb-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{titleEn}</div>
    </button>
  )
}


