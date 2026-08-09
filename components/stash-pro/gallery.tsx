'use client'

import { useState } from 'react'
import {
  Flame,
  Cog,
  CircleDot,
  LayoutGrid,
  ScrollText,
  Cone,
  Wind,
  Package,
  Check,
} from 'lucide-react'
import { STASH_CATEGORIES, STASH_IMAGES } from '@/lib/stash-pro-data'
import { Panel, SectionLabel } from '@/components/site/primitives'

const CATEGORY_ICON: Record<string, typeof Flame> = {
  lighters: Flame,
  grinders: Cog,
  ashtrays: CircleDot,
  'rolling-trays': LayoutGrid,
  'rolling-papers': ScrollText,
  'pre-rolled-cones': Cone,
  sheesha: Wind,
  'storage-jars': Package,
}

export function StashGallery() {
  const [active, setActive] = useState<string>('all')

  const visible =
    active === 'all'
      ? STASH_CATEGORIES
      : STASH_CATEGORIES.filter((c) => c.id === active)

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-16 z-30 -mx-4 border-y border-border bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            active={active === 'all'}
            onClick={() => setActive('all')}
          />
          {STASH_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              count={c.products.length}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Category sections */}
      <div className="mt-12 space-y-16">
        {visible.map((cat) => {
          const Icon = CATEGORY_ICON[cat.id] ?? Package
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <SectionLabel>
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {cat.label}
                </span>
              </SectionLabel>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.products.map((p) => (
                  <Panel key={p.name} className="flex flex-col p-5">
                    {/* Real product photography — white backdrop dissolves into the
                        page tint via mix-blend-multiply on the light frost tile. */}
                    <div className="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border/60 bg-card">
                      {STASH_IMAGES[p.name] ? (
                        <img
                          src={STASH_IMAGES[p.name] || '/placeholder.svg'}
                          alt={p.name}
                          loading="lazy"
                          crossOrigin="anonymous"
                          className="h-full w-full object-contain p-3 mix-blend-multiply"
                        />
                      ) : (
                        <Icon
                          className="h-10 w-10 text-cyan opacity-80"
                          strokeWidth={1.25}
                        />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-foreground text-balance">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                      {p.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                        >
                          <Check
                            className="mt-0.5 h-3 w-3 shrink-0 text-cyan"
                            strokeWidth={2.5}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
        active
          ? 'border-cyan bg-cyan text-primary-foreground'
          : 'border-border text-muted-foreground hover:border-cyan/60 hover:text-cyan'
      }`}
    >
      {label}
      {count != null && (
        <span className={active ? 'opacity-80' : 'opacity-50'}>{count}</span>
      )}
    </button>
  )
}
