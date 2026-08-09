import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan',
        className,
      )}
    >
      <span className="h-px w-6 bg-cyan" />
      {children}
    </div>
  )
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card transition-colors',
        className,
      )}
    >
      {children}
    </div>
  )
}
