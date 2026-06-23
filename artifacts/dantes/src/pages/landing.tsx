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

function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Particles
    const PARTICLE_COUNT = 220;
    type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number; opacitySpeed: number };
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -Math.random() * 0.15 - 0.03,
      size: Math.random() * 1.3 + 0.2,
      opacity: Math.random() * 0.45 + 0.05,
      opacitySpeed: (Math.random() - 0.5) * 0.0025,
    }));

    // Network nodes
    const NODE_COUNT = 18;
    type Node = { x: number; y: number; vx: number; vy: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.07,
      vy: (Math.random() - 0.5) * 0.05,
    }));

    // Orbiting rings
    type Ring = { cx: number; cy: number; rx: number; ry: number; angle: number; speed: number; opacity: number };
    const rings: Ring[] = [
      { cx: 0.5, cy: 0.44, rx: 0.36, ry: 0.13, angle: 0, speed: 0.00028, opacity: 0.065 },
      { cx: 0.5, cy: 0.44, rx: 0.22, ry: 0.08, angle: Math.PI / 3, speed: -0.00045, opacity: 0.04 },
      { cx: 0.5, cy: 0.44, rx: 0.46, ry: 0.17, angle: Math.PI / 6, speed: 0.00016, opacity: 0.035 },
    ];

    let sweepX = -0.3;

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Base
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, w, h);

      // Central breathing glow
      const breathe = 0.72 + 0.28 * Math.sin(t * 0.0007);
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, w * 0.44);
      grad.addColorStop(0, `rgba(255,179,0,${0.05 * breathe})`);
      grad.addColorStop(0.5, `rgba(255,107,0,${0.015 * breathe})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Orbiting ellipses
      rings.forEach(ring => {
        ring.angle += ring.speed;
        ctx.save();
        ctx.translate(w * ring.cx, h * ring.cy);
        ctx.rotate(ring.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, w * ring.rx, h * ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,179,0,${ring.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      });

      // Network
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -60) n.x = w + 60;
        if (n.x > w + 60) n.x = -60;
        if (n.y < -60) n.y = h + 60;
        if (n.y > h + 60) n.y = -60;
      });
      const LINK = 210;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,179,0,${(1 - d / LINK) * 0.1})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,179,0,0.22)";
        ctx.fill();
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.opacity += p.opacitySpeed;
        if (p.opacity < 0.02) { p.opacity = 0.02; p.opacitySpeed *= -1; }
        if (p.opacity > 0.5) { p.opacity = 0.5; p.opacitySpeed *= -1; }
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,179,0,${p.opacity})`;
        ctx.fill();
      });

      // Light sweep — slow 14s cycle
      sweepX += 0.00038;
      if (sweepX > 1.3) sweepX = -0.3;
      const sx = w * sweepX;
      const sg = ctx.createLinearGradient(sx - 200, 0, sx + 200, h);
      sg.addColorStop(0, "rgba(255,179,0,0)");
      sg.addColorStop(0.5, "rgba(255,179,0,0.024)");
      sg.addColorStop(1, "rgba(255,179,0,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, h);

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}

