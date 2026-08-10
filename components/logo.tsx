import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Brand logo, used everywhere the brand name would otherwise be typed as text.
 * Renders the official stash-pro wordmark (white on brand green). The source
 * asset has tall green padding, so we crop to the wordmark band with
 * object-cover inside a fixed-height rounded chip so it stays legible at any
 * size and on any page background.
 */

const SIZES = {
  sm: { box: 'h-5 w-[64px]', global: 'text-[9px] tracking-[0.22em]' },
  md: { box: 'h-7 w-[90px]', global: 'text-[11px] tracking-[0.24em]' },
  lg: {
    box: 'h-11 w-[150px] md:h-14 md:w-[184px]',
    global: 'text-sm tracking-[0.28em]',
  },
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
  const s = SIZES[size]
  return (
    <span
      className={cn('inline-flex items-center gap-2 align-middle', className)}
      aria-label={withGlobal ? 'Stash Pro Global' : 'Stash Pro'}
    >
      <span
        className={cn(
          'relative inline-block overflow-hidden rounded-md bg-[#1f5c37]',
          s.box,
        )}
      >
        <Image
          src="/brand/stash-pro-logo.png"
          alt="stash-pro"
          fill
          sizes="200px"
          className="object-cover object-center"
          priority
        />
      </span>
      {withGlobal && (
        <span
          className={cn(
            'font-mono font-medium uppercase text-muted-foreground',
            s.global,
          )}
        >
          Global
        </span>
      )}
    </span>
  )
}
