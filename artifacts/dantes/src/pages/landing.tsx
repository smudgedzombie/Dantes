import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { useEffect, useRef, useState } from "react";

const MODULES = [
  { id: "financial", label: "Financial Engine", icon: "◈", desc: "Revenue modeling, P&L, tax compliance, VAT/WHT, payment plans" },
  { id: "marketing", label: "Marketing Command", icon: "◉", desc: "Brand strategy, digital campaigns, events calendar, social velocity" },
  { id: "operations", label: "Operations Core", icon: "◎", desc: "Daily reminders, task automation, SOP management, staff coordination" },
  { id: "compliance", label: "Compliance Shield", icon: "◆", desc: "Tax returns, licenses, regulatory filings, audit-ready documentation" },
  { id: "export_b2b", label: "Export & B2B Gateway", icon: "◇", desc: "Global market entry, B2B portals, online payment gateways, trade finance" },
  { id: "events", label: "Events Accelerator", icon: "✦", desc: "Revenue events, launch campaigns, partnership activations, footfall drives" },
];

const AGENT_PREVIEWS = [
  { code: "GRM01", client: "The Amber Club", industry: "Food & Beverage", status: "active", modules: ["financial", "marketing", "events"] },
  { code: "GRM02", client: "NovaTex Industries", industry: "Manufacturing / Export", status: "active", modules: ["financial", "export_b2b", "compliance"] },
  { code: "GRM03", client: "Meridian Health Group", industry: "Healthcare", status: "standby", modules: ["operations", "compliance", "financial"] },
];

const TYPEWRITER_LINES = [
  "LIVE SMARTER.",
  "LIVE RICHER.",
  "LIVE WITH COMMON SENSE.",
  "LIVE LIKE DANTÈS.",
];

function useTypewriter(lines: string[], speed = 60, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx(i => (i + 1) % lines.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx, lines, speed, pause]);

  return display;
}

