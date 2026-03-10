import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

interface LoadingStateProps {
  message?: string
  inline?: boolean
  icon?: ReactNode
}

export function LoadingState({
  message = 'جاري التحميل...',
  inline,
  icon,
}: LoadingStateProps) {
  const spinner = icon ?? (
    <div
      className="inline-block h-10 w-10 rounded-full border-2 border-b-0 border-primary-200 border-t-primary-600 animate-spin"
      aria-hidden="true"
    />
  )

  if (inline) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6" aria-busy="true">
        {spinner}
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    )
  }

  return (
    <Card className="text-center py-10" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        {spinner}
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </Card>
  )
}

