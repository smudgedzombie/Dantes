
// Variant D — Bright Edge
// Bg: #111111 neutral dark, body text #e0c87a (brightest), crisper gold borders

const MODULES = [
  { id: "financial", label: "Financial Engine", icon: "◈", desc: "Revenue modeling, P&L, tax compliance, VAT/WHT, payment plans" },
  { id: "marketing", label: "Marketing Command", icon: "◉", desc: "Brand strategy, digital campaigns, events calendar, social velocity" },
  { id: "operations", label: "Operations Core", icon: "◎", desc: "Daily reminders, task automation, SOP management, staff coordination" },
  { id: "compliance", label: "Compliance Shield", icon: "◆", desc: "Tax returns, licenses, regulatory filings, audit-ready documentation" },
  { id: "export_b2b", label: "Export & B2B Gateway", icon: "◇", desc: "Global market entry, B2B portals, online payment gateways, trade finance" },
  { id: "events", label: "Events Accelerator", icon: "✦", desc: "Revenue events, launch campaigns, partnership activations, footfall drives" },
];

const AGENTS = [
  { code: "GRM01", client: "The Amber Club", industry: "Food & Beverage", status: "active", modules: ["Financial Engine","Marketing Command","Events Accelerator"] },
  { code: "GRM02", client: "NovaTex Industries", industry: "Manufacturing / Export", status: "active", modules: ["Financial Engine","Export & B2B Gateway","Compliance Shield"] },
  { code: "GRM03", client: "Meridian Health Group", industry: "Healthcare", status: "standby", modules: ["Operations Core","Compliance Shield","Financial Engine"] },
];

const D = {
  bg: "#111111",
  cardBg: "#181818",
  bodyText: "#e0c87a",       // brightest — almost gold-white
  subText: "#a89050",
  mutedText: "#786840",
  borderBase: "rgba(255,179,0,0.25)",
  borderHover: "rgba(255,179,0,0.50)",
  gridLine: "rgba(255,179,0,0.022)",
};

