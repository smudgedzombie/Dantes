export function BG1Navy() {
  const bg = "#0d1b2e";
  const accent = "#FFB300";
  const text = "#ffffff";
  const sub = "#7aa8cc";
  const muted = "rgba(122,168,204,0.5)";
  const label = "BG1 — Midnight Navy";
  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg, fontFamily: "'Inter', sans-serif" }}>
      <nav className="flex items-center justify-between px-10 py-5 border-b" style={{ borderColor: "rgba(255,179,0,0.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: "rgba(255,179,0,0.15)", border: "1px solid rgba(255,179,0,0.3)" }}>
            <span className="text-xs font-black" style={{ color: accent }}>D</span>
          </div>
          <div>
            <p className="font-black text-sm tracking-widest" style={{ color: text }}>DANTÈS</p>
            <p className="text-[8px] font-mono tracking-[0.3em]" style={{ color: sub }}>THE BLOOM SOCIETY</p>
          </div>
        </div>
        <div className="px-5 py-2 text-xs font-mono font-bold tracking-widest rounded-sm" style={{ background: accent, color: "#000" }}>
          AUTHORIZE ACCESS
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,179,0,0.06) 0%, transparent 70%)` }} />
        <div className="mb-6 px-4 py-1.5 rounded-sm border text-[9px] font-mono tracking-[0.4em]" style={{ borderColor: "rgba(255,179,0,0.2)", color: accent, background: "rgba(255,179,0,0.05)" }}>
          Q3 2026 INTAKE — 7 SPOTS REMAINING
        </div>
        <p className="text-[10px] font-mono tracking-[0.5em] mb-4" style={{ color: sub }}>THAILAND-BORN · GLOBALLY DEPLOYED</p>
        <h1 className="font-black leading-none mb-6" style={{ fontSize: "clamp(5rem,12vw,9rem)", color: text, letterSpacing: "-0.02em" }}>DANTÈS</h1>
        <p className="text-xl font-mono font-bold mb-3" style={{ color: accent }}>LIVE SMARTER.</p>
        <p className="max-w-lg text-sm leading-relaxed mb-10" style={{ color: sub }}>
          For the Bangkok elite who operate on instinct, data, and ambition — Dantès deploys a custom AI agent called <span style={{ color: accent }}>Graham</span> into your business.
        </p>
        <div className="px-8 py-4 font-mono font-bold text-sm tracking-widest rounded-sm" style={{ background: accent, color: "#000" }}>
          CLAIM YOUR SPOT — APPLY NOW →
        </div>
        <div className="mt-10 flex items-center gap-6 text-[10px] font-mono" style={{ color: muted }}>
          <span>◆ Bangkok HQ</span>
          <span>◆ Thai Enterprise Clients</span>
          <span>◆ THB · USD · Multi-currency</span>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="px-4 py-1.5 rounded text-[8px] font-mono font-bold tracking-widest" style={{ background: "rgba(255,179,0,0.15)", color: accent, border: "1px solid rgba(255,179,0,0.3)" }}>{label}</div>
        </div>
      </div>
    </div>
  );
}
