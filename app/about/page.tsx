import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SectionLabel } from '@/components/site/primitives'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'About — Stash Pro Global',
  description:
    'The story behind Stash Pro Global — a homegrown venture founded in 2016 that grew into an international brand of everyday smoking essentials.',
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
          <SectionLabel>Our Story</SectionLabel>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Built different, driven by passion.
          </h1>

          <div className="mt-8 space-y-5 text-pretty leading-relaxed text-muted-foreground">
            <p>
              Back in 2016, four friends &mdash; Sanil Mehta, Sohel Shah,
              Saurabh Dugad, and Yash Shah &mdash; decided to take a leap.
              Today, those friends are more like brothers, building something
              far greater than just a business.
            </p>
            <p>
              What began as a homegrown venture quickly gained traction beyond
              borders. Thanks to an unwavering focus on quality,{' '}
              <Logo size="sm" /> evolved from a domestic product into a brand
              that has made its mark in international markets. Our lineup of
              daily essentials is practical, reliable, and crafted to meet the
              demands of a global audience.
            </p>
            <p>
              At the heart of the company is a powerhouse team &mdash; 95% of
              whom are women &mdash; driving the brand forward with unmatched
              dedication and precision. We&apos;re not just a company; we&apos;re
              a movement rooted in purpose, quality, and ambition.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              ['2016', 'Founded'],
              ['95%', 'Women-led team'],
              ['Global', 'Markets served'],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="font-mono text-2xl font-semibold tabular-nums">
                  {stat}
                </dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
