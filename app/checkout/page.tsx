import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CheckoutClient } from '@/components/checkout/checkout-client'

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CheckoutClient />
      </main>
      <SiteFooter />
    </div>
  )
}
