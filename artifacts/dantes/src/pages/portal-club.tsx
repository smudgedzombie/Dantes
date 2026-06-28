import { useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";

const DEALS = [
  {
    id: 1, author: "S.G.", role: "Principal", time: "2h ago", tag: "JOINT VENTURE", tagColor: "#a855f7",
    title: "F&B operator seeking silent partner — Silom flagship",
    body: "Established F&B concept, 3 locations, THB 45M annualised revenue. Seeking strategic capital partner for Silom flagship (THB 8M). Full P&L available under NDA.",
    interests: 11, hot: true,
  },
  {
    id: 2, author: "A.P.", role: "Principal", time: "5h ago", tag: "DEAL FLOW", tagColor: "#22d3ee",
    title: "BOI pre-approval secured — Smart factory, EEC Zone",
    body: "BOI approved EEC smart factory project. Looking for manufacturing operator partner to co-develop. Incentive package locked. Move fast — construction window Q3.",
    interests: 8, hot: false,
  },
  {
    id: 3, author: "K.W.", role: "Member", time: "1d ago", tag: "ACQUISITION", tagColor: "#8b5cf6",
    title: "Distressed hospitality asset — Hua Hin beachfront",
    body: "Boutique resort, 22 keys, direct beach. Owner exit. Priced at THB 120M vs replacement cost THB 190M+. Financing introduced on request. Graham analysis attached.",
    interests: 19, hot: true,
  },
  {
    id: 4, author: "M.T.", role: "Member", time: "2d ago", tag: "RECRUITMENT", tagColor: "#22c55e",
    title: "Seeking: Thai CFO with SET experience, equity stake",
    body: "Series B fintech (THB 380M ARR) seeking Thai CFO. Board seat + equity. Preference for candidates with SET listing experience. Referrals welcome.",
    interests: 5, hot: false,
  },
];

const EVENTS = [
  {
    date: "JUL 04", day: "FRI", title: "Bloom Society Dinner — Vertigo, Banyan Tree",
    type: "PRIVATE DINNER", typeColor: "#a855f7",
    desc: "Quarterly principals dinner. Dress: smart casual. Max 18 seats. Members + 1 guest.",
    spots: 4, location: "Banyan Tree BKK, 61F",
  },
  {
    date: "JUL 11", day: "FRI", title: "Graham Deep-Dive: Financial Module Masterclass",
    type: "WORKSHOP", typeColor: "#22d3ee",
    desc: "2-hour session on advanced Graham financial configurations. Thai VAT, BOI, revenue modelling. Dr. Prabhakar presenting.",
    spots: 12, location: "Zoom + IRL — AIA Sathorn",
  },
  {
    date: "JUL 19", day: "SAT", title: "Deal Breakfast: M&A & Strategic Capital",
    type: "NETWORKING", typeColor: "#8b5cf6",
    desc: "Curated 20-person breakfast for principals actively deploying capital in Thailand. Structured introductions.",
    spots: 6, location: "The Rosewood, Park Lounge",
  },
  {
    date: "AUG 01", day: "FRI", title: "Q3 Bloom Society Summit — Bangkok",
    type: "SUMMIT", typeColor: "#fb923c",
    desc: "Full-day summit: Graham showcases, client case studies, new module reveals, networking dinner. Annual highlight.",
    spots: 20, location: "Conrad Bangkok, Grand Ballroom",
  },
];

const MEMBERS = [
  { initials: "SG", name: "Dr. Steven Graham", role: "Co-Founder & Principal", industry: "Finance & Technology", badge: "FOUNDER", badgeColor: "#a855f7", status: "active" },
  { initials: "AP", name: "Dr. Akshay Prabhakar", role: "Co-Founder & Principal", industry: "Finance & Technology", badge: "FOUNDER", badgeColor: "#a855f7", status: "active" },
  { initials: "KC", name: "K. Charoensook", role: "Managing Director", industry: "Manufacturing & Export", badge: "ENTERPRISE", badgeColor: "#22d3ee", status: "active" },
  { initials: "NW", name: "N. Wongprasert", role: "CEO", industry: "Hospitality & Leisure", badge: "MEMBER", badgeColor: "#8b5cf6", status: "active" },
  { initials: "MT", name: "M. Tanaka", role: "Investment Director", industry: "Finance & Investment", badge: "MEMBER", badgeColor: "#8b5cf6", status: "active" },
  { initials: "RL", name: "R. Limparat", role: "Founder", industry: "Food & Beverage", badge: "MEMBER", badgeColor: "#8b5cf6", status: "active" },
];

const P = {
  bg: "#f5f0ff", heading: "#1e1b4b", body: "#5a587a", muted: "#9898b8", purple: "#a855f7",
  card: "rgba(255,255,255,0.68)", cardBorder: "rgba(168,85,247,0.18)",
};

type Tab = "deals" | "events" | "members";

export default function PortalClubPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("deals");
  const [interested, setInterested] = useState<Set<number>>(new Set());
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set());

  const navLinks = [
    {href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},
    {href:"/portal/billing",l:"BILLING"},{href:"/portal/club",l:"✦ CLUB ROOM"}
  ];

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 0% 0%,rgba(168,85,247,0.08),transparent),radial-gradient(ellipse 60% 60% at 100% 100%,rgba(236,72,153,0.06),transparent)" }} />

      {/* Header */}
      <header className="relative z-10 border-b px-4 sm:px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" />
          <div>
            <p className="text-[9px] font-mono tracking-[0.3em]" style={{ color: P.purple }}>BLOOM SOCIETY — THE CLUB ROOM</p>
            <p className="font-serif font-bold text-sm" style={{ color: P.heading }}>{user?.fullName ?? "Member"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/portal" className="text-[9px] font-mono transition-colors tracking-widest" style={{ color: P.muted }}>← PORTAL</Link>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.purple }} />
            <span className="text-[9px] font-mono" style={{ color: P.purple }}>LIVE</span>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="relative z-10 border-b px-4 sm:px-6 py-8 overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.06),rgba(34,211,238,0.04))", borderColor: "rgba(168,85,247,0.12)" }}>
        <div className="relative z-10 max-w-4xl">
          <p className="text-[9px] font-mono tracking-[0.4em] mb-2" style={{ color: P.purple }}>MEMBERS ONLY — PRIVATE</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-black mb-2" style={{ color: P.heading }}>The Club Room</h1>
          <p className="text-sm max-w-xl" style={{ color: P.body }}>Where Bloom Society principals deal, connect, and close. What's shared here stays here — this is your circle's private channel.</p>
        </div>
      </div>

      {/* Portal nav */}
      <nav className="relative z-10 border-b px-4 sm:px-6 flex gap-0 overflow-x-auto" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderColor: "rgba(168,85,247,0.12)" }}>
        {navLinks.map(i=>(
          <Link key={i.href} href={i.href}
            className="px-4 py-3 text-[10px] font-mono border-b-2 transition-all whitespace-nowrap"
            style={i.href==="/portal/club" ? { color: P.purple, borderColor: P.purple } : { color: P.muted, borderColor: "transparent" }}>
            {i.l}
          </Link>
        ))}
      </nav>

      {/* Content tabs */}
      <div className="relative z-10 border-b px-4 sm:px-6 flex gap-0 overflow-x-auto" style={{ background: "rgba(255,255,255,0.5)", borderColor: "rgba(168,85,247,0.1)" }}>
        {([
          { key: "deals", label: "DEAL WALL", count: DEALS.length },
          { key: "events", label: "BKK EVENTS", count: EVENTS.length },
          { key: "members", label: "DIRECTORY", count: MEMBERS.length },
        ] as { key: Tab; label: string; count: number }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-5 py-3.5 text-[10px] font-mono border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
            style={tab === t.key ? { borderColor: P.purple, color: P.purple } : { borderColor: "transparent", color: P.muted }}>
            {t.label}
            <span className="text-[8px] px-1.5 py-0.5 rounded-md font-bold"
              style={tab === t.key ? { background: "rgba(168,85,247,0.15)", color: P.purple } : { background: "rgba(168,85,247,0.06)", color: P.muted }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* DEAL WALL */}
        {tab === "deals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: P.purple }}>DEAL WALL</p>
                <p className="text-xs" style={{ color: P.body }}>Exclusive opportunities shared by Bloom Society principals. NDA implied by membership.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ border: "1px solid rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.06)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.purple }} />
                <span className="text-[9px] font-mono" style={{ color: P.purple }}>NDA-BOUND</span>
              </div>
            </div>

            {DEALS.map(deal => (
              <div key={deal.id} className="rounded-2xl p-5 hover:shadow-md transition-all" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    <span className="text-xs font-mono font-bold" style={{ color: P.purple }}>{deal.author}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md" style={{ color: deal.tagColor, background: deal.tagColor + "15", border: `1px solid ${deal.tagColor}30` }}>{deal.tag}</span>
                      {deal.hot && <span className="text-[8px] font-mono text-red-400 px-2 py-0.5 rounded-md" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>🔥 HOT</span>}
                      <span className="text-[9px] font-mono" style={{ color: P.muted }}>{deal.role} · {deal.time}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: P.heading }}>{deal.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: P.body }}>{deal.body}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => setInterested(s => { const n = new Set(s); n.has(deal.id) ? n.delete(deal.id) : n.add(deal.id); return n; })}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border transition-all"
                        style={interested.has(deal.id)
                          ? { background: "rgba(168,85,247,0.12)", borderColor: "rgba(168,85,247,0.4)", color: P.purple }
                          : { background: "rgba(255,255,255,0.7)", borderColor: "rgba(168,85,247,0.2)", color: P.body }
                        }>
                        {interested.has(deal.id) ? "✓ INTERESTED" : "REGISTER INTEREST"}
                        <span className="opacity-60">{deal.interests + (interested.has(deal.id) ? 1 : 0)}</span>
                      </button>
                      <span className="text-[9px] font-mono" style={{ color: P.muted }}>Under NDA · Principals only</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-6 text-center" style={{ border: "2px dashed rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.03)" }}>
              <p className="text-[9px] font-mono tracking-widest mb-2" style={{ color: P.purple }}>POST A DEAL</p>
              <p className="text-xs mb-4" style={{ color: P.body }}>Share an opportunity with the circle. All posts are reviewed before going live.</p>
              <Link href="/portal/tasks" className="inline-block px-5 py-2 rounded-xl font-mono font-bold text-xs text-white transition-all tracking-widest"
                style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
                SUBMIT VIA GRAHAM →
              </Link>
            </div>
          </div>
        )}

        {/* EVENTS */}
        {tab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: P.purple }}>UPCOMING EVENTS — BANGKOK</p>
                <p className="text-xs" style={{ color: P.body }}>Private events for Bloom Society members. Attendance is by RSVP only.</p>
              </div>
              <span className="text-[9px] font-mono" style={{ color: P.muted }}>Q3 2026</span>
            </div>

            {EVENTS.map((event, i) => (
              <div key={i} className="rounded-2xl overflow-hidden hover:shadow-md transition-all" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                <div className="flex gap-0">
                  <div className="w-20 shrink-0 border-r flex flex-col items-center justify-center py-5 px-3" style={{ background: "rgba(168,85,247,0.06)", borderColor: "rgba(168,85,247,0.12)" }}>
                    <span className="font-mono font-bold text-sm leading-none" style={{ color: P.purple }}>{event.date.split(" ")[0]}</span>
                    <span className="font-mono font-bold text-lg leading-none" style={{ color: P.purple }}>{event.date.split(" ")[1]}</span>
                    <span className="text-[9px] font-mono mt-1" style={{ color: P.muted }}>{event.day}</span>
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div>
                        <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md mr-2"
                          style={{ color: event.typeColor, background: event.typeColor + "15", border: `1px solid ${event.typeColor}30` }}>{event.type}</span>
                        <h3 className="font-semibold text-sm mt-2" style={{ color: P.heading }}>{event.title}</h3>
                      </div>
                      <button
                        onClick={() => setRsvpd(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                        className="shrink-0 px-4 py-1.5 font-mono font-bold text-[10px] rounded-xl border transition-all"
                        style={rsvpd.has(i)
                          ? { background: "rgba(0,196,90,0.12)", borderColor: "rgba(0,196,90,0.35)", color: "#00c45a" }
                          : { background: "linear-gradient(135deg,#a855f7,#ec4899)", borderColor: "transparent", color: "#fff" }
                        }>
                        {rsvpd.has(i) ? "✓ RSVP'D" : "RSVP"}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: P.body }}>{event.desc}</p>
                    <div className="flex items-center gap-4 text-[9px] font-mono" style={{ color: P.muted }}>
                      <span>📍 {event.location}</span>
                      <span className={event.spots <= 5 ? "text-red-400" : "text-emerald-500"}>
                        {event.spots <= 5 ? "⚠ " : ""}{event.spots} spots left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MEMBER DIRECTORY */}
        {tab === "members" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: P.purple }}>MEMBER DIRECTORY</p>
                <p className="text-xs" style={{ color: P.body }}>Active Bloom Society principals. Contact via your Graham — privacy is standard.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(0,196,90,0.08)", border: "1px solid rgba(0,196,90,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-500">{MEMBERS.length} ACTIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEMBERS.map(m => (
                <div key={m.name} className="rounded-2xl p-5 hover:shadow-md transition-all" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                      <span className="text-xs font-mono font-bold" style={{ color: P.purple }}>{m.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: P.heading }}>{m.name}</p>
                      <p className="text-[10px] font-mono" style={{ color: P.muted }}>{m.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono" style={{ color: P.muted }}>{m.industry}</span>
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{ color: m.badgeColor, background: m.badgeColor + "15", border: `1px solid ${m.badgeColor}30` }}>
                      {m.badge}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
                    <button className="w-full text-[9px] font-mono tracking-widest py-1 transition-colors" style={{ color: P.muted }}>
                      CONNECT VIA GRAHAM →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl text-center" style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.12)" }}>
              <p className="text-[9px] font-mono" style={{ color: P.muted }}>Full contact details shared exclusively via your Graham upon mutual opt-in · Privacy-first by design</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
