import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { useEffect, useRef } from "react";

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

      {/* Grid overlay */}
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

      {/* Hero */}
      <section className="relative z-10 text-center pt-28 pb-20 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#D4AF37]/25 rounded-sm mb-8 bg-[#D4AF3708]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.35em]">BLOOM SOCIETY — CLASSIFIED COMMAND PLATFORM</span>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif font-black text-white tracking-tight mb-2 leading-none">
          DANTÈS
        </h1>
        <div className="text-[#D4AF37] font-mono text-xs sm:text-sm tracking-[0.45em] mb-8">THE AI COMMAND FORENSIC ACCOUNTING - DATA - OPERATING SYSTEM</div>
        <p className="text-[#3a5570] max-w-2xl mx-auto text-base leading-relaxed mb-12">
          Dantès deploys precision AI agents — <span className="text-[#D4AF37] font-mono font-semibold">Grahams</span> — into client businesses. Each Graham is a fully customized intelligence that drives revenue, enforces compliance, and executes growth at machine speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={isSignedIn ? "/command" : "/sign-in"}
            className="px-8 py-3.5 bg-[#D4AF37] text-[#030810] font-mono font-bold text-sm rounded-sm hover:bg-[#b8952b] transition-all tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            INITIALIZE SYSTEM →
          </Link>
          <a href="#grahams" className="px-8 py-3.5 border border-[#0d2040] text-[#3a5570] font-mono text-sm rounded-sm hover:border-[#D4AF37]/40 hover:text-white transition-all tracking-widest">
            VIEW GRAHAMS
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <div className="relative z-10 border-y border-[#0d1b35] py-5 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Graham Agents", value: "GRM01–∞", sub: "Infinitely scalable" },
            { label: "Capability Modules", value: "06", sub: "Financial · Marketing · Compliance +" },
            { label: "Backend Access", value: "RESTRICTED", sub: "Bloom Society principals only" },
            { label: "System Status", value: "LIVE", sub: "All nodes nominal" },
          ].map(s => (
            <div key={s.label}>
              <div className="font-mono text-[#D4AF37] font-bold text-xl mb-0.5">{s.value}</div>
              <div className="text-white text-xs font-medium mb-0.5">{s.label}</div>
              <div className="text-[#2a4060] text-[10px] font-mono">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Grahams preview */}
      <section id="grahams" className="relative z-10 max-w-6xl mx-auto px-8 py-20">
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
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-16">
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

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-16">
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


        {/* Join the Bloom Society CTA */}
        <section className="relative z-10 max-w-5xl mx-auto px-8 py-16">
          <div className="border border-[#D4AF37]/20 bg-gradient-to-br from-[#040c1a] to-[#060e1a] rounded-sm p-10 text-center overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(ellipse at top, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
            <div className="relative z-10">
              <div className="w-14 h-14 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-sm flex items-center justify-center mx-auto mb-6">
                <span className="text-[#D4AF37] text-2xl font-serif font-bold">✦</span>
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
              <Link href="/join" className="inline-block px-8 py-3.5 bg-[#D4AF37] text-[#030810] font-mono font-bold text-sm rounded-sm hover:bg-[#b8952b] transition-all tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                APPLY FOR MEMBERSHIP →
              </Link>
              <p className="text-[9px] font-mono text-[#2a4060] mt-4">Applications reviewed within 48–72 hours · Limited quarterly intake</p>
            </div>
          </div>
        </section>

        {/* CTA */}
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
        <span className="text-[#2a4060] text-[10px] font-mono">© 2026 The Bloom Society · Dr. Steven Graham & Dr. Akshay Prabhakar</span>
        <span className="text-[9px] font-mono text-[#D4AF37]/30 tracking-widest">DANTÈS v1.0 · ALL DATA CLASSIFIED</span>
      </footer>
    </div>
  );
}
