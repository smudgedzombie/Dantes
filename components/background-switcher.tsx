'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = {
  id: string
  label: string
  /* page background */
  background: string
  /* card / product tile tint (product photos blend into this via multiply) */
  frost: string
  /* contrasting text + supporting tokens */
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  isDark: boolean
}

// All tiles use mix-blend-multiply, so white product backgrounds dissolve into
// whatever page color is selected. Text tokens flip for contrast per theme.
const themes: Theme[] = [
  {
    id: 'frost',
    label: 'Frost',
    background: 'oklch(0.984 0.006 220)',
    frost: 'oklch(0.97 0.012 215)',
    foreground: 'oklch(0.24 0.02 245)',
    muted: 'oklch(0.955 0.008 220)',
    mutedForeground: 'oklch(0.52 0.02 240)',
    border: 'oklch(0.9 0.012 220)',
    isDark: false,
  },
  {
    id: 'paper',
    label: 'Paper',
    background: 'oklch(0.995 0.002 250)',
    frost: 'oklch(0.975 0.004 250)',
    foreground: 'oklch(0.22 0.015 260)',
    muted: 'oklch(0.96 0.004 250)',
    mutedForeground: 'oklch(0.5 0.015 260)',
    border: 'oklch(0.9 0.006 250)',
    isDark: false,
  },
  {
    id: 'ice',
    label: 'Ice',
    background: 'oklch(0.955 0.03 220)',
    frost: 'oklch(0.93 0.035 218)',
    foreground: 'oklch(0.28 0.05 245)',
    muted: 'oklch(0.92 0.03 220)',
    mutedForeground: 'oklch(0.46 0.05 240)',
    border: 'oklch(0.87 0.04 220)',
    isDark: false,
  },
  {
    id: 'mint',
    label: 'Mint',
    background: 'oklch(0.955 0.035 165)',
    frost: 'oklch(0.93 0.04 165)',
    foreground: 'oklch(0.28 0.05 165)',
    muted: 'oklch(0.92 0.035 165)',
    mutedForeground: 'oklch(0.44 0.05 165)',
    border: 'oklch(0.87 0.045 165)',
    isDark: false,
  },
  {
    id: 'sand',
    label: 'Sand',
    background: 'oklch(0.955 0.028 85)',
    frost: 'oklch(0.93 0.032 82)',
    foreground: 'oklch(0.3 0.04 60)',
    muted: 'oklch(0.92 0.03 85)',
    mutedForeground: 'oklch(0.48 0.04 60)',
    border: 'oklch(0.88 0.035 82)',
    isDark: false,
  },
  {
    id: 'graphite',
    label: 'Graphite',
    background: 'oklch(0.24 0.02 240)',
    frost: 'oklch(0.29 0.025 240)',
    foreground: 'oklch(0.96 0.008 220)',
    muted: 'oklch(0.32 0.025 240)',
    mutedForeground: 'oklch(0.72 0.02 225)',
    border: 'oklch(0.4 0.025 240)',
    isDark: true,
  },
]

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--background', theme.background)
  root.style.setProperty('--frost', theme.frost)
  root.style.setProperty('--foreground', theme.foreground)
  root.style.setProperty('--card', theme.frost)
  root.style.setProperty('--card-foreground', theme.foreground)
  root.style.setProperty('--popover', theme.frost)
  root.style.setProperty('--popover-foreground', theme.foreground)
  root.style.setProperty('--muted', theme.muted)
  root.style.setProperty('--muted-foreground', theme.mutedForeground)
  root.style.setProperty('--secondary', theme.muted)
  root.style.setProperty('--secondary-foreground', theme.foreground)
  root.style.setProperty('--border', theme.border)
  root.style.setProperty('--input', theme.border)
  root.style.setProperty('color-scheme', theme.isDark ? 'dark' : 'light')
}

export function BackgroundSwitcher() {
  const [active, setActive] = useState('frost')

  useEffect(() => {
    const theme = themes.find((t) => t.id === active)
    if (theme) applyTheme(theme)
  }, [active])

  return (
    <div className="flex items-center gap-3">
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
        Theme
      </span>
      <div className="flex items-center gap-1.5">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => setActive(theme.id)}
            aria-label={`Set ${theme.label} background`}
            aria-pressed={active === theme.id}
            title={theme.label}
            className={cn(
              'relative flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-inset transition-transform hover:scale-110',
              active === theme.id ? 'ring-primary' : 'ring-border',
            )}
            style={{ backgroundColor: theme.background }}
          >
            {active === theme.id && (
              <Check
                className="h-3 w-3"
                style={{ color: theme.foreground }}
                strokeWidth={3}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
