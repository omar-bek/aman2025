import type { ReactNode } from 'react'
import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface ErrorStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'تعذر تحميل البيانات',
  description = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  icon,
  onRetry,
  retryLabel = 'إعادة المحاولة',
}: ErrorStateProps) {
  return (
    <Card className="text-center py-10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
          {icon ?? <AlertTriangle className="text-red-500" size={32} aria-hidden="true" />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            aria-label={retryLabel}
            leftIcon={<RotateCw size={16} aria-hidden="true" />}
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}