export default function VariantD() {
  return (
    <div style={{ minHeight: "100vh", background: D.bg, color: "white", fontFamily: "system-ui, sans-serif", overflowX: "hidden", position: "relative" }}>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${D.gridLine} 1px,transparent 1px),linear-gradient(90deg,${D.gridLine} 1px,transparent 1px)`,
        backgroundSize: "60px 60px" }} />

      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 999, background: "#FFB300", color: "#080808", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 2, letterSpacing: "0.2em", fontFamily: "monospace" }}>
        D — BRIGHT EDGE
      </div>

      <nav style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: `1px solid ${D.borderBase}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontWeight: 900, color: "white", letterSpacing: "0.2em", fontSize: 18 }}>DANTÈS</span>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,179,0,0.75)", letterSpacing: "0.35em" }}>THE BLOOM SOCIETY</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#FFB300", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFB300", display: "inline-block" }} />
            SYSTEM OPERATIONAL
          </span>
          <button style={{ padding: "8px 20px", background: "#FFB300", color: "#111111", fontSize: 11, fontFamily: "monospace", fontWeight: 700, border: "none", borderRadius: 2, letterSpacing: "0.15em", cursor: "pointer", boxShadow: "0 0 24px rgba(255,179,0,0.32)" }}>
            AUTHORIZE ACCESS
          </button>
        </div>
      </nav>

      <section style={{ position: "relative", zIndex: 10, minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px 48px" }}>
        <div style={{ position: "relative", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "8px 16px", border: "1px solid rgba(255,107,0,0.55)", background: "rgba(255,107,0,0.10)", borderRadius: 2, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00" }} />
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#FF6B00", letterSpacing: "0.3em" }}>Q3 2026 INTAKE — 7 SPOTS REMAINING</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00" }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,179,0,0.78)", letterSpacing: "0.4em" }}>THAILAND-BORN · GLOBALLY DEPLOYED</span>
          </div>

          <h1 style={{ fontSize: "clamp(5rem,12vw,10rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", margin: "0 0 8px", lineHeight: 1, textShadow: "0 0 60px rgba(255,179,0,0.35)" }}>
            DANTÈS
          </h1>

          <div style={{ color: "#FFB300", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.45em", marginBottom: 24 }}>
            THE BLOOM SOCIETY — AI COMMAND · FORENSIC FINANCE · SMART LIVING
          </div>

          <div style={{ height: 40, display: "flex", alignItems: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>LIVE SMARTER.<span style={{ color: "#FFB300" }}>|</span></span>
          </div>

          <p style={{ color: D.bodyText, maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
            For the Bangkok elite who operate on instinct, data, and ambition — Dantès deploys a custom AI agent called a{" "}
            <span style={{ color: "#FFB300", fontFamily: "monospace", fontWeight: 600 }}>Graham</span>{" "}
            into your business. It runs 24/7. It never sleeps. It handles everything so you can focus on what you do best:{" "}
            <span style={{ color: "white", fontWeight: 700 }}>winning.</span>
          </p>

          <div style={{ display: "flex", gap: 24, marginBottom: 40, fontSize: 10, fontFamily: "monospace", color: D.subText, flexWrap: "wrap", justifyContent: "center" }}>
            <span>◆ Bangkok HQ</span>
            <span style={{ color: "rgba(255,179,0,0.25)" }}>|</span>
            <span>◆ Thai Enterprise Clients</span>
            <span style={{ color: "rgba(255,179,0,0.25)" }}>|</span>
            <span>◆ THB · USD · Multi-currency</span>
          </div>

          <button style={{ padding: "14px 32px", background: "#FFB300", color: "#111111", fontFamily: "monospace", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 2, letterSpacing: "0.15em", cursor: "pointer", boxShadow: "0 0 40px rgba(255,179,0,0.45)" }}>
            CLAIM YOUR SPOT — APPLY NOW →
          </button>
        </div>
      </section>

      <div style={{ position: "relative", zIndex: 10, borderTop: `1px solid ${D.borderBase}`, borderBottom: `1px solid ${D.borderBase}`, padding: "20px 32px", background: "rgba(17,17,17,0.95)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          {[
            { label: "Graham Agents", value: "GRM01–∞", sub: "Infinitely scalable" },
            { label: "Capability Modules", value: "06", sub: "Financial · Marketing · Compliance +" },
            { label: "Backend Access", value: "RESTRICTED", sub: "Bloom Society principals only" },
            { label: "System Status", value: "LIVE", sub: "All nodes nominal · BKK" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: "#FFB300", fontFamily: "monospace", fontWeight: 700, fontSize: 20, marginBottom: 2 }}>{s.value}</div>
              <div style={{ color: "white", fontSize: 12, marginBottom: 2 }}>{s.label}</div>
              <div style={{ color: D.subText, fontSize: 10, fontFamily: "monospace" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <section style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div style={{ height: 1, flex: 1, background: D.borderBase }} />
          <span style={{ fontSize: 9, fontFamily: "monospace", color: "#FFB300", letterSpacing: "0.4em" }}>THE CASE FOR DANTÈS</span>
          <div style={{ height: 1, flex: 1, background: D.borderBase }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: "⚡", title: "Bangkok moves fast.", body: "Opportunity in BKK doesn't wait. The people closing the biggest deals aren't working harder — they have smarter leverage. Dantès is that leverage." },
            { icon: "🧠", title: "Common sense, finally automated.", body: "Most businesses fail not from lack of talent but from poor execution of obvious things: cash flow, compliance, follow-through. Graham does all of it. Flawlessly." },
            { icon: "✦", title: "The Bloom Society standard.", body: "This isn't a subscription. It's membership in a circle of operators who refuse to be average. Your Graham is bespoke. Your edge is real." },
          ].map(item => (
            <div key={item.title} style={{ border: `1px solid ${D.borderBase}`, background: D.cardBg, borderRadius: 2, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ color: "white", fontWeight: 700, fontSize: 17, marginBottom: 12 }}>{item.title}</h3>
              <p style={{ color: D.bodyText, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "0 32px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ height: 1, flex: 1, background: D.borderBase }} />
          <span style={{ fontSize: 9, fontFamily: "monospace", color: "#FFB300", letterSpacing: "0.4em" }}>ACTIVE GRAHAM DEPLOYMENTS</span>
          <div style={{ height: 1, flex: 1, background: D.borderBase }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
          {AGENTS.map(a => (
            <div key={a.code} style={{ border: `1px solid ${D.borderBase}`, background: D.cardBg, borderRadius: 2, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#FFB300", marginBottom: 4, letterSpacing: "0.15em" }}>{a.code}</div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: 13 }}>{a.client}</div>
                  <div style={{ color: D.bodyText, fontSize: 11, fontFamily: "monospace" }}>{a.industry}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 2, fontSize: 11, fontFamily: "monospace", background: a.status === "active" ? "rgba(255,179,0,0.12)" : "rgba(255,107,0,0.12)", color: a.status === "active" ? "#FFB300" : "#FF6B00" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.status === "active" ? "#FFB300" : "#FF6B00" }} />
                  {a.status.toUpperCase()}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {a.modules.map(m => (
                  <span key={m} style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 8px", background: D.bg, border: `1px solid ${D.borderBase}`, color: D.bodyText, borderRadius: 2 }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: D.subText, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.15em" }}>EACH GRAHAM IS UNIQUELY CONFIGURED — NO TWO DEPLOYMENTS ARE IDENTICAL</p>
      </section>

      <section style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ height: 1, flex: 1, background: D.borderBase }} />
          <span style={{ fontSize: 9, fontFamily: "monospace", color: "#FFB300", letterSpacing: "0.4em" }}>GRAHAM CAPABILITY MODULES</span>
          <div style={{ height: 1, flex: 1, background: D.borderBase }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {MODULES.map(m => (
            <div key={m.id} style={{ border: `1px solid ${D.borderBase}`, background: D.cardBg, borderRadius: 2, padding: 20 }}>
              <div style={{ color: "#FFB300", fontSize: 22, marginBottom: 12, fontFamily: "monospace" }}>{m.icon}</div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{m.label}</div>
              <div style={{ color: D.bodyText, fontSize: 12, lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 10, borderTop: `1px solid ${D.borderBase}`, padding: "32px", textAlign: "center" }}>
        <div style={{ color: D.subText, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.3em" }}>© 2026 THE BLOOM SOCIETY · DANTÈS FINANCE · ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}
