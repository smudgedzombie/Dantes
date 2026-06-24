
export interface StashCfg {
  label: string;
  hex: string;
  bg: string;
  cardBg: string;
  stickyBg: string;
  headingColor: string;
  bodyText: string;
  subText: string;
  mutedText: string;
  accentText: string;      // #34d399 on dark, darker emerald on light
  borderBase: string;
  borderAccent: string;
  gridLine: string;
  mode: "dark" | "light";
}

const PRODUCTS = [
  { cat: "Lighters", icon: "🔥", count: 8, items: [
    { title: "Ez Flame Lighter", desc: "Refillable utility lighter. Reliable ignition, adjustable flame.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/ez2_3db9fcc5-b560-46df-a2ef-c8b775ac01f8.webp?v=1782113366" },
    { title: "Carlos Windproof Lighter", desc: "Flip-top metal body, windproof jet flame for outdoor use.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/L_IFGBTTRETRTRASGFDAJHFBASDA-copy-2_0003s_0004_Layer-112.png?v=1763459740" },
    { title: "Jetty Windproof Lighter", desc: "Compact windproof jet flame. Consistent outdoor ignition.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/lighter_0012s_0000_Layer-94.png?v=1763462082" },
    { title: "Fold-E Foldable Lighter", desc: "Folds flat. Full-sized flame when open. Pocket-friendly.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/P3.png?v=1763455938" },
  ]},
  { cat: "Grinders", icon: "⚙️", count: 9, items: [
    { title: "UFO Herb Grinder", desc: "Premium 4-part metal, distinctive domed profile.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/ufo3.1_9aabdd90-e595-4d4e-ab4d-08a9a7de299a.png?v=1781324407" },
    { title: "Large Neon Grinder", desc: "Full-size 4-part metal, bold neon finish in 5 colours.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/neonl1.png?v=1762937003" },
    { title: "Glow in the Dark Grinder", desc: "Charges under light, shines in the dark. 4 colours.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/dark3_66880328-b4de-402c-a476-c2e1abbab2f6.png?v=1781324407" },
    { title: "Pink Grinder", desc: "Full-size 4-part metal grinder in bold pink.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/pink1.png?v=1762934376" },
  ]},
  { cat: "Rolling Trays", icon: "🗂️", count: 8, items: [
    { title: "Wooden Rolling Tray", desc: "Natural wood, smooth surface, raised edges. Premium feel.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/WOODS3_0.75x.png?v=1762860827" },
    { title: "Small Rolling Tray", desc: "Compact metal, 6 designs. Wipe-clean surface.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/S5.png?v=1762849323" },
    { title: "Medium Rolling Tray — Classic", desc: "Mid-size metal, timeless design. Easy to wipe clean.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/MEDIUMTRAY4.png?v=1762847785" },
    { title: "Oval Metal Tray", desc: "Compact oval shape, 4 metallic colours.", img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/rn-image_picker_lib_temp_a3d21664-6bdc-4609-9c62-9c7f50b934f5.png?v=1781324553" },
  ]},
];

export function StashVariant({ cfg }: { cfg: StashCfg }) {
  return (
    <div style={{ minHeight: "100vh", background: cfg.bg, fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>

      {/* Label */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 999, background: "#34d399", color: "#040c04", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 2, letterSpacing: "0.15em", fontFamily: "monospace" }}>
        {cfg.label} — {cfg.hex}
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "96px 24px" }}>
        {/* Radial glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(52,211,153,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, justifyContent: "center" }}>
            <div style={{ height: 1, width: 64, background: "rgba(52,211,153,0.30)" }} />
            <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.5em", color: cfg.accentText }}>OFFICIAL PRODUCT SHOWCASE</span>
            <div style={{ height: 1, width: 64, background: "rgba(52,211,153,0.30)" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 2, marginBottom: 16, border: `1px solid ${cfg.borderAccent}`, background: cfg.mode === "dark" ? "rgba(52,211,153,0.05)" : "rgba(52,211,153,0.08)" }}>
              <span style={{ color: "#34d399", fontFamily: "monospace", fontWeight: 900, fontSize: 28, letterSpacing: "0.12em" }}>STASH</span>
              <div style={{ width: 1, height: 32, background: cfg.borderAccent }} />
              <span style={{ color: cfg.headingColor, fontFamily: "monospace", fontWeight: 900, fontSize: 28, letterSpacing: "0.12em" }}>PRO</span>
            </div>
            <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.35em", color: cfg.accentText, opacity: 0.6 }}>PREMIUM SMOKING ACCESSORIES</div>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)", fontWeight: 900, color: cfg.headingColor, marginBottom: 24, lineHeight: 1.15 }}>
            Crafted for Every<br />
            <span style={{ color: "#34d399" }}>Session.</span>
          </h1>

          <p style={{ maxWidth: 520, fontSize: 15, lineHeight: 1.7, marginBottom: 40, color: cfg.bodyText, margin: "0 auto 40px" }}>
            From windproof lighters and precision grinders to glass ashtrays, rolling trays, pre-rolled cones, and sheesha essentials — the complete Stash Pro range.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 10, fontFamily: "monospace", color: cfg.subText, justifyContent: "center", marginBottom: 32 }}>
            <span><span style={{ color: "#34d399" }}>57+</span> Products</span>
            <span style={{ color: cfg.borderBase }}>|</span>
            <span><span style={{ color: "#34d399" }}>9</span> Categories</span>
            <span style={{ color: cfg.borderBase }}>|</span>
            <span>Premium Quality</span>
          </div>

          <button style={{ padding: "14px 32px", background: "#34d399", color: "#040c04", fontFamily: "monospace", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 2, letterSpacing: "0.12em", cursor: "pointer" }}>
            EXPLORE THE FULL COLLECTION →
          </button>
        </div>
      </div>

      {/* Sticky nav simulation */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: `1px solid ${cfg.borderBase}`, background: cfg.stickyBg, backdropFilter: "blur(12px)", padding: "12px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {["ALL","LIGHTERS","GRINDERS","ASHTRAYS","ROLLING TRAYS","ROLLING PAPERS","PRE-ROLLED","SHEESHA"].map((cat, i) => (
            <button key={cat} style={{ padding: "6px 12px", borderRadius: 2, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", border: `1px solid ${i === 0 ? "rgba(52,211,153,0.4)" : cfg.borderBase}`, background: i === 0 ? "rgba(52,211,153,0.12)" : "transparent", color: i === 0 ? "#34d399" : cfg.subText, cursor: "pointer" }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 80px" }}>
        {PRODUCTS.map(section => (
          <section key={section.cat} style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{ height: 1, flex: 1, background: cfg.borderBase }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{section.icon}</span>
                <div>
                  <p style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.4em", color: cfg.accentText, margin: 0, opacity: 0.6 }}>STASH PRO</p>
                  <h2 style={{ color: cfg.headingColor, fontWeight: 900, fontSize: 18, margin: 0 }}>{section.cat}</h2>
                </div>
              </div>
              <div style={{ height: 1, flex: 1, background: cfg.borderBase }} />
              <span style={{ fontSize: 9, fontFamily: "monospace", color: cfg.mutedText }}>{section.count} products</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {section.items.map(p => (
                <div key={p.title} style={{ border: `1px solid ${cfg.borderBase}`, background: cfg.cardBg, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden", background: cfg.mode === "dark" ? "rgba(52,211,153,0.03)" : "rgba(52,211,153,0.04)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <div style={{ padding: 14 }}>
                    <h4 style={{ color: cfg.headingColor, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{p.title}</h4>
                    <p style={{ color: cfg.bodyText, fontSize: 11, lineHeight: 1.5, margin: "0 0 12px" }}>{p.desc}</p>
                    <button style={{ width: "100%", padding: "7px 0", border: `1px solid ${cfg.borderAccent}`, background: "transparent", color: cfg.accentText, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", borderRadius: 2, cursor: "pointer" }}>
                      VIEW PRODUCT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer strip */}
      <div style={{ borderTop: `1px solid ${cfg.borderBase}`, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#34d399", fontFamily: "monospace", fontWeight: 900, fontSize: 13, letterSpacing: "0.15em" }}>STASH</span>
          <span style={{ color: cfg.headingColor, fontFamily: "monospace", fontWeight: 900, fontSize: 13, letterSpacing: "0.15em" }}>PRO</span>
        </div>
        <span style={{ fontSize: 9, fontFamily: "monospace", color: cfg.mutedText, letterSpacing: "0.2em" }}>PRESENTED BY DANTÈS · THE BLOOM SOCIETY</span>
      </div>
    </div>
  );
}
