import { Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface TodayStatusCardProps {
  status: 'safe' | 'informational' | 'action-required'
  lastUpdate: string
  childrenCount?: number
}

export default function TodayStatusCard({
  status,
  lastUpdate,
  childrenCount = 0,
}: TodayStatusCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return {
          icon: Shield,
          iconColor: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          title: 'جميع الأطفال آمنون',
          titleEn: 'All children safe',
          subtitle: 'آمن ومحسوب',
          subtitleEn: 'Safe and accounted for',
        }
      case 'informational':
        return {
          icon: AlertCircle,
          iconColor: 'text-status-info',
          bg: 'bg-status-infoBg',
          border: 'border-status-info',
          title: 'يرجى الملاحظة',
          titleEn: 'Please note',
          subtitle: 'معلومات إضافية متاحة',
          subtitleEn: 'Additional information available',
        }
      case 'action-required':
        return {
          icon: AlertCircle,
          iconColor: 'text-status-action',
          bg: 'bg-status-actionBg',
          border: 'border-status-action',
          title: 'إجراء مطلوب',
          titleEn: 'Action needed',
          subtitle: 'يرجى مراجعة التفاصيل',
          subtitleEn: 'Please review details',
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <div
      className={`bg-white rounded-card-lg shadow-card border-2 ${config.border} p-6 ${config.bg} min-h-[120px] flex items-center gap-4`}
    >
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        <StatusIcon size={48} />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{config.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{config.subtitle}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} />
          <span>آخر تحديث: {lastUpdate}</span>
        </div>
      </div>
    </div>
  )
}


