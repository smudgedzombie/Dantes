import { useEffect, useRef, useState } from "react";
import { Terminal, Activity, Lock, Globe, ArrowRight, CornerDownRight, Zap, ShieldAlert, Cpu } from "lucide-react";

function CinematicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // --- Particles ---
    const PARTICLE_COUNT = 280;
    type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number; opacitySpeed: number; color: string };
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.18 - 0.04,
      size: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.5 + 0.05,
      opacitySpeed: (Math.random() - 0.5) * 0.003,
      color: Math.random() > 0.6 ? "#FFB300" : Math.random() > 0.5 ? "#FF6B00" : "#FFC842",
    }));

    // --- Network nodes ---
    const NODE_COUNT = 22;
    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.06,
      r: Math.random() * 2 + 0.5,
    }));

    // --- Orbiting ring ---
    type Ring = { cx: number; cy: number; rx: number; ry: number; angle: number; speed: number; opacity: number };
    const rings: Ring[] = [
      { cx: 0.5, cy: 0.45, rx: 0.38, ry: 0.14, angle: 0, speed: 0.0003, opacity: 0.07 },
      { cx: 0.5, cy: 0.45, rx: 0.25, ry: 0.09, angle: Math.PI / 3, speed: -0.0005, opacity: 0.05 },
      { cx: 0.5, cy: 0.45, rx: 0.48, ry: 0.18, angle: Math.PI / 6, speed: 0.00018, opacity: 0.04 },
    ];

    // --- Light sweep state ---
    let sweepX = -0.3;

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Deep dark base
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, w, h);

      // Central ambient glow — slow breathing
      const breathe = 0.7 + 0.3 * Math.sin(t * 0.0008);
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, w * 0.45);
      grad.addColorStop(0, `rgba(255,179,0,${0.055 * breathe})`);
      grad.addColorStop(0.5, `rgba(255,107,0,${0.018 * breathe})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Orbiting ellipses
      rings.forEach((ring) => {
        ring.angle += ring.speed;
        ctx.save();
        ctx.translate(w * ring.cx, h * ring.cy);
        ctx.rotate(ring.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, w * ring.rx, h * ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,179,0,${ring.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
      });

      // Network mesh
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -50) n.x = w + 50;
        if (n.x > w + 50) n.x = -50;
        if (n.y < -50) n.y = h + 50;
        if (n.y > h + 50) n.y = -50;
      });

      const LINK_DIST = 200;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,179,0,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,179,0,0.25)";
        ctx.fill();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacitySpeed;
        if (p.opacity < 0.02) { p.opacity = 0.02; p.opacitySpeed *= -1; }
        if (p.opacity > 0.55) { p.opacity = 0.55; p.opacitySpeed *= -1; }
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const hex = p.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();
      });

      // Light sweep — slow diagonal beam, 14-second cycle
      sweepX += 0.00042;
      if (sweepX > 1.3) sweepX = -0.3;
      const sx = w * sweepX;
      const sweepGrad = ctx.createLinearGradient(sx - 180, 0, sx + 180, h);
      sweepGrad.addColorStop(0, "rgba(255,179,0,0)");
      sweepGrad.addColorStop(0.5, "rgba(255,179,0,0.028)");
      sweepGrad.addColorStop(1, "rgba(255,179,0,0)");
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, w, h);

      // Scanline overlay (very subtle)
      for (let y = 0; y < h; y += 3) {
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(0, y, w, 1);
      }

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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

export function CyberGoldHero() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [text, setText] = useState("");
  const fullText = "COMMAND YOUR CAPITAL";
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif" }} className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <style>{`
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        .glow-amber { text-shadow: 0 0 18px rgba(255,179,0,0.6); }
        .glow-orange { text-shadow: 0 0 14px rgba(255,107,0,0.5); }
        .border-glow-amber { box-shadow: 0 0 18px rgba(255,179,0,0.25), inset 0 0 12px rgba(255,179,0,0.08); border-color: rgba(255,179,0,0.55); }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: ticker 24s linear infinite; }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes pulse-ring { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
      `}</style>

      {/* Ticker */}
      <div className="fixed top-0 left-0 w-full bg-black/90 border-b border-[#FFB300]/15 py-1.5 z-50 overflow-hidden font-tech text-xs tracking-wider text-[#FFB300]/70 flex">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <span>SET: 1,423.81 <span className="text-[#FFB300]">+1.2%</span></span>
              <span>BTC: ฿2,450,192 <span className="text-[#FF6B00]">-0.4%</span></span>
              <span>SIRI: 1.84 <span className="text-[#FFB300]">+2.1%</span></span>
              <span>AOT: 68.50 <span className="text-[#FFB300]">+0.5%</span></span>
              <span>PTT: 34.25 <span className="text-red-500/80">-1.1%</span></span>
              <span>ETH: ฿112,400 <span className="text-[#FFB300]">+3.4%</span></span>
              <span>CPALL: 56.75 <span className="text-[#FFB300]">+0.2%</span></span>
              <span>XAU: ฿98,240 <span className="text-[#FF6B00]">+0.8%</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-40 pt-[52px] pb-5 px-8 flex justify-between items-center border-b border-white/5 max-w-7xl mx-auto">
        <div className="font-tech text-xl font-bold tracking-widest flex items-center gap-2 glow-amber">
          <Globe className="w-5 h-5 text-[#FFB300]" />
          DANTÈS<span className="text-[#FFB300]">.SYS</span>
        </div>
        <div className="hidden md:flex gap-8 font-tech text-sm tracking-widest text-white/50">
          <a href="#" className="hover:text-[#FFB300] transition-colors">INTELLIGENCE</a>
          <a href="#" className="hover:text-[#FFB300] transition-colors">AGENTS</a>
          <a href="#" className="hover:text-[#FFB300] transition-colors">NETWORK</a>
        </div>
        <button className="font-tech text-xs border border-[#FFB300]/30 text-[#FFB300] px-4 py-2 hover:bg-[#FFB300]/10 transition-colors flex items-center gap-2">
          <Lock className="w-3 h-3" /> LOGIN
        </button>
      </nav>

      {/* HERO — cinematic background */}
      <section className="relative flex flex-col items-center justify-center text-center z-10 min-h-[92vh] overflow-hidden">
        {/* Cinematic canvas sits behind everything */}
        <CinematicCanvas />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center px-8 py-20">
          <div className="inline-block border border-[#FFB300]/30 px-4 py-1.5 mb-8 font-tech text-sm text-[#FFB300] tracking-widest bg-black/60 backdrop-blur-sm">
            SYS.STATUS: <span className="text-[#FFB300] glow-amber">ONLINE</span>
            <span className="ml-3 inline-block w-2 h-2 rounded-full bg-[#FFB300] animate-pulse-ring align-middle" />
          </div>

          <h1 className="font-tech text-[clamp(5rem,14vw,9rem)] font-bold tracking-tighter mb-3 text-white glow-amber leading-none">
            DANTÈS
          </h1>

          <div className="font-rajdhani text-2xl md:text-[2.2rem] text-[#FFB300] tracking-[0.22em] mb-10 h-12 glow-orange font-semibold uppercase">
            {text}<span className="animate-blink">_</span>
          </div>

          <p className="font-rajdhani text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-12 tracking-wide font-light leading-relaxed">
            The apex command platform for Bangkok's elite. Algorithmic precision meets unparalleled access. Your wealth, weaponized.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 font-tech tracking-widest">
            <button className="bg-[#FFB300]/12 border border-[#FFB300] text-[#FFB300] px-8 py-4 border-glow-amber hover:bg-[#FFB300] hover:text-black transition-all flex items-center justify-center gap-3 group">
              <Terminal className="w-5 h-5 group-hover:animate-pulse" />
              ACCESS TERMINAL
            </button>
            <button className="border border-white/15 text-white/60 px-8 py-4 hover:border-[#FFB300]/40 hover:text-white/90 transition-colors flex items-center justify-center gap-3">
              <Activity className="w-5 h-5" />
              WATCH THE REEL
            </button>
          </div>
        </div>

        {/* Bottom fade into stats bar */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none z-20" />
      </section>

      {/* STATS BAR */}
      <section className="relative z-10 border-y border-white/8 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
          {[
            { label: "ASSETS TRACKED", value: "฿2.4B", alert: false },
            { label: "ACTIVE MEMBERS", value: "847", alert: false },
            { label: "SIGNAL ACCURACY", value: "99.7%", alert: false },
            { label: "SEATS REMAINING", value: "7 / 120", alert: true },
          ].map((stat, i) => (
            <div key={i} className="p-7 flex flex-col items-center md:items-start relative group">
              <div className="absolute inset-0 bg-[#FFB300]/4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-2 font-tech text-xs text-white/35 tracking-widest">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${stat.alert ? "bg-[#FF6B00]" : "bg-[#FFB300]"}`} />
                {stat.label}
              </div>
              <div className={`font-rajdhani text-3xl font-bold tracking-wider ${stat.alert ? "text-[#FF6B00]" : "text-white"}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTS */}
      <section className="relative z-10 py-28 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-14">
          <div className="font-tech text-[#FFB300] text-xs tracking-widest mb-4 flex items-center gap-2">
            <CornerDownRight className="w-4 h-4" /> MODULE.01
          </div>
          <h2 className="font-rajdhani text-4xl md:text-5xl font-bold tracking-widest uppercase">
            GRAHAM <span className="text-[#FFB300] glow-amber">AGENTS</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[
            { title: "ALPHA SCOUT", icon: <Zap className="w-8 h-8 text-[#FFB300]" />, desc: "Autonomous market scanning across SET & crypto. Identifies asymmetrical opportunities before they trend.", status: "ACTIVE" },
            { title: "RISK SENTINEL", icon: <ShieldAlert className="w-8 h-8 text-[#FF6B00]" />, desc: "24/7 portfolio protection. Executes dynamic hedging strategies when volatility spikes.", status: "ACTIVE" },
            { title: "PORTFOLIO ARCHITECT", icon: <Cpu className="w-8 h-8 text-[#FFB300]" />, desc: "Deep-learning driven asset allocation tailored to your specific risk-return profile.", status: "TRAINING" },
          ].map((agent, i) => (
            <div key={i} className="bg-black/70 border border-white/8 p-8 hover:border-[#FFB300]/40 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 font-tech text-[10px] tracking-widest text-white/20">SYS_ID: 00{i + 1}</div>
              <div className="mb-6 p-3 bg-white/4 inline-block border border-transparent group-hover:border-[#FFB300]/20 transition-colors">
                {agent.icon}
              </div>
              <h3 className="font-rajdhani text-2xl font-semibold tracking-wider mb-3">{agent.title}</h3>
              <p className="font-tech text-sm text-white/45 leading-relaxed mb-8">{agent.desc}</p>
              <div className="flex items-center justify-between border-t border-white/8 pt-4 font-tech text-xs tracking-widest">
                <span className="text-white/30">STATUS:</span>
                <span className={agent.status === "ACTIVE" ? "text-[#FFB300] glow-amber" : "text-[#FF6B00]"}>{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-20 bg-black/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {[
              { quote: "It replaces a family office of five with one terminal. The Alpha Scout found a dislocation in Sathorn real estate trusts before my brokers even woke up.", author: "C. T., Silom", role: "PRIVATE EQUITY DIRECTOR" },
              { quote: "The interface is aggressive, but the logic is flawless. I've routed all my crypto staking and SET equities through Dantès. It's the only platform I trust now.", author: "K. W., Ploenchit", role: "TECH FOUNDER" },
            ].map((t, i) => (
              <div key={i} className="relative p-[1px] bg-gradient-to-b from-[#FFB300]/20 to-transparent">
                <div className="bg-[#080808] p-10 h-full">
                  <div className="font-tech text-4xl text-[#FFB300]/15 mb-5 glow-amber">"</div>
                  <p className="font-rajdhani text-xl text-white/75 leading-relaxed mb-8 font-light">{t.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-[#FFB300]/8 border border-[#FFB300]/20 flex items-center justify-center font-tech text-sm text-[#FFB300]">{t.author[0]}</div>
                    <div>
                      <div className="font-tech text-sm tracking-widest text-white">{t.author}</div>
                      <div className="font-tech text-xs tracking-widest text-[#FFB300]/55">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative z-10 py-28 px-8 max-w-3xl mx-auto text-center">
        <div className="inline-block border border-[#FF6B00]/30 px-4 py-1.5 mb-8 font-tech text-xs text-[#FF6B00] tracking-widest bg-[#FF6B00]/5">
          STRICTLY INVITE ONLY — 7 OF 120 SEATS REMAINING
        </div>
        <h2 className="font-rajdhani text-4xl md:text-5xl font-bold tracking-widest uppercase mb-8">
          INITIALIZE <span className="text-[#FFB300] glow-amber">SEQUENCE</span>
        </h2>
        <form className="flex flex-col md:flex-row gap-4 mb-8 font-tech">
          <input type="email" placeholder="ENTER ENCRYPTED COMMS (EMAIL)" className="flex-1 bg-black border border-white/15 px-6 py-4 text-white placeholder-white/25 focus:outline-none focus:border-[#FFB300]/60 transition-colors tracking-widest text-sm" />
          <button type="button" className="bg-[#FFB300] text-black px-8 py-4 font-bold tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            REQUEST ACCESS <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="font-tech text-xs text-white/30 tracking-widest">ACCESS IS SUBJECT TO BOARD APPROVAL. MINIMUM AUM REQUIREMENTS APPLY.</p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/8 py-7 px-8 font-tech text-xs text-white/25 tracking-widest text-center flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div>&copy; {new Date().getFullYear()} THE BLOOM SOCIETY. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#FFB300] transition-colors">SECURE ENCLAVE</a>
          <a href="#" className="hover:text-[#FFB300] transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-[#FFB300] transition-colors">SYS.LOGS</a>
        </div>
      </footer>
    </div>
  );
}
