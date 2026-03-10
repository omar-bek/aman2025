import { LucideIcon, TrendingUp, AlertCircle, Info } from 'lucide-react'

interface StatisticalInsightCardProps {
  insight: string
  insightEn: string
  type?: 'positive' | 'neutral' | 'attention'
  icon?: LucideIcon
  supportingData?: Record<string, string | number>
}

export default function StatisticalInsightCard({
  insight,
  insightEn,
  type = 'neutral',
  icon: Icon,
  supportingData,
}: StatisticalInsightCardProps) {
  const typeStyles = {
    positive: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
      text: 'text-emerald-900',
    },
    neutral: {
      bg: 'bg-sand-100',
      border: 'border-sand-200',
      icon: 'text-gray-600',
      text: 'text-gray-900',
    },
    attention: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-900',
    },
  }

  const DefaultIcon = type === 'positive' ? TrendingUp : type === 'attention' ? AlertCircle : Info
  const DisplayIcon = Icon || DefaultIcon

  return (
    <div
      className={`
        ${typeStyles[type].bg} ${typeStyles[type].border}
        border-2 rounded-2xl p-4
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`${typeStyles[type].icon} flex-shrink-0 mt-0.5`}>
          <DisplayIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className={`${typeStyles[type].text} font-medium text-sm mb-1`}>{insight}</p>
          <p className="text-gray-600 text-xs">{insightEn}</p>
          {supportingData && Object.keys(supportingData).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(supportingData).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-gray-500">{key}:</span>{' '}
                    <span className="font-semibold text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


