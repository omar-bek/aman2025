import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
}

export function Card({ children, className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-lg rtl:text-right',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

