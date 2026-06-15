import { Link } from "wouter";
import { ArrowRight, ChevronRight, Shield, Activity, BarChart4, GlobeLock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Dantès Logo" className="h-8 w-8" />
            <span className="font-serif text-xl font-bold tracking-tight text-white">Dantès</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="inline-flex h-9 items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Initialize
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-mono text-primary mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            SECURE TERMINAL ACTIVE
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
            Your Private Wealth <br />
            <span className="text-primary italic">Command Center</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Dantès is the uncompromising financial operating system for individuals who treat their capital with institutional rigor. Precision engineered. Immaculately detailed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 w-full sm:w-auto gap-2">
              Deploy Terminal <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="inline-flex h-12 items-center justify-center rounded-sm border border-border bg-secondary/30 px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-secondary hover:text-white w-full sm:w-auto">
              Access Existing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Ticker Marquee */}
      <div className="border-y border-border/50 bg-secondary/20 py-4 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-flex items-center gap-12 font-mono text-sm text-muted-foreground px-6">
          <span className="flex gap-2"><span className="text-primary">SYS</span> OPERATIONAL</span>
          <span className="flex gap-2"><span className="text-primary">LAT</span> 12ms</span>
          <span className="flex gap-2"><span className="text-primary">ENC</span> AES-256-GCM</span>
          <span className="flex gap-2"><span className="text-primary">NET</span> SECURE</span>
          <span className="flex gap-2"><span className="text-primary">SYS</span> OPERATIONAL</span>
          <span className="flex gap-2"><span className="text-primary">LAT</span> 12ms</span>
          <span className="flex gap-2"><span className="text-primary">ENC</span> AES-256-GCM</span>
          <span className="flex gap-2"><span className="text-primary">NET</span> SECURE</span>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-20">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Institutional Grade Tools. <br/>Personal Sovereignty.</h2>
            <div className="h-1 w-12 bg-primary"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="h-6 w-6 text-primary" />,
                title: "Live Telemetry",
                desc: "Real-time synchronization across all your global accounts. Watch your net worth update with millisecond precision."
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "Zero-Trust Architecture",
                desc: "Your data is cryptographically isolated. Not even we can see your balances. Complete financial privacy."
              },
              {
                icon: <BarChart4 className="h-6 w-6 text-primary" />,
                title: "Advanced Analytics",
                desc: "Institutional-grade charting and forecasting. Don't just track where your money went—predict where it will be."
              },
              {
                icon: <GlobeLock className="h-6 w-6 text-primary" />,
                title: "Global Context",
                desc: "Multi-currency support with real-time FX rates. Your wealth evaluated in the context of the global macro environment."
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Historical Immutability",
                desc: "An immutable ledger of every transaction you've ever made. Search across decades in milliseconds."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-border/50 bg-card/50 backdrop-blur-sm rounded-sm hover:border-primary/50 transition-colors group">
                <div className="mb-6 p-3 bg-secondary/50 rounded-sm inline-block group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/30 pt-16 pb-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Dantès Logo" className="h-6 w-6" />
                <span className="font-serif text-lg font-bold tracking-tight text-white">Dantès</span>
              </div>
              <p className="text-muted-foreground max-w-sm text-sm">
                The premium financial command center. Designed for precision, engineered for privacy.
              </p>
            </div>
            <div className="flex gap-16">
              <div>
                <h4 className="font-bold text-white mb-4">Platform</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/sign-in" className="hover:text-primary transition-colors">Sign In</Link></li>
                  <li><Link href="/sign-up" className="hover:text-primary transition-colors">Initialize</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Privacy Protocol</span></li>
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
            <p>© {new Date().getFullYear()} Dantès Financial Systems. All rights reserved.</p>
            <p>v1.0.0-SECURE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
