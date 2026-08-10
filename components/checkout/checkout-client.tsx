'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, CreditCard, Landmark, Banknote, MessageCircle } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import {
  SHIPPING_OPTIONS,
  FREE_SHIPPING_THRESHOLD,
  formatBaht,
  THB_VAT_RATE,
} from '@/lib/pricing'
import { SectionLabel } from '@/components/site/primitives'
import { Logo } from '@/components/logo'

const PAYMENT_METHODS = [
  { id: 'linepay', label: 'LINE Pay', detail: 'Pay via LINE — @kushstashpro', icon: MessageCircle },
  { id: 'transfer', label: 'Bank Transfer', detail: 'PromptPay / bank transfer, verified before dispatch', icon: Landmark },
  { id: 'card', label: 'Credit / Debit Card', detail: 'Visa, Mastercard, JCB', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', detail: 'Pay the courier on arrival (Thailand only)', icon: Banknote },
] as const

export function CheckoutClient() {
  const { items, subtotal, vat, clear } = useCart()
  const [shippingId, setShippingId] = useState(SHIPPING_OPTIONS[1].id)
  const [paymentId, setPaymentId] = useState<string>(PAYMENT_METHODS[0].id)
  const [placed, setPlaced] = useState<string | null>(null)

  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId)!

  const shippingCost = useMemo(() => {
    if (
      selectedShipping.id === 'standard' &&
      subtotal >= FREE_SHIPPING_THRESHOLD
    ) {
      return 0
    }
    return selectedShipping.price
  }, [selectedShipping, subtotal])

  const grandTotal = subtotal + vat + shippingCost

  function placeOrder(e: React.FormEvent) {
    e.preventDefault()
    const orderNo =
      'SPG-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setPlaced(orderNo)
    clear()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-primary-foreground">
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Order confirmed
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for shopping with <Logo size="sm" />. Your order reference is
        </p>
        <p className="mt-2 font-mono text-lg tracking-[0.15em] text-cyan">
          {placed}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A confirmation with payment and shipping details will be sent shortly.
          For bank transfer and LINE Pay orders, we&apos;ll message you the
          payment details on LINE (@kushstashpro).
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-background transition-transform hover:-translate-y-0.5"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add a few essentials before checking out.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-background transition-transform hover:-translate-y-0.5"
        >
          Browse the range
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={placeOrder}
      className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]"
    >
      {/* Left: details */}
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Shipping from Samut Sakhon, Thailand. Prices include 7% Thai VAT.
          </p>
        </div>

        {/* Contact + address */}
        <section className="space-y-4">
          <SectionLabel>Contact &amp; Shipping</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Phone" name="phone" type="tel" required />
            <Field label="Email" name="email" type="email" className="sm:col-span-2" required />
            <Field label="Address" name="address" className="sm:col-span-2" required />
            <Field label="District / City" name="city" required />
            <Field label="Province" name="province" required />
            <Field label="Postal code" name="postal" required />
            <Field label="Country" name="country" defaultValue="Thailand" required />
          </div>
        </section>

        {/* Shipping method */}
        <section className="space-y-4">
          <SectionLabel>Shipping Method</SectionLabel>
          <div className="space-y-2.5">
            {SHIPPING_OPTIONS.map((opt) => {
              const isFree =
                opt.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD
              return (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${
                    shippingId === opt.id
                      ? 'border-cyan bg-cyan/5'
                      : 'border-border hover:border-cyan/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shippingId === opt.id}
                      onChange={() => setShippingId(opt.id)}
                      className="h-4 w-4 accent-cyan"
                    />
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.detail}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm tabular-nums">
                    {isFree ? 'FREE' : formatBaht(opt.price)}
                  </span>
                </label>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Free standard shipping on orders over{' '}
            {formatBaht(FREE_SHIPPING_THRESHOLD)}.
          </p>
        </section>

        {/* Payment method */}
        <section className="space-y-4">
          <SectionLabel>Payment</SectionLabel>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon
              return (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    paymentId === m.id
                      ? 'border-cyan bg-cyan/5'
                      : 'border-border hover:border-cyan/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentId === m.id}
                    onChange={() => setPaymentId(m.id)}
                    className="mt-0.5 h-4 w-4 accent-cyan"
                  />
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <Icon className="h-3.5 w-3.5 text-cyan" />
                      {m.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {m.detail}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        </section>
      </div>

      {/* Right: order summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Order Summary
          </h2>
          <ul className="mt-4 space-y-3 border-b border-border pb-4">
            {items.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-card">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="h-full w-full object-contain p-1 mix-blend-multiply"
                    />
                  ) : null}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] text-background">
                    {item.qty}
                  </span>
                </div>
                <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                <span className="font-mono text-sm tabular-nums">
                  {formatBaht(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatBaht(subtotal)} />
            <Row
              label={`VAT (${Math.round(THB_VAT_RATE * 100)}%)`}
              value={formatBaht(vat)}
            />
            <Row
              label="Shipping"
              value={shippingCost === 0 ? 'FREE' : formatBaht(shippingCost)}
            />
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Grand total</dt>
              <dd className="font-mono tabular-nums">{formatBaht(grandTotal)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-background transition-transform hover:-translate-y-0.5"
          >
            Place order &middot; {formatBaht(grandTotal)}
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            By placing this order you agree to Stash Pro Global&apos;s terms.
            Taxes and shipping shown are final.
          </p>
        </div>
      </aside>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  className,
  defaultValue,
  required,
}: {
  label: string
  name: string
  type?: string
  className?: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-cyan focus:ring-2 focus:ring-cyan/30"
      />
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="font-mono tabular-nums text-foreground">{value}</dd>
    </div>
  )
}
