import { cn } from '@/lib/utils'

/**
 * Brand logo, used everywhere the brand name would otherwise be typed as text.
 * Renders a styled wordmark for now. When the logo image asset is added to
 * /public/brand/, swap the inner <span> block for:
 *   <img src="/brand/stash-pro.png" alt="Stash Pro" className={...} />
 * and nothing else in the app needs to change.
 */

const SIZES = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl md:text-4xl',
} as const

export function Logo({
  size = 'md',
  withGlobal = false,
  className,
}: {
  size?: keyof typeof SIZES
  withGlobal?: boolean
  className?: string
}) {
  return (
    <span
      className={cn('inline-flex items-baseline gap-1.5 align-middle', className)}
      aria-label={withGlobal ? 'Stash Pro Global' : 'Stash Pro'}
    >
      <span
        className={cn(
          'font-semibold lowercase leading-none tracking-tight text-primary',
          SIZES[size],
        )}
      >
        stash
        <span className="text-foreground">-pro</span>
        <sup className="ml-0.5 text-[0.5em] font-normal text-muted-foreground">
          &reg;
        </sup>
      </span>
      {withGlobal && (
        <span className="font-mono text-[0.55em] uppercase tracking-[0.25em] text-muted-foreground">
          Global
        </span>
      )}
    </span>
  )
}
