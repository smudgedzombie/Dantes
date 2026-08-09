import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { SiteFooter } from '@/components/site-footer'
import { BackgroundSwitcher } from '@/components/background-switcher'
import { StashGallery } from '@/components/stash-pro/gallery'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-border/60 bg-frost">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Pick your backdrop
          </span>
          <BackgroundSwitcher />
        </div>
      </div>

      <SiteHeader />

      <main className="flex-1">
        <Hero />

        <section id="gallery" className="mx-auto w-full max-w-7xl px-4 pb-24 pt-4 sm:px-6">
          <StashGallery />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