function GrahamCard({ agent }: { agent: typeof AGENT_PREVIEWS[0] }) {
  return (
    <div className="border border-[#FFB300]/10 bg-[#0a0804] rounded-sm p-5 hover:border-[#FFB300]/35 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-xs text-[#FFB300] mb-1 tracking-widest">{agent.code}</div>
          <div className="text-white font-semibold text-sm">{agent.client}</div>
          <div className="text-[#6b5a30] text-xs font-mono mt-0.5">{agent.industry}</div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-mono ${agent.status === "active" ? "bg-[#FFB300]/10 text-[#FFB300]" : "bg-[#FF6B00]/10 text-[#FF6B00]"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-[#FFB300] animate-pulse" : "bg-[#FF6B00]"}`} />
          {agent.status.toUpperCase()}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {agent.modules.map(m => {
          const mod = MODULES.find(x => x.id === m);
          return <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-[#080808] border border-[#FFB300]/10 text-[#8a7040] rounded-sm group-hover:border-[#FFB300]/20 transition-colors">{mod?.label ?? m}</span>;
        })}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const typed = useTypewriter(TYPEWRITER_LINES);
  const [spotsLeft] = useState(7);

  return (
    <div className="min-h-screen bg-[#080808] text-white relative overflow-x-hidden">
      {/* Subtle gold grid overlay — full page */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(255,179,0,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,179,0,0.018) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-[#FFB300]/10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Dantès" className="w-10 h-10 object-contain shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-serif font-black text-white tracking-[0.2em] text-lg">DANTÈS</span>
            <span className="text-[9px] font-mono text-[#FFB300]/45 tracking-[0.35em]">THE BLOOM SOCIETY</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden sm:flex text-[10px] font-mono text-[#FFB300] items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300] animate-pulse inline-block" />
            SYSTEM OPERATIONAL
          </span>
          <Link href={isSignedIn ? "/command" : "/sign-in"}
            className="px-5 py-2 bg-[#FFB300] text-[#080808] text-xs font-mono font-bold rounded-sm hover:bg-[#FF6B00] transition-colors tracking-widest"
            style={{ boxShadow: "0 0 24px rgba(255,179,0,0.25)" }}>
            {isSignedIn ? "COMMAND CENTER" : "AUTHORIZE ACCESS"}
          </Link>
        </div>
      </nav>

      {/* ─── HERO — cinematic animation runs here ─── */}
      <section className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pb-12 overflow-hidden">
        {/* The animation IS the background — always on, no button */}
        <CinematicBackground />

        {/* Bottom fade to page */}
        <div className="absolute bottom-0 left-0 w-full h-36 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent, #080808)" }} />

        {/* Content sits above the animation */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Scarcity */}
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#FF6B00]/35 bg-[#FF6B00]/8 rounded-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            <span className="text-[10px] font-mono text-[#FF6B00] tracking-[0.3em]">Q3 2026 INTAKE — {spotsLeft} SPOTS REMAINING</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
          </div>

          <div className="mb-3">
            <span className="text-[9px] font-mono text-[#FFB300]/55 tracking-[0.4em]">BANGKOK · DUBAI · GLOBAL OPERATORS</span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif font-black text-white tracking-tight mb-2 leading-none"
            style={{ textShadow: "0 0 60px rgba(255,179,0,0.25)" }}>
            DANTÈS
          </h1>
          <div className="text-[#FFB300] font-mono text-xs sm:text-sm tracking-[0.45em] mb-6">THE BLOOM SOCIETY — AI COMMAND · FORENSIC FINANCE · SMART LIVING</div>

          {/* Typewriter */}
          <div className="h-10 flex items-center justify-center mb-8">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {typed}<span className="animate-pulse text-[#FFB300]">|</span>
            </span>
          </div>

          <p className="text-[#7a6535] max-w-2xl mx-auto text-base leading-relaxed mb-6">
            For the Bangkok elite who operate on instinct, data, and ambition — Dantès deploys a custom AI agent called a <span className="text-[#FFB300] font-mono font-semibold">Graham</span> into your business. It runs 24/7. It never sleeps. It handles everything so you can focus on what you do best: <span className="text-white font-semibold">winning.</span>
          </p>

          {/* BKK Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-[10px] font-mono text-[#5a4a20]">
            <span className="flex items-center gap-2"><span className="text-[#FFB300]">◆</span> Bangkok HQ</span>
            <span className="text-[#FFB300]/15">|</span>
            <span className="flex items-center gap-2"><span className="text-[#FFB300]">◆</span> Thai Enterprise Clients</span>
            <span className="text-[#FFB300]/15">|</span>
            <span className="flex items-center gap-2"><span className="text-[#FFB300]">◆</span> LINE OA · WhatsApp Alerts</span>
            <span className="text-[#FFB300]/15">|</span>
            <span className="flex items-center gap-2"><span className="text-[#FFB300]">◆</span> THB · USD · Multi-currency</span>
          </div>

          <Link href="/join"
            className="px-8 py-3.5 bg-[#FFB300] text-[#080808] font-mono font-bold text-sm rounded-sm hover:bg-[#FF6B00] transition-all tracking-widest"
            style={{ boxShadow: "0 0 40px rgba(255,179,0,0.35)" }}>
            CLAIM YOUR SPOT — APPLY NOW →
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
          <span className="text-[8px] font-mono text-[#3a2e10] tracking-widest">SCROLL</span>
          <span className="text-[#3a2e10] text-xs">↓</span>
        </div>
      </section>

      {/* Stats bar */}
      <div className="relative z-10 border-y border-[#FFB300]/10 py-5 px-8 bg-[#080808]/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Graham Agents", value: "GRM01–∞", sub: "Infinitely scalable" },
            { label: "Capability Modules", value: "06", sub: "Financial · Marketing · Compliance +" },
            { label: "Backend Access", value: "RESTRICTED", sub: "Bloom Society principals only" },
            { label: "System Status", value: "LIVE", sub: "All nodes nominal · BKK" },
          ].map(s => (
            <div key={s.label}>
              <div className="font-mono text-[#FFB300] font-bold text-xl mb-0.5" style={{ textShadow: "0 0 12px rgba(255,179,0,0.4)" }}>{s.value}</div>
              <div className="text-white text-xs font-medium mb-0.5">{s.label}</div>
              <div className="text-[#5a4a20] text-[10px] font-mono">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The Case for Dantès */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">THE CASE FOR DANTÈS</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Bangkok moves fast.", body: "Opportunity in BKK doesn't wait. The people closing the biggest deals aren't working harder — they have smarter leverage. Dantès is that leverage." },
            { icon: "🧠", title: "Common sense, finally automated.", body: "Most businesses fail not from lack of talent but from poor execution of obvious things: cash flow, compliance, follow-through. Graham does all of it. Flawlessly." },
            { icon: "✦", title: "The Bloom Society standard.", body: "This isn't a subscription. It's membership in a circle of operators who refuse to be average. Your Graham is bespoke. Your edge is real." },
          ].map(item => (
            <div key={item.title} className="border border-[#FFB300]/10 bg-[#0a0804]/60 rounded-sm p-7 hover:border-[#FFB300]/25 transition-all">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white font-serif font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-[#6b5a30] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Grahams */}
      <section id="grahams" className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">ACTIVE GRAHAM DEPLOYMENTS</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {AGENT_PREVIEWS.map(a => <GrahamCard key={a.code} agent={a} />)}
        </div>
        <p className="text-center text-[#4a3a18] text-[10px] font-mono tracking-wider">EACH GRAHAM IS UNIQUELY CONFIGURED — NO TWO DEPLOYMENTS ARE IDENTICAL</p>
      </section>

      {/* Modules grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">GRAHAM CAPABILITY MODULES</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(m => (
            <div key={m.id} className="border border-[#FFB300]/10 bg-[#0a0804]/80 rounded-sm p-5 hover:border-[#FFB300]/25 transition-all">
              <div className="text-[#FFB300] text-2xl mb-3 font-mono">{m.icon}</div>
              <div className="text-white font-semibold text-sm mb-2">{m.label}</div>
              <div className="text-[#4a3a18] text-xs leading-relaxed">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MKP Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">CONSUMER INTELLIGENCE LAYER</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="border border-[#FFB300]/12 bg-[#0a0804] rounded-sm overflow-hidden hover:border-[#FFB300]/28 transition-all group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#FFB300]/10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#FFB300] rounded-xl flex items-center justify-center shrink-0" style={{ boxShadow: "0 0 20px rgba(255,179,0,0.3)" }}>
                    <span className="text-[#080808] font-black text-sm">M</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#FFB300] tracking-[0.35em] mb-0.5">DANTÈS ECOSYSTEM</p>
                    <h3 className="text-white font-serif font-bold text-xl leading-tight">M.K.P</h3>
                    <p className="text-[#6b5a30] text-[10px] font-mono">My Kind of Platform</p>
                  </div>
                </div>
                <p className="text-[#8a7040] text-sm leading-relaxed mb-6">
                  <span className="text-white font-semibold">MKP</span> is Dantès' consumer intelligence layer — a price-tracking engine covering Shopee, Lazada, and TikTok Shop built for the Thai market. MKP's real asset is the proprietary dataset it compounds: purchase intent, price sensitivity, and platform preference at mass scale. That signal feeds directly into Graham agent recommendations with real-world retail sentiment.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Price Alerts","Wishlist Tracking","Deal Intelligence","Platform Arbitrage","Consumer Data"].map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2.5 py-1 bg-[#080808] border border-[#FFB300]/12 text-[#6b5a30] rounded-sm group-hover:border-[#FFB300]/22 transition-colors">{tag}</span>
                  ))}
                </div>
              </div>
              <a href="/mkp/" className="inline-flex items-center gap-3 px-6 py-3 bg-[#FFB300] text-[#080808] font-mono font-bold text-xs rounded-sm hover:bg-[#FF6B00] transition-all tracking-widest w-fit" style={{ boxShadow: "0 0 20px rgba(255,179,0,0.2)" }}>
                LAUNCH MKP →
              </a>
            </div>
            <div className="p-8 md:p-10 space-y-4">
              <p className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em] mb-6">LIVE PLATFORM INTELLIGENCE</p>
              {[
                { platform: "Shopee", color: "#ee4d2d", deals: "8 deals tracked", avg: "Avg 34% off", trend: "▲" },
                { platform: "Lazada", color: "#0f146d", deals: "7 deals tracked", avg: "Avg 31% off", trend: "▲" },
                { platform: "TikTok Shop", color: "#FFB300", deals: "6 deals tracked", avg: "Avg 40% off", trend: "▼" },
              ].map(p => (
                <div key={p.platform} className="flex items-center gap-4 p-4 bg-[#080808] border border-[#FFB300]/10 rounded-sm">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{p.platform}</p>
                    <p className="text-[#5a4a20] text-[10px] font-mono">{p.deals}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#FFB300] text-xs font-mono font-bold">{p.avg}</p>
                    <p className={`text-[10px] font-mono ${p.trend === "▲" ? "text-[#FFB300]" : "text-[#FF6B00]"}`}>{p.trend} trending</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-[#FFB300]/5 border border-[#FFB300]/18 rounded-sm">
                <p className="text-[9px] font-mono text-[#FFB300] tracking-widest mb-1">REVENUE MODEL</p>
                <p className="text-[#8a7040] text-[10px] leading-relaxed">Affiliate commissions · Premium subscriptions · Sponsored placements · Institutional data licensing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">DEPLOYMENT PROTOCOL</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Client Intake", desc: "Register the client — industry, objectives, pain points, and growth targets." },
            { step: "02", title: "Graham Config", desc: "Bloom Society engineers configure a Graham with the exact module stack needed." },
            { step: "03", title: "Deployment", desc: "Graham is launched into the client's operational environment with full command access." },
            { step: "04", title: "Continuous Intel", desc: "All data, reports, and insights flow exclusively to Bloom Society principals." },
          ].map(s => (
            <div key={s.step} className="border border-[#FFB300]/10 rounded-sm p-5 bg-[#0a0804]/60">
              <div className="font-mono text-[#FFB300] text-2xl font-bold mb-3">{s.step}</div>
              <div className="text-white text-sm font-semibold mb-2">{s.title}</div>
              <div className="text-[#4a3a18] text-xs leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NFT Widget */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">THE BLOOM SOCIETY — ON-CHAIN</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            <div>
              <p className="text-[9px] font-mono text-[#FFB300] tracking-[0.35em] mb-2">MEMBERSHIP NFT</p>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">Bloom Society Collection</h3>
              <p className="text-[#8a7040] text-sm leading-relaxed">
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
                <div key={r.label} className="flex items-start justify-between gap-4 py-2 border-b border-[#FFB300]/10">
                  <span className="text-[10px] font-mono text-[#5a4a20] uppercase tracking-widest shrink-0">{r.label}</span>
                  <span className="text-[10px] font-mono text-[#8a7040] text-right">{r.value}</span>
                </div>
              ))}
            </div>
            <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#FFB300]/35 text-[#FFB300] font-mono font-bold text-xs rounded-sm hover:bg-[#FFB300]/8 transition-all tracking-widest w-fit">
              VIEW ON OPENSEA ↗
            </a>
          </div>
          <div className="space-y-4">
            <div className="border border-[#FFB300]/18 bg-[#0a0804] rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#FFB300]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#FFB300] tracking-widest">LATEST MINTS — THEBLOOMSOCIETY</span>
                </div>
                <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="text-[9px] font-mono text-[#5a4a20] hover:text-[#FFB300] transition-colors">opensea.io ↗</a>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                {[
                  { id: "#001", label: "Genesis", rarity: "Legendary", color: "#FFB300", filter: "sepia(1) saturate(3) hue-rotate(5deg) brightness(1.1)" },
                  { id: "#002", label: "Principal", rarity: "Rare", color: "#FF6B00", filter: "sepia(1) saturate(4) hue-rotate(340deg) brightness(0.95)" },
                  { id: "#003", label: "Operator", rarity: "Uncommon", color: "#8b5cf6", filter: "hue-rotate(200deg) saturate(2) brightness(0.9)" },
                ].map((nft) => (
                  <a key={nft.id} href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                    className="group block border border-[#FFB300]/12 hover:border-[#FFB300]/35 rounded-sm overflow-hidden transition-all">
                    <div className="aspect-square relative overflow-hidden"
                      style={{ background: `radial-gradient(ellipse at center, ${nft.color}22 0%, #080808 75%)` }}>
                      <img
                        src="/logo.png"
                        alt={`Dantès NFT ${nft.id}`}
                        className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: nft.filter }}
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-sm text-[7px] font-mono font-bold"
                        style={{ background: nft.color + "22", color: nft.color, border: `1px solid ${nft.color}40` }}>
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-2 border-t border-[#FFB300]/10">
                      <p className="text-[10px] font-mono text-white font-bold">{nft.id}</p>
                      <p className="text-[9px] font-mono" style={{ color: nft.color }}>{nft.rarity}</p>
                      <p className="text-[9px] font-mono text-[#5a4a20]">{nft.label}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="px-4 pb-4">
                <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#FFB300]/28 text-[#FFB300] font-mono text-[10px] font-bold rounded-sm hover:bg-[#FFB300]/8 transition-all tracking-widest">
                  VIEW FULL COLLECTION ON OPENSEA
                </a>
              </div>
            </div>
            <div className="border border-[#FFB300]/10 bg-[#0a0804]/60 rounded-sm px-4 py-3 flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#5a4a20]">Blockchain-verified · Immutable ownership · Scarce supply</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300] animate-pulse" />
                <span className="text-[9px] font-mono text-[#FFB300]">MINTING OPEN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Bangkok */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#FFB300]/10" />
          <span className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em]">BUILT FOR BANGKOK</span>
          <div className="h-px flex-1 bg-[#FFB300]/10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#FFB300]/12 bg-[#0a0804] rounded-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🇹🇭</span>
              <div>
                <p className="text-[9px] font-mono text-[#FFB300] tracking-[0.35em]">THAILAND OPERATIONS</p>
                <h3 className="text-white font-serif font-bold text-lg">Bangkok-First Intelligence</h3>
              </div>
            </div>
            <p className="text-[#8a7040] text-sm leading-relaxed mb-6">
              Dantès was built for the pace of Bangkok. Your Graham understands Thai VAT, BOI incentives, SET market dynamics, and the rhythm of deals done over dinner at Sindhorn. It speaks the language of Silom, Sukhumvit, and Sathorn — in baht and in ambition.
            </p>
            <div className="space-y-3">
              {[
                { icon: "🏦", label: "Thai Financial Compliance", desc: "VAT, WHT, BOI filings — automated and audit-ready" },
                { icon: "📊", label: "SET & Market Intelligence", desc: "Institutional-grade Thai market signals in your Graham" },
                { icon: "🤝", label: "Enterprise Client Network", desc: "Kasikorn AM, SCB AM, PTT, Central Pattana & more" },
                { icon: "🛒", label: "Thai Consumer Layer (MKP)", desc: "Shopee, Lazada, TikTok Shop — local deal intelligence" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 py-3 border-b border-[#FFB300]/8 last:border-0">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{item.label}</p>
                    <p className="text-[#5a4a20] text-[10px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {/* LINE OA */}
            <div className="border border-[#06c755]/25 bg-[#06c755]/5 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#06c755" }}>
                  <svg width="20" height="20" viewBox="0 0 36 36" fill="white"><path d="M18 .9C8.51.9.9 6.95.9 14.43c0 6.75 5.98 12.41 14.08 13.6.55.12 1.29.36 1.48.82.17.42.11 1.07.05 1.49l-.24 1.43c-.07.43-.34 1.68 1.47.92s9.73-5.73 13.27-9.8c2.45-2.68 3.81-5.52 3.81-8.46C34.82 6.95 27.49.9 18 .9z"/></svg>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-[#06c755] tracking-widest mb-0.5">INSTANT ALERTS</p>
                  <h4 className="text-white font-bold text-sm">Connect on LINE OA</h4>
                </div>
              </div>
              <p className="text-[#8a7040] text-xs leading-relaxed mb-5">
                Your Graham sends real-time alerts, deal notifications, and financial summaries direct to LINE — the way Bangkok operates. No app switching. Just intelligence, delivered where you already live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://line.me/ti/p/thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm font-mono font-bold text-xs text-white transition-all hover:opacity-90"
                  style={{ background: "#06c755" }}>
                  ADD LINE OA →
                </a>
                <div className="flex items-center gap-2 px-4 py-2.5 border border-[#FFB300]/12 rounded-sm">
                  <span className="text-[9px] font-mono text-[#5a4a20]">ID:</span>
                  <span className="text-[10px] font-mono text-white">@thebloomsociety</span>
                </div>
              </div>
            </div>
            {/* WhatsApp */}
            <div className="border border-[#25d366]/18 bg-[#25d366]/5 rounded-sm p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#25d366" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-semibold mb-0.5">WhatsApp Direct</p>
                <p className="text-[#5a4a20] text-[10px]">For international members — same Graham intelligence, global reach</p>
              </div>
              <a href="https://wa.me/thebloomsociety" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 border border-[#25d366]/28 text-[#25d366] font-mono text-[10px] font-bold rounded-sm hover:bg-[#25d366]/8 transition-colors shrink-0">
                CHAT →
              </a>
            </div>
            {/* Club Room */}
            <Link href={isSignedIn ? "/portal/club" : "/sign-in"}
              className="block border border-[#FFB300]/22 bg-gradient-to-br from-[#0a0804] to-[#0c0a04] rounded-sm p-5 hover:border-[#FFB300]/45 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#FFB300] text-lg">✦</span>
                  <div>
                    <p className="text-[9px] font-mono text-[#FFB300] tracking-widest">MEMBERS ONLY</p>
                    <h4 className="text-white font-bold text-sm">The Club Room</h4>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#FFB300] group-hover:text-white transition-colors">ENTER →</span>
              </div>
              <p className="text-[#5a4a20] text-[10px] leading-relaxed">Private deal wall · Exclusive events · Member directory. Where Bloom Society principals meet, share, and close.</p>
              <div className="flex gap-2 mt-3">
                {["DEAL WALL","EVENTS BKK","MEMBERS"].map(tag => (
                  <span key={tag} className="text-[8px] font-mono px-2 py-0.5 bg-[#FFB300]/8 border border-[#FFB300]/18 text-[#FFB300] rounded-sm">{tag}</span>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Join the Bloom Society CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="border border-[#FFB300]/18 bg-gradient-to-br from-[#0a0804] to-[#0c0a04] rounded-sm p-10 text-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at top, rgba(255,179,0,0.06) 0%, transparent 65%)" }} />
          <div className="relative z-10">
            <div className="w-14 h-14 border border-[#FFB300]/28 bg-[#FFB300]/5 rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-[#FFB300] text-2xl font-serif font-bold">✦</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/25 rounded-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-[9px] font-mono text-[#FF6B00] tracking-widest">{spotsLeft} SPOTS LEFT THIS QUARTER</span>
            </div>
            <p className="text-[9px] font-mono text-[#FFB300] tracking-[0.4em] mb-3">RESTRICTED MEMBERSHIP</p>
            <h2 className="text-3xl font-serif font-black text-white mb-4">Join the Bloom Society</h2>
            <p className="text-[#6b5a30] text-sm leading-relaxed max-w-xl mx-auto mb-8">
              Every Bloom Society member receives a custom Graham agent — a precision AI built exclusively for their business. We accept a limited number of members each quarter. Applications are reviewed personally by Dr. Graham and Dr. Prabhakar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-2xl mx-auto">
              {[
                { n:"01", t:"Apply", d:"Complete our confidential intake form. Tell us your business and what you need your Graham to achieve." },
                { n:"02", t:"Quotation", d:"We design your bespoke Graham configuration and send a personalised investment proposal." },
                { n:"03", t:"Deploy", d:"Upon onboarding, your Graham is activated 24/7 and your Bloom Society credentials are issued." },
              ].map(s => (
                <div key={s.n} className="bg-[#080808]/60 border border-[#FFB300]/10 rounded-sm p-4">
                  <span className="font-mono text-[#FFB300] font-bold text-sm block mb-2">{s.n}</span>
                  <p className="text-xs font-semibold text-white mb-1">{s.t}</p>
                  <p className="text-[10px] text-[#4a3a18] leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
            <Link href="/join" className="inline-block px-8 py-3.5 bg-[#FFB300] text-[#080808] font-mono font-bold text-sm rounded-sm hover:bg-[#FF6B00] transition-all tracking-widest" style={{ boxShadow: "0 0 40px rgba(255,179,0,0.3)" }}>
              WANT TO BUILD YOUR EMPIRE? APPLY HERE →
            </Link>
            <p className="text-[9px] font-mono text-[#4a3a18] mt-4">Applications reviewed within 48–72 hours · Bangkok · Dubai · Global</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 border-t border-[#FFB300]/10 py-20 px-8 text-center">
        <p className="text-[9px] font-mono text-[#FFB300]/45 tracking-[0.4em] mb-4">RESTRICTED ACCESS — BLOOM SOCIETY OPERATORS ONLY</p>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Ready to deploy a Graham?</h2>
        <p className="text-[#6b5a30] max-w-lg mx-auto text-sm mb-8">Register a client, configure their Graham's module stack, and deploy a precision AI agent calibrated to their exact business context.</p>
        <Link href={isSignedIn ? "/command" : "/sign-in"}
          className="inline-block px-8 py-3.5 bg-[#FFB300] text-[#080808] font-mono font-bold text-sm rounded-sm hover:bg-[#FF6B00] transition-all tracking-widest"
          style={{ boxShadow: "0 0 30px rgba(255,179,0,0.2)" }}>
          ACCESS COMMAND CENTER →
        </Link>
      </section>

      <footer className="relative z-10 border-t border-[#FFB300]/10 py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-[#4a3a18] text-[10px] font-mono">© 2026 The Bloom Society · Dr. Steven Graham & Dr. Akshay Prabhakar · Bangkok</span>
        <span className="text-[9px] font-mono text-[#FFB300]/25 tracking-widest">DANTÈS v1.0 · ALL DATA CLASSIFIED</span>
      </footer>
    </div>
  );
}
