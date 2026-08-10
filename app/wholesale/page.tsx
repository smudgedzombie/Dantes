import type { Metadata } from 'next'
import { MessageCircle, Share2, Camera } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SectionLabel } from '@/components/site/primitives'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'Wholesale — Stash Pro Global',
  description:
    'Place a wholesale / B2B order with Stash-Pro (Thailand) Co., Ltd. Request the updated wholesale catalog and pricing sheets via LINE, Facebook, or Instagram.',
}

export default function WholesalePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <SectionLabel>Wholesale &amp; B2B</SectionLabel>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Order <Logo size="lg" /> in bulk.
          </h1>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            To place a wholesale order with Stash-Pro (Thailand) Co., Ltd.,
            contact our B2B sales team directly through our primary digital
            channels. Request the updated wholesale product catalog and pricing
            sheets and we&apos;ll get you set up.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ChannelCard
              icon={MessageCircle}
              label="LINE Official Account"
              value="@stashprothailand"
              note="Add the LINE ID (include the @ symbol)."
            />
            <ChannelCard
              icon={Share2}
              label="Facebook Page"
              value="@stashprothailand"
              note="DM the official Stash-Pro Thailand page for catalog & pricing."
            />
            <ChannelCard
              icon={Camera}
              label="Instagram"
              value="@stashprothailand"
              note="DM our official Instagram account for catalog & pricing."
            />
          </div>

          <div className="mt-10 rounded-lg border border-border bg-card p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
              How it works
            </h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {[
                'Reach out on LINE, Facebook, or Instagram (@stashprothailand).',
                'Request the current wholesale catalog and pricing sheet.',
                'Confirm your order quantities and delivery details.',
                'Receive payment instructions and dispatch timeline.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[10px] text-background">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function ChannelCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof MessageCircle
  label: string
  value: string
  note: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-cyan">
        <Icon className="h-4 w-4" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
          {label}
        </span>
      </div>
      <p className="mt-3 text-lg font-semibold">{value}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  )
}
