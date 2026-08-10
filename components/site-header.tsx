'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart/cart-context'

export function SiteHeader() {
  const { count, openCart } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Logo size="md" withGlobal />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            ['Lighters', '/#lighters'],
            ['Grinders', '/#grinders'],
            ['Ashtrays', '/#ashtrays'],
            ['Papers', '/#rolling-papers'],
            ['Storage', '/#storage-jars'],
          ].map(([item, href]) => (
            <Link
              key={item}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="relative inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-background transition-transform hover:-translate-y-0.5"
          aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">
            Cart ({count})
          </span>
        </button>
      </div>
    </header>
  )
}
