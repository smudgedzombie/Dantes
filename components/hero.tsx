import { ArrowDown } from 'lucide-react'
import { Logo } from '@/components/logo'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* frost gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,var(--frost-deep),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Premium Smoking Accessories
          </span>
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
          Crafted for every session.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          From windproof lighters and precision grinders to glass ashtrays,
          rolling trays, pre-rolled cones, and sheesha essentials &mdash; the
          complete <Logo size="sm" withGlobal /> range, shipped worldwide.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-8">
          <a
            href="#gallery"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-background transition-transform hover:-translate-y-0.5"
          >
            <span className="font-mono text-xs uppercase tracking-[0.15em]">
              Browse the range
            </span>
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>

          <div className="flex items-center gap-8">
            {[
              ['8', 'Categories'],
              ['55+', 'Products'],
              ['100%', 'Refillable-first'],
            ].map(([stat, label]) => (
              <div key={label} className="flex flex-col">
                <span className="font-mono text-xl font-semibold tabular-nums">{stat}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
