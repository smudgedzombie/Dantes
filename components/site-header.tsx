import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-mono text-sm font-bold">S</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Stash Pro</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Global
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            ['Lighters', '#lighters'],
            ['Grinders', '#grinders'],
            ['Ashtrays', '#ashtrays'],
            ['Papers', '#rolling-papers'],
            ['Storage', '#storage-jars'],
          ].map(([item, href]) => (
            <a
              key={item}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        <Button size="sm" className="gap-2 rounded-full">
          <ShoppingBag className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Cart (0)</span>
        </Button>
      </div>
    </header>
  )
}
