import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
}

export function EmptyState({
  title = 'لا توجد بيانات',
  description = 'لا توجد عناصر لعرضها في الوقت الحالي.',
  icon,
}: EmptyStateProps) {
  return (
    <Card className="text-center py-10">
      <div className="flex flex-col items-center gap-4">
        {icon && <div className="text-gray-300">{icon}</div>}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

