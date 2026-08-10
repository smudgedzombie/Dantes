'use client'

import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { formatBaht } from '@/lib/pricing'

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, vat, remove, setQty } = useCart()

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-cyan" />
            <span className="font-mono text-xs uppercase tracking-[0.18em]">
              Your Cart
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <button
              type="button"
              onClick={closeCart}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan hover:underline"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.name} className="flex gap-4 py-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-card">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="h-full w-full object-contain p-1.5 mix-blend-multiply"
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium leading-snug text-balance">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remove(item.name)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {formatBaht(item.price)}
                    </span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          type="button"
                          onClick={() => setQty(item.name, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.name, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-semibold tabular-nums">
                        {formatBaht(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{formatBaht(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>VAT (7%)</dt>
                  <dd className="tabular-nums">{formatBaht(vat)}</dd>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <dt>Shipping</dt>
                  <dd>Calculated at checkout</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-background transition-transform hover:-translate-y-0.5"
              >
                Checkout &middot; {formatBaht(subtotal + vat)}
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
