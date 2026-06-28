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

// Palette constants
const P = {
  bg: "#f5f0ff",
  heading: "#1e1b4b",
  body: "#5a587a",
  muted: "#9898b8",
  cyan: "#22d3ee",
  pink: "#ec4899",
  purple: "#a855f7",
  orange: "#fb923c",
  card: "rgba(255,255,255,0.65)",
  cardBorder: "rgba(168,85,247,0.18)",
};

const COLORS = [P.cyan, P.pink, P.purple, P.orange, "#67e8f9", "#f9a8d4", "#c4b5fd"];

function HolographicBackground() {
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

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; opacitySpeed: number; colorIdx: number;
    };
    const PARTICLE_COUNT = 200;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.14 - 0.03,
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.55 + 0.1,
      opacitySpeed: (Math.random() - 0.5) * 0.003,
      colorIdx: Math.floor(Math.random() * COLORS.length),
    }));

    type Node = { x: number; y: number; vx: number; vy: number; colorIdx: number };
    const NODE_COUNT = 16;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.06,
      colorIdx: Math.floor(Math.random() * COLORS.length),
    }));

    type Ring = { cx: number; cy: number; rx: number; ry: number; angle: number; speed: number; colorIdx: number; opacity: number };
    const rings: Ring[] = [
      { cx: 0.5, cy: 0.44, rx: 0.34, ry: 0.12, angle: 0, speed: 0.00028, colorIdx: 0, opacity: 0.14 },
      { cx: 0.5, cy: 0.44, rx: 0.21, ry: 0.075, angle: Math.PI / 3, speed: -0.00045, colorIdx: 2, opacity: 0.10 },
      { cx: 0.5, cy: 0.44, rx: 0.44, ry: 0.16, angle: Math.PI / 6, speed: 0.00016, colorIdx: 1, opacity: 0.09 },
    ];

    let sweepX = -0.3;

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Soft multi-color radial glows (holo effect)
      const breathe = 0.75 + 0.25 * Math.sin(t * 0.0008);
      const breathe2 = 0.75 + 0.25 * Math.sin(t * 0.0006 + 1.5);
      const breathe3 = 0.75 + 0.25 * Math.sin(t * 0.0009 + 3.0);

      const g1 = ctx.createRadialGradient(w * 0.3, h * 0.35, 0, w * 0.3, h * 0.35, w * 0.38);
      g1.addColorStop(0, `rgba(34,211,238,${0.10 * breathe})`);
      g1.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.72, h * 0.42, 0, w * 0.72, h * 0.42, w * 0.36);
      g2.addColorStop(0, `rgba(236,72,153,${0.09 * breathe2})`);
      g2.addColorStop(1, "rgba(236,72,153,0)");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

      const g3 = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, w * 0.3);
      g3.addColorStop(0, `rgba(168,85,247,${0.07 * breathe3})`);
      g3.addColorStop(1, "rgba(168,85,247,0)");
      ctx.fillStyle = g3; ctx.fillRect(0, 0, w, h);

      const g4 = ctx.createRadialGradient(w * 0.85, h * 0.2, 0, w * 0.85, h * 0.2, w * 0.28);
      g4.addColorStop(0, `rgba(251,146,60,${0.07 * breathe})`);
      g4.addColorStop(1, "rgba(251,146,60,0)");
      ctx.fillStyle = g4; ctx.fillRect(0, 0, w, h);

      // Orbiting rings
      rings.forEach(ring => {
        ring.angle += ring.speed;
        const col = COLORS[ring.colorIdx];
        const rgb = hexToRgb(col);
        ctx.save();
        ctx.translate(w * ring.cx, h * ring.cy);
        ctx.rotate(ring.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, w * ring.rx, h * ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb},${ring.opacity})`;
        ctx.lineWidth = 0.7;
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
      const LINK = 200;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const col = COLORS[nodes[i].colorIdx];
            const rgb = hexToRgb(col);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / LINK) * 0.18})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        const col = COLORS[n.colorIdx];
        const rgb = hexToRgb(col);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},0.40)`;
        ctx.fill();
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.opacity += p.opacitySpeed;
        if (p.opacity < 0.05) { p.opacity = 0.05; p.opacitySpeed *= -1; }
        if (p.opacity > 0.6) { p.opacity = 0.6; p.opacitySpeed *= -1; }
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        const col = COLORS[p.colorIdx];
        const rgb = hexToRgb(col);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.opacity})`;
        ctx.fill();
      });

      // Iridescent sweep
      sweepX += 0.00035;
      if (sweepX > 1.3) sweepX = -0.3;
      const sx = w * sweepX;
      const sg = ctx.createLinearGradient(sx - 180, 0, sx + 180, h);
      sg.addColorStop(0, "rgba(103,232,249,0)");
      sg.addColorStop(0.35, "rgba(168,85,247,0.022)");
      sg.addColorStop(0.65, "rgba(249,168,212,0.022)");
      sg.addColorStop(1, "rgba(103,232,249,0)");
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
  const statusColor = agent.status === "active" ? P.cyan : P.orange;
  return (
    <div className="rounded-xl p-5 hover:shadow-lg transition-all group backdrop-blur-sm"
      style={{ background: P.card, border: "1px solid rgba(168,85,247,0.20)", boxShadow: "0 4px 24px rgba(168,85,247,0.07)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-xs mb-1 tracking-widest" style={{ color: P.purple }}>{agent.code}</div>
          <div className="text-sm font-bold" style={{ color: P.heading }}>{agent.client}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: P.muted }}>{agent.industry}</div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
          style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}40` }}>
          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "animate-pulse" : ""}`}
            style={{ background: statusColor }} />
          {agent.status.toUpperCase()}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {agent.modules.map(m => {
          const mod = MODULES.find(x => x.id === m);
          return (
            <span key={m} className="text-[10px] font-mono px-2.5 py-0.5 rounded-full transition-colors"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.18)", color: P.body }}>
              {mod?.label ?? m}
            </span>
          );
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
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: P.bg, color: P.heading }}>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(rgba(168,85,247,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.04) 1px,transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 backdrop-blur-sm"
        style={{ borderBottom: "1px solid rgba(168,85,247,0.12)", background: "rgba(245,240,255,0.80)" }}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Dantès" className="w-10 h-10 object-contain shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-serif font-black tracking-[0.2em] text-lg"
              style={{ background: `linear-gradient(90deg,${P.cyan},${P.purple},${P.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              DANTÈS
            </span>
            <span className="text-[9px] font-mono tracking-[0.35em]" style={{ color: P.muted }}>THE BLOOM SOCIETY</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden sm:flex text-[10px] font-mono items-center gap-2" style={{ color: P.cyan }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: P.cyan }} />
            SYSTEM OPERATIONAL
          </span>
          <Link href={isSignedIn ? "/command" : "/sign-in"}
            className="px-5 py-2 text-white text-xs font-mono font-bold rounded-full tracking-widest transition-all hover:opacity-90 hover:scale-105"
            style={{ background: `linear-gradient(135deg,${P.cyan},${P.purple},${P.pink})`, boxShadow: `0 4px 20px rgba(168,85,247,0.35)` }}>
            {isSignedIn ? "COMMAND CENTER" : "AUTHORIZE ACCESS"}
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pb-12 overflow-hidden">
        <HolographicBackground />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-36 pointer-events-none z-10"
          style={{ background: `linear-gradient(to bottom, transparent, ${P.bg})` }} />

        <div className="relative z-20 flex flex-col items-center">
          {/* Scarcity */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
            style={{ background: `${P.orange}18`, border: `1px solid ${P.orange}45` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.orange }} />
            <span className="text-[10px] font-mono tracking-[0.3em]" style={{ color: P.orange }}>
              Q3 2026 INTAKE — {spotsLeft} SPOTS REMAINING
            </span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.orange }} />
          </div>

          <div className="mb-3">
            <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.muted }}>THAILAND-BORN · GLOBALLY DEPLOYED</span>
          </div>

          <h1 className="font-serif font-black tracking-tight mb-2 leading-none"
            style={{
              fontSize: "clamp(5rem,12vw,10rem)",
              background: `linear-gradient(135deg,${P.cyan} 0%,${P.purple} 50%,${P.pink} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(168,85,247,0.25))"
            }}>
            DANTÈS
          </h1>

          <div className="font-mono text-xs sm:text-sm tracking-[0.45em] mb-6" style={{ color: P.purple }}>
            THE BLOOM SOCIETY — AI COMMAND · FORENSIC FINANCE · SMART LIVING
          </div>

          {/* Typewriter */}
          <div className="h-10 flex items-center justify-center mb-8">
            <span className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: P.heading }}>
              {typed}<span className="animate-pulse" style={{ color: P.pink }}>|</span>
            </span>
          </div>

          <p className="max-w-2xl mx-auto text-base leading-relaxed mb-6" style={{ color: P.body }}>
            For the Bangkok elite who operate on instinct, data, and ambition — Dantès deploys a custom AI agent called a{" "}
            <span className="font-mono font-semibold" style={{ color: P.purple }}>Graham</span> into your business.
            It runs 24/7. It never sleeps. It handles everything so you can focus on what you do best:{" "}
            <span className="font-bold" style={{ color: P.heading }}>winning.</span>
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-[10px] font-mono" style={{ color: P.muted }}>
            <span className="flex items-center gap-2"><span style={{ color: P.cyan }}>◆</span> Bangkok HQ</span>
            <span style={{ color: `${P.purple}40` }}>|</span>
            <span className="flex items-center gap-2"><span style={{ color: P.pink }}>◆</span> Thai Enterprise Clients</span>
            <span style={{ color: `${P.purple}40` }}>|</span>
            <span className="flex items-center gap-2"><span style={{ color: P.orange }}>◆</span> THB · USD · Multi-currency</span>
          </div>

          <Link href="/join"
            className="px-8 py-3.5 text-white font-mono font-bold text-sm rounded-full hover:opacity-90 hover:scale-105 transition-all tracking-widest"
            style={{
              background: `linear-gradient(135deg,${P.cyan},${P.purple},${P.pink})`,
              boxShadow: `0 8px 40px rgba(168,85,247,0.40)`
            }}>
            CLAIM YOUR SPOT — APPLY NOW →
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
          <span className="text-[8px] font-mono tracking-widest" style={{ color: P.muted }}>SCROLL</span>
          <span className="text-xs" style={{ color: P.purple }}>↓</span>
        </div>
      </section>

      {/* Stats bar */}
      <div className="relative z-10 py-5 px-8 backdrop-blur-sm"
        style={{ borderTop: `1px solid rgba(168,85,247,0.12)`, borderBottom: `1px solid rgba(168,85,247,0.12)`, background: "rgba(255,255,255,0.55)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Graham Agents", value: "GRM01–∞", sub: "Infinitely scalable", color: P.cyan },
            { label: "Capability Modules", value: "06", sub: "Financial · Marketing · Compliance +", color: P.purple },
            { label: "Backend Access", value: "RESTRICTED", sub: "Bloom Society principals only", color: P.pink },
            { label: "System Status", value: "LIVE", sub: "All nodes nominal · BKK", color: P.orange },
          ].map(s => (
            <div key={s.label}>
              <div className="font-mono font-bold text-xl mb-0.5"
                style={{ color: s.color, filter: `drop-shadow(0 0 8px ${s.color}60)` }}>{s.value}</div>
              <div className="text-xs font-medium mb-0.5" style={{ color: P.heading }}>{s.label}</div>
              <div className="text-[10px] font-mono" style={{ color: P.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The Case for Dantès */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.purple}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.purple }}>THE CASE FOR DANTÈS</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.purple}30)` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Bangkok moves fast.", body: "Opportunity in BKK doesn't wait. The people closing the biggest deals aren't working harder — they have smarter leverage. Dantès is that leverage.", color: P.orange },
            { icon: "🧠", title: "Common sense, finally automated.", body: "Most businesses fail not from lack of talent but from poor execution of obvious things: cash flow, compliance, follow-through. Graham does all of it. Flawlessly.", color: P.cyan },
            { icon: "✦", title: "The Bloom Society standard.", body: "This isn't a subscription. It's membership in a circle of operators who refuse to be average. Your Graham is bespoke. Your edge is real.", color: P.pink },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-7 backdrop-blur-sm hover:shadow-lg transition-all"
              style={{ background: P.card, border: `1px solid ${item.color}28`, boxShadow: `0 4px 24px ${item.color}10` }}>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-serif font-bold text-lg mb-3" style={{ color: P.heading }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: P.body }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Grahams */}
      <section id="grahams" className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.cyan}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.cyan }}>ACTIVE GRAHAM DEPLOYMENTS</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.cyan}30)` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {AGENT_PREVIEWS.map(a => <GrahamCard key={a.code} agent={a} />)}
        </div>
        <p className="text-center text-[10px] font-mono tracking-wider" style={{ color: P.muted }}>
          EACH GRAHAM IS UNIQUELY CONFIGURED — NO TWO DEPLOYMENTS ARE IDENTICAL
        </p>
      </section>

      {/* Modules grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.pink}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.pink }}>GRAHAM CAPABILITY MODULES</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.pink}30)` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, i) => {
            const accentColors = [P.cyan, P.purple, P.pink, P.orange, P.cyan, P.purple];
            const col = accentColors[i % accentColors.length];
            return (
              <div key={m.id} className="rounded-xl p-5 backdrop-blur-sm hover:shadow-md transition-all"
                style={{ background: P.card, border: `1px solid ${col}22`, boxShadow: `0 2px 16px ${col}08` }}>
                <div className="text-2xl mb-3 font-mono" style={{ color: col }}>{m.icon}</div>
                <div className="font-semibold text-sm mb-2" style={{ color: P.heading }}>{m.label}</div>
                <div className="text-xs leading-relaxed" style={{ color: P.body }}>{m.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MKP Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.orange}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.orange }}>CONSUMER INTELLIGENCE LAYER</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.orange}30)` }} />
        </div>
        <div className="rounded-xl overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all group"
          style={{ background: P.card, border: "1px solid rgba(168,85,247,0.18)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-between"
              style={{ borderBottom: "1px solid rgba(168,85,247,0.12)" }}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg,${P.cyan},${P.purple})`, boxShadow: `0 4px 16px rgba(168,85,247,0.35)` }}>
                    <span className="text-white font-black text-sm">M</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono tracking-[0.35em] mb-0.5" style={{ color: P.purple }}>DANTÈS ECOSYSTEM</p>
                    <h3 className="font-serif font-bold text-xl leading-tight" style={{ color: P.heading }}>M.K.P</h3>
                    <p className="text-[10px] font-mono" style={{ color: P.muted }}>My Kind of Platform</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: P.body }}>
                  <span className="font-bold" style={{ color: P.heading }}>MKP</span> is Dantès' consumer intelligence layer — a price-tracking engine covering Shopee, Lazada, and TikTok Shop built for the Thai market. That signal feeds directly into Graham agent recommendations with real-world retail sentiment.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Price Alerts", "Wishlist Tracking", "Deal Intelligence", "Platform Arbitrage", "Consumer Data"].map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.20)", color: P.purple }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href="/mkp/"
                className="inline-flex items-center gap-3 px-6 py-3 text-white font-mono font-bold text-xs rounded-full tracking-widest transition-all hover:opacity-90 w-fit"
                style={{ background: `linear-gradient(135deg,${P.cyan},${P.purple})`, boxShadow: `0 4px 20px rgba(168,85,247,0.30)` }}>
                LAUNCH MKP →
              </a>
            </div>
            <div className="p-8 md:p-10 space-y-4">
              <p className="text-[9px] font-mono tracking-[0.4em] mb-6" style={{ color: P.purple }}>LIVE PLATFORM INTELLIGENCE</p>
              {[
                { platform: "Shopee", color: "#ee4d2d", deals: "8 deals tracked", avg: "Avg 34% off", trend: "▲" },
                { platform: "Lazada", color: "#0f146d", deals: "7 deals tracked", avg: "Avg 31% off", trend: "▲" },
                { platform: "TikTok Shop", color: P.purple, deals: "6 deals tracked", avg: "Avg 40% off", trend: "▼" },
              ].map(p => (
                <div key={p.platform} className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.70)", border: "1px solid rgba(168,85,247,0.12)" }}>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: P.heading }}>{p.platform}</p>
                    <p className="text-[10px] font-mono" style={{ color: P.muted }}>{p.deals}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold" style={{ color: P.purple }}>{p.avg}</p>
                    <p className="text-[10px] font-mono" style={{ color: p.trend === "▲" ? P.cyan : P.pink }}>{p.trend} trending</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)" }}>
                <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: P.purple }}>REVENUE MODEL</p>
                <p className="text-[10px] leading-relaxed" style={{ color: P.body }}>Affiliate commissions · Premium subscriptions · Sponsored placements · Institutional data licensing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.purple}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.purple }}>DEPLOYMENT PROTOCOL</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.purple}30)` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Client Intake", desc: "Register the client — industry, objectives, pain points, and growth targets.", color: P.cyan },
            { step: "02", title: "Graham Config", desc: "Bloom Society engineers configure a Graham with the exact module stack needed.", color: P.purple },
            { step: "03", title: "Deployment", desc: "Graham is launched into the client's operational environment with full command access.", color: P.pink },
            { step: "04", title: "Continuous Intel", desc: "All data, reports, and insights flow exclusively to Bloom Society principals.", color: P.orange },
          ].map(s => (
            <div key={s.step} className="rounded-xl p-5 backdrop-blur-sm transition-all hover:shadow-md"
              style={{ background: P.card, border: `1px solid ${s.color}28` }}>
              <div className="font-mono text-2xl font-bold mb-3" style={{ color: s.color }}>{s.step}</div>
              <div className="text-sm font-semibold mb-2" style={{ color: P.heading }}>{s.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: P.body }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NFT Widget */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.pink}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.pink }}>THE BLOOM SOCIETY — ON-CHAIN</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.pink}30)` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            <div>
              <p className="text-[9px] font-mono tracking-[0.35em] mb-2" style={{ color: P.purple }}>MEMBERSHIP NFT</p>
              <h3 className="text-2xl font-serif font-bold mb-3" style={{ color: P.heading }}>Bloom Society Collection</h3>
              <p className="text-sm leading-relaxed" style={{ color: P.body }}>
                Bloom Society membership is encoded on-chain. Each NFT represents a verified principal stake in the Dantès ecosystem — granting access to private Graham deployments, institutional deal flow, and lifetime platform revenue participation.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Chain", value: "Ethereum" },
                { label: "Standard", value: "ERC-721" },
                { label: "Marketplace", value: "OpenSea — @Thebloomsociety" },
                { label: "Utility", value: "Platform access · Revenue share · Governance" },
              ].map(r => (
                <div key={r.label} className="flex items-start justify-between gap-4 py-2"
                  style={{ borderBottom: "1px solid rgba(168,85,247,0.12)" }}>
                  <span className="text-[10px] font-mono uppercase tracking-widest shrink-0" style={{ color: P.muted }}>{r.label}</span>
                  <span className="text-[10px] font-mono text-right" style={{ color: P.body }}>{r.value}</span>
                </div>
              ))}
            </div>
            <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono font-bold text-xs rounded-full transition-all tracking-widest hover:opacity-90 w-fit text-white"
              style={{ background: `linear-gradient(135deg,${P.purple},${P.pink})`, boxShadow: `0 4px 20px rgba(236,72,153,0.28)` }}>
              VIEW ON OPENSEA ↗
            </a>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden backdrop-blur-sm"
              style={{ background: P.card, border: "1px solid rgba(168,85,247,0.20)" }}>
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(168,85,247,0.12)" }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.purple }} />
                  <span className="text-[9px] font-mono tracking-widest" style={{ color: P.purple }}>LATEST MINTS — THEBLOOMSOCIETY</span>
                </div>
                <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="text-[9px] font-mono transition-colors" style={{ color: P.muted }}>opensea.io ↗</a>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { id: "#001", name: "Roman Fortuna Opulenta", rarity: "Legendary", color: "#FFB300", img: "/nft-roman.png", traits: [{ k: "Setting", v: "Roman Treasury Hall" }, { k: "Script", v: "Classical Latin" }, { k: "Material", v: "Marble & Stone" }, { k: "Aura", v: "Imperial Gold" }] },
                  { id: "#002", name: "Kubera Vedic Abundance", rarity: "Legendary", color: P.purple, img: "/nft-kubera.png", traits: [{ k: "Setting", v: "Vedic Temple Sanctuary" }, { k: "Script", v: "Sacred Sanskrit" }, { k: "Material", v: "Dark Carved Stone" }, { k: "Aura", v: "Cosmic Blue" }] },
                  { id: "#003", name: "Odinic Fehu Auja", rarity: "Epic", color: P.cyan, img: "/nft-odinic.png", traits: [{ k: "Setting", v: "Glacial Halls of Valhalla" }, { k: "Script", v: "Elder Futhark Runes" }, { k: "Material", v: "Ice & Forged Silver" }, { k: "Aura", v: "Arctic Storm" }] },
                  { id: "#004", name: "Caishen Gold Mountain", rarity: "Epic", color: "#34d399", img: "/nft-caishen.png", traits: [{ k: "Setting", v: "Ancient Pillared Hall" }, { k: "Script", v: "Traditional Chinese" }, { k: "Material", v: "Blue Lightning Crystal" }, { k: "Aura", v: "Thunder Wealth" }] },
                ].map(nft => (
                  <a key={nft.id} href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                    className="group block rounded-xl overflow-hidden transition-all hover:shadow-md"
                    style={{ border: `1px solid ${nft.color}30` }}>
                    <div className="aspect-square relative overflow-hidden"
                      style={{ background: "#f8f8ff" }}>
                      <img src={nft.img} alt={nft.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full text-[7px] font-mono font-bold"
                        style={{ background: `${nft.color}33`, color: nft.color, border: `1px solid ${nft.color}55` }}>
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-2" style={{ borderTop: `1px solid ${nft.color}20` }}>
                      <p className="text-[9px] font-mono font-bold leading-snug mb-1" style={{ color: P.heading }}>{nft.name}</p>
                      <p className="text-[8px] font-mono mb-1.5" style={{ color: nft.color }}>{nft.id} · {nft.rarity}</p>
                      <div className="space-y-0.5">
                        {nft.traits.map(t => (
                          <div key={t.k} className="flex items-center justify-between gap-1">
                            <span className="text-[7px] font-mono uppercase tracking-wide" style={{ color: P.muted }}>{t.k}</span>
                            <span className="text-[7px] font-mono" style={{ color: P.body }}>{t.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="px-4 pb-4">
                <a href="https://opensea.io/Thebloomsociety" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 font-mono text-[10px] font-bold rounded-full transition-all hover:opacity-90 text-white tracking-widest"
                  style={{ background: `linear-gradient(135deg,${P.purple},${P.pink})` }}>
                  VIEW FULL COLLECTION ON OPENSEA
                </a>
              </div>
            </div>
            <div className="rounded-xl px-4 py-3 flex items-center justify-between backdrop-blur-sm"
              style={{ background: P.card, border: "1px solid rgba(168,85,247,0.14)" }}>
              <span className="text-[9px] font-mono" style={{ color: P.muted }}>Blockchain-verified · Immutable ownership · Scarce supply</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.purple }} />
                <span className="text-[9px] font-mono" style={{ color: P.purple }}>MINTING OPEN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Bangkok */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${P.cyan}30)` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: P.cyan }}>BUILT FOR BANGKOK</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${P.cyan}30)` }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl p-8 backdrop-blur-sm"
            style={{ background: P.card, border: `1px solid ${P.cyan}22` }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🇹🇭</span>
              <div>
                <p className="text-[9px] font-mono tracking-[0.35em]" style={{ color: P.cyan }}>THAILAND OPERATIONS</p>
                <h3 className="font-serif font-bold text-lg" style={{ color: P.heading }}>Bangkok-First Intelligence</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: P.body }}>
              Dantès was built for the pace of Bangkok. Your Graham understands Thai VAT, BOI incentives, SET market dynamics, and the rhythm of deals done over dinner at Sindhorn.
            </p>
            <div className="space-y-3">
              {[
                { icon: "🏦", label: "Thai Financial Compliance", desc: "VAT, WHT, BOI filings — automated and audit-ready" },
                { icon: "📊", label: "SET & Market Intelligence", desc: "Institutional-grade Thai market signals in your Graham" },
                { icon: "🤝", label: "Enterprise Client Network", desc: "Kasikorn AM, SCB AM, PTT, Central Pattana & more" },
                { icon: "🛒", label: "Thai Consumer Layer (MKP)", desc: "Shopee, Lazada, TikTok Shop — local deal intelligence" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 py-3"
                  style={{ borderBottom: `1px solid rgba(34,211,238,0.12)` }}>
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: P.heading }}>{item.label}</p>
                    <p className="text-[10px] leading-relaxed" style={{ color: P.muted }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Link href={isSignedIn ? "/portal/club" : "/sign-in"}
              className="block rounded-xl p-5 backdrop-blur-sm hover:shadow-lg transition-all group"
              style={{ background: `linear-gradient(135deg,rgba(168,85,247,0.08),rgba(236,72,153,0.06))`, border: `1px solid rgba(168,85,247,0.22)` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg" style={{ color: P.purple }}>✦</span>
                  <div>
                    <p className="text-[9px] font-mono tracking-widest" style={{ color: P.purple }}>MEMBERS ONLY</p>
                    <h4 className="font-bold text-sm" style={{ color: P.heading }}>The Club Room</h4>
                  </div>
                </div>
                <span className="text-[9px] font-mono transition-colors" style={{ color: P.pink }}>ENTER →</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: P.body }}>
                Private deal wall · Exclusive events · Member directory. Where Bloom Society principals meet, share, and close.
              </p>
              <div className="flex gap-2 mt-3">
                {["DEAL WALL", "EVENTS BKK", "MEMBERS"].map(tag => (
                  <span key={tag} className="text-[8px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(168,85,247,0.10)", border: `1px solid rgba(168,85,247,0.25)`, color: P.purple }}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <div className="rounded-2xl p-10 text-center overflow-hidden relative backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.70)", border: "1px solid rgba(168,85,247,0.22)", boxShadow: "0 20px 60px rgba(168,85,247,0.12)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top, rgba(168,85,247,0.07) 0%, transparent 65%)` }} />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: `linear-gradient(135deg,${P.cyan},${P.purple},${P.pink})`, boxShadow: `0 8px 32px rgba(168,85,247,0.35)` }}>
              <span className="text-white text-2xl font-serif font-bold">✦</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: `${P.orange}15`, border: `1px solid ${P.orange}35` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.orange }} />
              <span className="text-[9px] font-mono tracking-widest" style={{ color: P.orange }}>{spotsLeft} SPOTS LEFT THIS QUARTER</span>
            </div>
            <p className="text-[9px] font-mono tracking-[0.4em] mb-3" style={{ color: P.purple }}>RESTRICTED MEMBERSHIP</p>
            <h2 className="text-3xl font-serif font-black mb-4" style={{ color: P.heading }}>Join the Bloom Society</h2>
            <p className="text-sm leading-relaxed max-w-xl mx-auto mb-8" style={{ color: P.body }}>
              Every Bloom Society member receives a custom Graham agent — a precision AI built exclusively for their business. We accept a limited number of members each quarter. Applications are reviewed personally by Dr. Graham and Dr. Prabhakar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-2xl mx-auto">
              {[
                { n: "01", t: "Apply", d: "Complete our confidential intake form. Tell us your business and what you need your Graham to achieve.", color: P.cyan },
                { n: "02", t: "Quotation", d: "We design your bespoke Graham configuration and send a personalised investment proposal.", color: P.purple },
                { n: "03", t: "Deploy", d: "Upon onboarding, your Graham is activated 24/7 and your Bloom Society credentials are issued.", color: P.pink },
              ].map(s => (
                <div key={s.n} className="rounded-xl p-4 backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.60)", border: `1px solid ${s.color}28` }}>
                  <span className="font-mono font-bold text-sm block mb-2" style={{ color: s.color }}>{s.n}</span>
                  <p className="text-xs font-semibold mb-1" style={{ color: P.heading }}>{s.t}</p>
                  <p className="text-[10px] leading-relaxed" style={{ color: P.body }}>{s.d}</p>
                </div>
              ))}
            </div>
            <Link href="/join"
              className="inline-block px-8 py-3.5 text-white font-mono font-bold text-sm rounded-full hover:opacity-90 hover:scale-105 transition-all tracking-widest"
              style={{ background: `linear-gradient(135deg,${P.cyan},${P.purple},${P.pink})`, boxShadow: `0 8px 40px rgba(168,85,247,0.40)` }}>
              WANT TO BUILD YOUR EMPIRE? APPLY HERE →
            </Link>
            <p className="text-[9px] font-mono mt-4" style={{ color: P.muted }}>Applications reviewed within 48–72 hours · Bangkok · Dubai · Global</p>
          </div>
        </div>
      </section>

      {/* Stash Pro */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,rgba(52,211,153,0.30))` }} />
          <span className="text-[9px] font-mono tracking-[0.4em]" style={{ color: "#34d399" }}>PORTFOLIO CLIENT</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,rgba(52,211,153,0.30))` }} />
        </div>
        <div className="rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 backdrop-blur-sm hover:shadow-xl transition-all group"
          style={{ background: P.card, border: "1px solid rgba(52,211,153,0.22)" }}>
          <div className="shrink-0">
            <Link href="/stash-pro">
              <div className="relative cursor-pointer group/logo">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl flex flex-col items-center justify-center gap-1"
                  style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.28)", boxShadow: "0 0 40px rgba(52,211,153,0.12)" }}>
                  <span className="font-mono font-black text-2xl md:text-3xl tracking-widest" style={{ color: "#34d399" }}>STASH</span>
                  <div className="w-10 h-px" style={{ background: "rgba(52,211,153,0.4)" }} />
                  <span className="font-mono font-black text-2xl md:text-3xl tracking-widest" style={{ color: P.heading }}>PRO</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono tracking-[0.35em]" style={{ color: "#34d399" }}>ACTIVE CLIENT · DIGITAL OPERATIONS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight" style={{ color: P.heading }}>
              Stash Pro — <span style={{ color: "#34d399" }}>Premium Smoking Accessories</span>
            </h2>
            <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: P.body }}>
              Stash Pro is one of India's leading smoking accessories brands. Dantès manages their digital intelligence layer, including brand strategy, export pipeline and B2B expansion.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {["Lighters", "Grinders", "Ashtrays", "Rolling Trays", "Sheesha", "Pre-Rolled Cones", "Storage Jars"].map(tag => (
                <span key={tag} className="px-3 py-1 text-[9px] font-mono tracking-wider rounded-full"
                  style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" }}>
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/stash-pro"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono font-bold text-xs rounded-full transition-all hover:opacity-90 text-white"
              style={{ background: "linear-gradient(135deg,#34d399,#059669)", boxShadow: "0 4px 20px rgba(52,211,153,0.30)" }}>
              EXPLORE THE FULL COLLECTION →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-20 px-8 text-center" style={{ borderTop: "1px solid rgba(168,85,247,0.12)" }}>
        <p className="text-[9px] font-mono tracking-[0.4em] mb-4" style={{ color: P.muted }}>RESTRICTED ACCESS — BLOOM SOCIETY OPERATORS ONLY</p>
        <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: P.heading }}>Ready to deploy a Graham?</h2>
        <p className="max-w-lg mx-auto text-sm mb-8" style={{ color: P.body }}>
          Register a client, configure their Graham's module stack, and deploy a precision AI agent calibrated to their exact business context.
        </p>
        <Link href={isSignedIn ? "/command" : "/sign-in"}
          className="inline-block px-8 py-3.5 text-white font-mono font-bold text-sm rounded-full hover:opacity-90 hover:scale-105 transition-all tracking-widest"
          style={{ background: `linear-gradient(135deg,${P.cyan},${P.purple},${P.pink})`, boxShadow: `0 8px 32px rgba(168,85,247,0.35)` }}>
          ACCESS COMMAND CENTER →
        </Link>
      </section>

      <footer className="relative z-10 py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: "1px solid rgba(168,85,247,0.10)" }}>
        <span className="text-[10px] font-mono" style={{ color: P.muted }}>© 2026 The Bloom Society · Dr. Steven Graham & Dr. Akshay Prabhakar · Bangkok</span>
        <span className="text-[9px] font-mono tracking-widest"
          style={{ background: `linear-gradient(90deg,${P.cyan},${P.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          DANTÈS v1.0 · ALL DATA CLASSIFIED
        </span>
      </footer>
    </div>
  );
}
