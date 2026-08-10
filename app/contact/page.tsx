import type { Metadata } from 'next'
import { MessageCircle, Facebook, MapPin, Building2, Truck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SectionLabel } from '@/components/site/primitives'
import { SHIPPING_OPTIONS, formatBaht, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Contact & Shipping — Stash Pro Global',
  description:
    'Contact Stash-Pro (Thailand) Co., Ltd. and view shipping options, rates, and delivery times.',
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <SectionLabel>Contact &amp; Shipping</SectionLabel>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Get in touch.
          </h1>

          {/* Company details */}
          <div className="mt-10 space-y-5 rounded-lg border border-border bg-card p-6">
            <Detail icon={Building2} label="Registered name">
              Stash-Pro (Thailand) Co., Ltd.
            </Detail>
            <Detail icon={MessageCircle} label="LINE ID">
              kushstashpro
            </Detail>
            <Detail icon={MapPin} label="Address">
              59/8 Moo 8, Tha Sai, Mueang Samut Sakhon, Samut Sakhon 74000
            </Detail>
            <Detail icon={Facebook} label="Social media">
              Stash-Pro Thailand (Facebook)
            </Detail>
          </div>

          {/* Shipping */}
          <div className="mt-12">
            <div className="flex items-center gap-2 text-cyan">
              <Truck className="h-4 w-4" />
              <h2 className="font-mono text-xs uppercase tracking-[0.18em]">
                Shipping options &amp; rates
              </h2>
            </div>
            <div className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
              {SHIPPING_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.detail}</p>
                  </div>
                  <span className="font-mono text-sm tabular-nums">
                    {formatBaht(opt.price)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Free standard (Thailand Post) shipping on orders over{' '}
              {formatBaht(FREE_SHIPPING_THRESHOLD)}. All prices include 7% Thai
              VAT. Orders are dispatched from Samut Sakhon, Thailand.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-cyan">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium leading-relaxed">{children}</p>
      </div>
    </div>
  )
}
