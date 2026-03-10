import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface NationalKPICardProps {
  title: string
  titleEn: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: LucideIcon
  color?: 'emerald' | 'teal' | 'neutral'
  onClick?: () => void
  subtitle?: string
}

export default function NationalKPICard({
  title,
  titleEn,
  value,
  trend = 'neutral',
  trendValue,
  icon: Icon,
  color = 'emerald',
  onClick,
  subtitle,
}: NationalKPICardProps) {
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
    neutral: {
      bg: 'bg-sand-100',
      icon: 'bg-gray-500',
      border: 'border-gray-200',
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
        bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg
        hover:shadow-xl transition-all text-right w-full
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
      `}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color].icon} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="text-base font-semibold text-gray-700 mb-1">{title}</div>
      <div className="text-sm text-gray-500">{titleEn}</div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-2">{subtitle}</div>
      )}
    </button>
  )
}