function GrahamCard({ agent }: { agent: typeof AGENT_PREVIEWS[0] }) {
  return (
    <div className="border border-[#0d2040] bg-[#040c1a] rounded-sm p-5 hover:border-[#D4AF37]/40 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-xs text-[#D4AF37] mb-1 tracking-widest">{agent.code}</div>
          <div className="text-white font-semibold text-sm">{agent.client}</div>
          <div className="text-[#4a6080] text-xs font-mono mt-0.5">{agent.industry}</div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-mono ${agent.status === "active" ? "bg-[#00ff8815] text-[#00ff88]" : "bg-[#D4AF3715] text-[#D4AF37]"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-[#00ff88] animate-pulse" : "bg-[#D4AF37]"}`} />
          {agent.status.toUpperCase()}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {agent.modules.map(m => {
          const mod = MODULES.find(x => x.id === m);
          return <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-[#0a1628] border border-[#0d2040] text-[#4a8090] rounded-sm group-hover:border-[#D4AF37]/20 transition-colors">{mod?.label ?? m}</span>;
        })}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typed = useTypewriter(TYPEWRITER_LINES);
  const [spotsLeft] = useState(7);
  const [showReel, setShowReel] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const cols = Math.floor((canvas.width || 1280) / 22);
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -80);
    const chars = "GRMDANTÈSBLOOM01234567890∑∞≈◈◎◆▸▹";
    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(3,8,16,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 7 === 0 ? "#D4AF3712" : "#D4AF3706";
        ctx.fillText(char, i * 22, drops[i] * 18);
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.25;
      }
    }
    const interval = setInterval(draw, 55);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="min-h-screen bg-[#030810] text-white relative overflow-x-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.7 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#0d1b35]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Dantès" className="w-10 h-10 object-contain shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-serif font-black text-white tracking-[0.2em] text-lg">DANTÈS</span>
            <span className="text-[9px] font-mono text-[#D4AF37]/50 tracking-[0.35em]">THE BLOOM SOCIETY</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden sm:flex text-[10px] font-mono text-[#00ff88] items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse inline-block" />
            SYSTEM OPERATIONAL
          </span>
          <Link href={isSignedIn ? "/command" : "/sign-in"}
            className="px-5 py-2 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
            {isSignedIn ? "COMMAND CENTER" : "AUTHORIZE ACCESS"}
          </Link>
        </div>
      </nav>

      {/* CINEMATIC HERO */}
      <section className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pb-12">
        {/* Scarcity banner */}
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-red-500/30 bg-red-500/5 rounded-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] font-mono text-red-400 tracking-[0.3em]">Q3 2026 INTAKE — {spotsLeft} SPOTS REMAINING</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        </div>

        <div className="mb-3">
          <span className="text-[9px] font-mono text-[#D4AF37]/60 tracking-[0.4em]">BANGKOK · DUBAI · GLOBAL OPERATORS</span>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif font-black text-white tracking-tight mb-2 leading-none">
          DANTÈS
        </h1>
        <div className="text-[#D4AF37] font-mono text-xs sm:text-sm tracking-[0.45em] mb-6">THE BLOOM SOCIETY — AI COMMAND · FORENSIC FINANCE · SMART LIVING</div>

        {/* Typewriter */}
        <div className="h-10 flex items-center justify-center mb-8">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {typed}<span className="animate-pulse text-[#D4AF37]">|</span>
          </span>
        </div>

        <p className="text-[#3a5570] max-w-2xl mx-auto text-base leading-relaxed mb-6">
          For the Bangkok elite who operate on instinct, data, and ambition — Dantès deploys a custom AI agent called a <span className="text-[#D4AF37] font-mono font-semibold">Graham</span> into your business. It runs 24/7. It never sleeps. It handles everything so you can focus on what you do best: <span className="text-white font-semibold">winning.</span>
        </p>

        {/* BKK Social Proof */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-[10px] font-mono text-[#3a5570]">
          <span className="flex items-center gap-2"><span className="text-[#D4AF37]">◆</span> Bangkok HQ</span>
          <span className="text-[#0d1b35]">|</span>
          <span className="flex items-center gap-2"><span className="text-[#D4AF37]">◆</span> Thai Enterprise Clients</span>
          <span className="text-[#0d1b35]">|</span>
          <span className="flex items-center gap-2"><span className="text-[#D4AF37]">◆</span> LINE OA · WhatsApp Alerts</span>
          <span className="text-[#0d1b35]">|</span>
          <span className="flex items-center gap-2"><span className="text-[#D4AF37]">◆</span> THB · USD · Multi-currency</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/join"
            className="px-8 py-3.5 bg-[#D4AF37] text-[#030810] font-mono font-bold text-sm rounded-sm hover:bg-[#b8952b] transition-all tracking-widest shadow-[0_0_40px_rgba(212,175,55,0.3)]">
            CLAIM YOUR SPOT — APPLY NOW →
          </Link>
          <button onClick={() => setShowReel(true)}
            className="flex items-center gap-2.5 px-8 py-3.5 border border-[#D4AF37]/30 text-white font-mono text-sm rounded-sm hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/5 transition-all tracking-widest">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37]/60 flex items-center justify-center">
              <span className="text-[#D4AF37] text-[8px] ml-0.5">▶</span>
            </span>
            WATCH THE REEL
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[8px] font-mono text-[#2a4060] tracking-widest">SCROLL</span>
          <span className="text-[#2a4060] text-xs">↓</span>
        </div>
      </section>

      {/* Reel Modal */}
      {showReel && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setShowReel(false)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowReel(false)} className="absolute -top-10 right-0 text-[#3a5570] font-mono text-xs hover:text-white transition-colors">✕ CLOSE</button>
            <div className="border border-[#D4AF37]/20 bg-[#040c1a] rounded-sm overflow-hidden aspect-video flex flex-col items-center justify-center relative">
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
              <div className="relative z-10 text-center px-8">
                <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#D4AF37] text-2xl ml-1">▶</span>
                </div>
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-3">COMING SOON</p>
                <h3 className="text-2xl font-serif font-bold text-white mb-3">The Dantès Reel</h3>
                <p className="text-[#3a5570] text-sm leading-relaxed max-w-md mx-auto">
                  A cinematic showcase of what happens when AI meets ambition. In production. Drop your email to be first to see it.
                </p>
                <div className="flex gap-2 mt-6 max-w-xs mx-auto">
                  <input type="email" placeholder="your@email.com" className="flex-1 bg-[#030810] border border-[#0d1b35] rounded-sm px-3 py-2 text-xs font-mono text-white placeholder:text-[#2a4060] focus:outline-none focus:border-[#D4AF37]/50" />
                  <button className="px-4 py-2 bg-[#D4AF37] text-[#030810] font-mono font-bold text-xs rounded-sm hover:bg-[#b8952b] transition-colors">NOTIFY</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="relative z-10 border-y border-[#0d1b35] py-5 px-8 bg-[#030810]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Graham Agents", value: "GRM01–∞", sub: "Infinitely scalable" },
            { label: "Capability Modules", value: "06", sub: "Financial · Marketing · Compliance +" },
            { label: "Backend Access", value: "RESTRICTED", sub: "Bloom Society principals only" },
            { label: "System Status", value: "LIVE", sub: "All nodes nominal · BKK" },
          ].map(s => (
            <div key={s.label}>
              <div className="font-mono text-[#D4AF37] font-bold text-xl mb-0.5">{s.value}</div>
              <div className="text-white text-xs font-medium mb-0.5">{s.label}</div>
              <div className="text-[#2a4060] text-[10px] font-mono">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The Case for Dantès — BKK narrative */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">THE CASE FOR DANTÈS</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Bangkok moves fast.",
              body: "Opportunity in BKK doesn't wait. The people closing the biggest deals aren't working harder — they have smarter leverage. Dantès is that leverage."
            },
            {
              icon: "🧠",
              title: "Common sense, finally automated.",
              body: "Most businesses fail not from lack of talent but from poor execution of obvious things: cash flow, compliance, follow-through. Graham does all of it. Flawlessly."
            },
            {
              icon: "✦",
              title: "The Bloom Society standard.",
              body: "This isn't a subscription. It's membership in a circle of operators who refuse to be average. Your Graham is bespoke. Your edge is real."
            },
          ].map(item => (
            <div key={item.title} className="border border-[#0d1b35] bg-[#040c1a]/60 rounded-sm p-7 hover:border-[#D4AF37]/25 transition-all">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white font-serif font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-[#3a5570] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Grahams preview */}
      <section id="grahams" className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">ACTIVE GRAHAM DEPLOYMENTS</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {AGENT_PREVIEWS.map(a => <GrahamCard key={a.code} agent={a} />)}
        </div>
        <p className="text-center text-[#2a4060] text-[10px] font-mono tracking-wider">EACH GRAHAM IS UNIQUELY CONFIGURED — NO TWO DEPLOYMENTS ARE IDENTICAL</p>
      </section>

      {/* Modules grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">GRAHAM CAPABILITY MODULES</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(m => (
            <div key={m.id} className="border border-[#0d1b35] bg-[#040c1a]/80 rounded-sm p-5 hover:border-[#D4AF37]/25 transition-all">
              <div className="text-[#D4AF37] text-2xl mb-3 font-mono">{m.icon}</div>
              <div className="text-white font-semibold text-sm mb-2">{m.label}</div>
              <div className="text-[#2a4060] text-xs leading-relaxed">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MKP Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">CONSUMER INTELLIGENCE LAYER</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>

        <div className="border border-[#0d2040] bg-[#040c1a] rounded-sm overflow-hidden hover:border-[#D4AF37]/30 transition-all group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#0d1b35]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#D4AF37]/30">
                    <span className="text-[#030810] font-black text-sm">M</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.35em] mb-0.5">DANTÈS ECOSYSTEM</p>
                    <h3 className="text-white font-serif font-bold text-xl leading-tight">M.K.P</h3>
                    <p className="text-[#4a6080] text-[10px] font-mono">My Kind of Platform</p>
                  </div>
                </div>
                <p className="text-[#8aa0b8] text-sm leading-relaxed mb-6">
                  <span className="text-white font-semibold">MKP</span> is Dantès' consumer intelligence layer — a price-tracking engine covering Shopee, Lazada, and TikTok Shop built for the Thai market. MKP's real asset is the proprietary dataset it compounds: purchase intent, price sensitivity, and platform preference at mass scale. That signal feeds directly into Graham agent recommendations with real-world retail sentiment. MKP turns everyday deal-hunters into the engine that makes Dantès smarter on both sides of the market.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Price Alerts","Wishlist Tracking","Deal Intelligence","Platform Arbitrage","Consumer Data"].map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2.5 py-1 bg-[#0a1628] border border-[#0d2040] text-[#4a8090] rounded-sm group-hover:border-[#D4AF37]/20 transition-colors">{tag}</span>
                  ))}
                </div>
              </div>
              <a href="/mkp/" className="inline-flex items-center gap-3 px-6 py-3 bg-[#D4AF37] text-[#030810] font-mono font-bold text-xs rounded-sm hover:bg-[#b8952b] transition-all tracking-widest w-fit shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                LAUNCH MKP →
              </a>
            </div>
            <div className="p-8 md:p-10 space-y-4">
              <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-6">LIVE PLATFORM INTELLIGENCE</p>
              {[
                { platform: "Shopee", color: "#ee4d2d", deals: "8 deals tracked", avg: "Avg 34% off", trend: "▲" },
                { platform: "Lazada", color: "#0f146d", deals: "7 deals tracked", avg: "Avg 31% off", trend: "▲" },
                { platform: "TikTok Shop", color: "#D4AF37", deals: "6 deals tracked", avg: "Avg 40% off", trend: "▼" },
              ].map(p => (
                <div key={p.platform} className="flex items-center gap-4 p-4 bg-[#030810] border border-[#0d1b35] rounded-sm">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{p.platform}</p>
                    <p className="text-[#3a5570] text-[10px] font-mono">{p.deals}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] text-xs font-mono font-bold">{p.avg}</p>
                    <p className={`text-[10px] font-mono ${p.trend === "▲" ? "text-[#00ff88]" : "text-red-400"}`}>{p.trend} trending</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-sm">
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-1">REVENUE MODEL</p>
                <p className="text-[#8aa0b8] text-[10px] leading-relaxed">Affiliate commissions · Premium subscriptions · Sponsored placements · Institutional data licensing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">DEPLOYMENT PROTOCOL</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Client Intake", desc: "Register the client — industry, objectives, pain points, and growth targets." },
            { step: "02", title: "Graham Config", desc: "Bloom Society engineers configure a Graham with the exact module stack needed." },
            { step: "03", title: "Deployment", desc: "Graham is launched into the client's operational environment with full command access." },
            { step: "04", title: "Continuous Intel", desc: "All data, reports, and insights flow exclusively to Bloom Society principals." },
          ].map(s => (
            <div key={s.step} className="border border-[#0d1b35] rounded-sm p-5 bg-[#040c1a]/60">
              <div className="font-mono text-[#D4AF37] text-2xl font-bold mb-3">{s.step}</div>
              <div className="text-white text-sm font-semibold mb-2">{s.title}</div>
              <div className="text-[#2a4060] text-xs leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NFT Widget */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">THE BLOOM SOCIETY — ON-CHAIN</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            <div>
              <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.35em] mb-2">MEMBERSHIP NFT</p>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">Bloom Society Collection</h3>
              <p className="text-[#8aa0b8] text-sm leading-relaxed">
                Bloom Society membership is encoded on-chain. Each NFT represents a verified principal stake in the Dantès ecosystem — granting access to private Graham deployments, institutional deal flow, and lifetime platform revenue participation. Ownership is immutable. Membership is scarce.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Chain", value: "Ethereum" },
                { label: "Standard", value: "ERC-721" },
                { label: "Marketplace", value: "OpenSea — @Thebloomsociety" },
                { label: "Utility", value: "Platform access · Revenue share · Governance" },
              ].map(r => (
                <div key={r.label} className="flex items-start justify-between gap-4 py-2 border-b border-[#0d1b35]">
                  <span className="text-[10px] font-mono text-[#3a5570] uppercase tracking-widest shrink-0">{r.label}</span>
                  <span className="text-[10px] font-mono text-[#8aa0b8] text-right">{r.value}</span>
                </div>
              ))}
            </div>
            <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-xs rounded-sm hover:bg-[#D4AF37]/10 transition-all tracking-widest w-fit">
              <svg width="14" height="14" viewBox="0 0 90 90" fill="currentColor"><path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.849 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.71 34.911 46.953C34.839 47.061 34.713 47.124 34.578 47.124H22.545C22.221 47.124 22.032 46.773 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.143 52.677 36.945 52.308 37.134 52.038C37.206 51.921 37.278 51.804 37.368 51.669C37.971 50.742 38.835 49.329 39.699 47.718C40.284 46.605 40.851 45.414 41.31 44.214C41.4 43.986 41.472 43.749 41.553 43.521C41.679 43.11 41.805 42.726 41.895 42.351C41.985 42.03 42.066 41.694 42.138 41.376C42.354 40.32 42.444 39.201 42.444 38.046C42.444 37.62 42.426 37.176 42.39 36.75C42.372 36.306 42.318 35.862 42.264 35.418C42.228 35.01 42.156 34.611 42.084 34.212C41.985 33.651 41.859 33.09 41.715 32.529L41.661 32.295C41.553 31.896 41.454 31.515 41.328 31.125C40.959 29.838 40.545 28.587 40.095 27.414C39.933 26.955 39.753 26.514 39.564 26.073C39.285 25.389 39.006 24.762 38.736 24.162C38.601 23.88 38.475 23.616 38.358 23.352C38.223 23.052 38.079 22.761 37.944 22.479C37.845 22.26 37.728 22.05 37.638 21.84L36.567 19.728C36.423 19.449 36.693 19.125 36.990 19.215L43.461 21.102H43.479L44.37 21.363L45.315 21.642L45.666 21.741V17.595C45.666 15.948 46.998 14.58 48.627 14.58C49.437 14.58 50.175 14.904 50.706 15.435C51.237 15.966 51.561 16.695 51.561 17.595V23.313L52.236 23.508C52.281 23.526 52.344 23.553 52.398 23.589C52.605 23.733 52.911 23.958 53.298 24.237C53.604 24.462 53.928 24.732 54.297 25.011C55.044 25.578 55.926 26.298 56.88 27.126C57.132 27.342 57.384 27.567 57.609 27.792C58.842 28.944 60.237 30.294 61.542 31.797C61.902 32.211 62.253 32.634 62.604 33.066C62.955 33.507 63.333 33.939 63.657 34.371C64.080 34.938 64.539 35.523 64.944 36.135C65.124 36.405 65.322 36.684 65.493 36.954C66.015 37.755 66.483 38.574 66.933 39.393C67.113 39.753 67.302 40.131 67.464 40.500C67.968 41.610 68.364 42.738 68.616 43.866C68.697 44.145 68.751 44.442 68.769 44.721V44.793C68.832 45.135 68.850 45.495 68.868 45.864C68.940 47.106 68.877 48.348 68.598 49.572C68.490 50.085 68.346 50.571 68.175 51.066C68.004 51.534 67.833 52.020 67.626 52.488C67.221 53.460 66.753 54.450 66.186 55.350C65.997 55.665 65.790 55.998 65.583 56.313C65.358 56.646 65.124 56.961 64.917 57.258C64.647 57.645 64.359 58.050 64.071 58.410C63.810 58.770 63.549 59.139 63.261 59.481C62.865 59.940 62.487 60.381 62.091 60.795C61.857 61.047 61.605 61.308 61.353 61.542C61.101 61.794 60.849 62.028 60.615 62.244C60.255 62.568 59.949 62.820 59.688 63.027L59.067 63.531C58.977 63.603 58.860 63.648 58.743 63.648H53.316V67.932H59.076C60.399 67.932 61.659 67.473 62.658 66.636C63.000 66.348 64.449 65.106 66.168 63.225C66.222 63.162 66.294 63.117 66.375 63.099L73.935 60.948C74.223 60.867 74.502 61.083 74.502 61.380V52.812H74.376Z"/></svg>
              VIEW ON OPENSEA
            </a>
          </div>

          <div className="space-y-4">
            <div className="border border-[#D4AF37]/20 bg-[#040c1a] rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#0d1b35] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest">LATEST MINTS — THEBLOOMSOCIETY</span>
                </div>
                <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="text-[9px] font-mono text-[#3a5570] hover:text-[#D4AF37] transition-colors">opensea.io ↗</a>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                {[
                  { id: "#001", label: "Genesis", rarity: "Legendary", color: "#D4AF37" },
                  { id: "#002", label: "Principal", rarity: "Rare", color: "#06b6d4" },
                  { id: "#003", label: "Operator", rarity: "Uncommon", color: "#8b5cf6" },
                ].map((nft) => (
                  <a key={nft.id} href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                    className="group block border border-[#0d1b35] hover:border-[#D4AF37]/40 rounded-sm overflow-hidden transition-all">
                    <div className="aspect-square relative overflow-hidden"
                      style={{ background: `radial-gradient(ellipse at center, ${nft.color}18 0%, #030810 70%)` }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-sm border flex items-center justify-center"
                          style={{ borderColor: nft.color + "40", background: nft.color + "10" }}>
                          <span className="font-serif font-black text-lg" style={{ color: nft.color }}>✦</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-[#0d1b35]">
                      <p className="text-[10px] font-mono text-white font-bold">{nft.id}</p>
                      <p className="text-[9px] font-mono" style={{ color: nft.color }}>{nft.rarity}</p>
                      <p className="text-[9px] font-mono text-[#3a5570]">{nft.label}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="px-4 pb-4">
                <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[10px] font-bold rounded-sm hover:bg-[#D4AF37]/10 transition-all tracking-widest">
                  VIEW FULL COLLECTION ON OPENSEA
                </a>
              </div>
            </div>
            <div className="border border-[#0d1b35] bg-[#040c1a]/60 rounded-sm px-4 py-3 flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#3a5570]">Blockchain-verified · Immutable ownership · Scarce supply</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] font-mono text-[#D4AF37]">MINTING OPEN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bangkok Lifestyle Layer */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#0d1b35]" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em]">BUILT FOR BANGKOK</span>
          <div className="h-px flex-1 bg-[#0d1b35]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — BKK narrative */}
          <div className="border border-[#0d2040] bg-[#040c1a] rounded-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🇹🇭</span>
              <div>
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.35em]">THAILAND OPERATIONS</p>
                <h3 className="text-white font-serif font-bold text-lg">Bangkok-First Intelligence</h3>
              </div>
            </div>
            <p className="text-[#8aa0b8] text-sm leading-relaxed mb-6">
              Dantès was built for the pace of Bangkok. Your Graham understands Thai VAT, BOI incentives, SET market dynamics, and the rhythm of deals done over dinner at Sindhorn. It speaks the language of Silom, Sukhumvit, and Sathorn — in baht and in ambition.
            </p>
            <div className="space-y-3">
              {[
                { icon: "🏦", label: "Thai Financial Compliance", desc: "VAT, WHT, BOI filings — automated and audit-ready" },
                { icon: "📊", label: "SET & Market Intelligence", desc: "Institutional-grade Thai market signals in your Graham" },
                { icon: "🤝", label: "Enterprise Client Network", desc: "Kasikorn AM, SCB AM, PTT, Central Pattana & more" },
                { icon: "🛒", label: "Thai Consumer Layer (MKP)", desc: "Shopee, Lazada, TikTok Shop — local deal intelligence" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 py-3 border-b border-[#0d1b35] last:border-0">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{item.label}</p>
                    <p className="text-[#3a5570] text-[10px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — LINE OA + Contact */}
          <div className="space-y-4">
            {/* LINE OA CTA */}
            <div className="border border-[#06c755]/30 bg-[#06c755]/5 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#06c755" }}>
                  <svg width="20" height="20" viewBox="0 0 36 36" fill="white"><path d="M18 .9C8.51.9.9 6.95.9 14.43c0 6.75 5.98 12.41 14.08 13.6.55.12 1.29.36 1.48.82.17.42.11 1.07.05 1.49l-.24 1.43c-.07.43-.34 1.68 1.47.92s9.73-5.73 13.27-9.8c2.45-2.68 3.81-5.52 3.81-8.46C34.82 6.95 27.49.9 18 .9z"/></svg>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-[#06c755] tracking-widest mb-0.5">INSTANT ALERTS</p>
                  <h4 className="text-white font-bold text-sm">Connect on LINE OA</h4>
                </div>
              </div>
              <p className="text-[#8aa0b8] text-xs leading-relaxed mb-5">
                Your Graham sends real-time alerts, deal notifications, and financial summaries direct to LINE — the way Bangkok operates. No app switching. Just intelligence, delivered where you already live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://line.me/ti/p/thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm font-mono font-bold text-xs text-white transition-all hover:opacity-90"
                  style={{ background: "#06c755" }}>
                  ADD LINE OA →
                </a>
                <div className="flex items-center gap-2 px-4 py-2.5 border border-[#0d1b35] rounded-sm">
                  <span className="text-[9px] font-mono text-[#3a5570]">ID:</span>
                  <span className="text-[10px] font-mono text-white">@thebloomsociety</span>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="border border-[#25d366]/20 bg-[#25d366]/5 rounded-sm p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#25d366" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-semibold mb-0.5">WhatsApp Direct</p>
                <p className="text-[#3a5570] text-[10px]">For international members — same Graham intelligence, global reach</p>
              </div>
              <a href="https://wa.me/thebloomsociety" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 border border-[#25d366]/30 text-[#25d366] font-mono text-[10px] font-bold rounded-sm hover:bg-[#25d366]/10 transition-colors shrink-0">
                CHAT →
              </a>
            </div>

            {/* Club teaser */}
            <Link href={isSignedIn ? "/portal/club" : "/sign-in"}
              className="block border border-[#D4AF37]/25 bg-gradient-to-br from-[#040c1a] to-[#060e1a] rounded-sm p-5 hover:border-[#D4AF37]/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#D4AF37] text-lg">✦</span>
                  <div>
                    <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">MEMBERS ONLY</p>
                    <h4 className="text-white font-bold text-sm">The Club Room</h4>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#D4AF37] group-hover:text-white transition-colors">ENTER →</span>
              </div>
              <p className="text-[#3a5570] text-[10px] leading-relaxed">Private deal wall · Exclusive events · Member directory. Where Bloom Society principals meet, share, and close.</p>
              <div className="flex gap-2 mt-3">
                {["DEAL WALL","EVENTS BKK","MEMBERS"].map(tag => (
                  <span key={tag} className="text-[8px] font-mono px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-sm">{tag}</span>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Join the Bloom Society CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="border border-[#D4AF37]/20 bg-gradient-to-br from-[#040c1a] to-[#060e1a] rounded-sm p-10 text-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(ellipse at top, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
          <div className="relative z-10">
            <div className="w-14 h-14 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-[#D4AF37] text-2xl font-serif font-bold">✦</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/25 rounded-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[9px] font-mono text-red-400 tracking-widest">{spotsLeft} SPOTS LEFT THIS QUARTER</span>
            </div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-3">RESTRICTED MEMBERSHIP</p>
            <h2 className="text-3xl font-serif font-black text-white mb-4">Join the Bloom Society</h2>
            <p className="text-[#3a5570] text-sm leading-relaxed max-w-xl mx-auto mb-8">
              Every Bloom Society member receives a custom Graham agent — a precision AI built exclusively for their business. We accept a limited number of members each quarter. Applications are reviewed personally by Dr. Graham and Dr. Prabhakar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-2xl mx-auto">
              {[
                { n:"01", t:"Apply", d:"Complete our confidential intake form. Tell us your business and what you need your Graham to achieve." },
                { n:"02", t:"Quotation", d:"We design your bespoke Graham configuration and send a personalised investment proposal." },
                { n:"03", t:"Deploy", d:"Upon onboarding, your Graham is activated 24/7 and your Bloom Society credentials are issued." },
              ].map(s => (
                <div key={s.n} className="bg-[#030810]/60 border border-[#0d1b35] rounded-sm p-4">
                  <span className="font-mono text-[#D4AF37] font-bold text-sm block mb-2">{s.n}</span>
                  <p className="text-xs font-semibold text-white mb-1">{s.t}</p>
                  <p className="text-[10px] text-[#2a4060] leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
            <Link href="/join" className="inline-block px-8 py-3.5 bg-[#D4AF37] text-[#030810] font-mono font-bold text-sm rounded-sm hover:bg-[#b8952b] transition-all tracking-widest shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              WANT TO BUILD YOUR EMPIRE? APPLY HERE →
            </Link>
            <p className="text-[9px] font-mono text-[#2a4060] mt-4">Applications reviewed within 48–72 hours · Bangkok · Dubai · Global</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 border-t border-[#0d1b35] py-20 px-8 text-center">
        <p className="text-[9px] font-mono text-[#D4AF37]/50 tracking-[0.4em] mb-4">RESTRICTED ACCESS — BLOOM SOCIETY OPERATORS ONLY</p>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Ready to deploy a Graham?</h2>
        <p className="text-[#3a5570] max-w-lg mx-auto text-sm mb-8">Register a client, configure their Graham's module stack, and deploy a precision AI agent calibrated to their exact business context.</p>
        <Link href={isSignedIn ? "/command" : "/sign-in"}
          className="inline-block px-8 py-3.5 bg-[#D4AF37] text-[#030810] font-mono font-bold text-sm rounded-sm hover:bg-[#b8952b] transition-all tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          ACCESS COMMAND CENTER →
        </Link>
      </section>

      <footer className="relative z-10 border-t border-[#0d1b35] py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-[#2a4060] text-[10px] font-mono">© 2026 The Bloom Society · Dr. Steven Graham & Dr. Akshay Prabhakar · Bangkok</span>
        <span className="text-[9px] font-mono text-[#D4AF37]/30 tracking-widest">DANTÈS v1.0 · ALL DATA CLASSIFIED</span>
      </footer>
    </div>
  );
}
