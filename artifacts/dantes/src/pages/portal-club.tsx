import { useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";

const DEALS = [
  {
    id: 1,
    author: "S.G.",
    role: "Principal",
    time: "2h ago",
    tag: "JOINT VENTURE",
    tagColor: "#D4AF37",
    title: "F&B operator seeking silent partner — Silom flagship",
    body: "Established F&B concept, 3 locations, THB 45M annualised revenue. Seeking strategic capital partner for Silom flagship (THB 8M). Full P&L available under NDA.",
    interests: 11,
    hot: true,
  },
  {
    id: 2,
    author: "A.P.",
    role: "Principal",
    time: "5h ago",
    tag: "DEAL FLOW",
    tagColor: "#06b6d4",
    title: "BOI pre-approval secured — Smart factory, EEC Zone",
    body: "BOI approved EEC smart factory project. Looking for manufacturing operator partner to co-develop. Incentive package locked. Move fast — construction window Q3.",
    interests: 8,
    hot: false,
  },
  {
    id: 3,
    author: "K.W.",
    role: "Member",
    time: "1d ago",
    tag: "ACQUISITION",
    tagColor: "#8b5cf6",
    title: "Distressed hospitality asset — Hua Hin beachfront",
    body: "Boutique resort, 22 keys, direct beach. Owner exit. Priced at THB 120M vs replacement cost THB 190M+. Financing introduced on request. Graham analysis attached.",
    interests: 19,
    hot: true,
  },
  {
    id: 4,
    author: "M.T.",
    role: "Member",
    time: "2d ago",
    tag: "RECRUITMENT",
    tagColor: "#22c55e",
    title: "Seeking: Thai CFO with SET experience, equity stake",
    body: "Series B fintech (THB 380M ARR) seeking Thai CFO. Board seat + equity. Preference for candidates with SET listing experience. Referrals welcome.",
    interests: 5,
    hot: false,
  },
];

const EVENTS = [
  {
    date: "JUL 04",
    day: "FRI",
    title: "Bloom Society Dinner — Vertigo, Banyan Tree",
    type: "PRIVATE DINNER",
    typeColor: "#D4AF37",
    desc: "Quarterly principals dinner. Dress: smart casual. Max 18 seats. Members + 1 guest.",
    spots: 4,
    location: "Banyan Tree BKK, 61F",
  },
  {
    date: "JUL 11",
    day: "FRI",
    title: "Graham Deep-Dive: Financial Module Masterclass",
    type: "WORKSHOP",
    typeColor: "#06b6d4",
    desc: "2-hour session on advanced Graham financial configurations. Thai VAT, BOI, revenue modelling. Dr. Prabhakar presenting.",
    spots: 12,
    location: "Zoom + IRL — AIA Sathorn",
  },
  {
    date: "JUL 19",
    day: "SAT",
    title: "Deal Breakfast: M&A & Strategic Capital",
    type: "NETWORKING",
    typeColor: "#8b5cf6",
    desc: "Curated 20-person breakfast for principals actively deploying capital in Thailand. Structured introductions.",
    spots: 6,
    location: "The Rosewood, Park Lounge",
  },
  {
    date: "AUG 01",
    day: "FRI",
    title: "Q3 Bloom Society Summit — Bangkok",
    type: "SUMMIT",
    typeColor: "#f97316",
    desc: "Full-day summit: Graham showcases, client case studies, new module reveals, networking dinner. Annual highlight.",
    spots: 20,
    location: "Conrad Bangkok, Grand Ballroom",
  },
];

const MEMBERS = [
  { initials: "SG", name: "Dr. Steven Graham", role: "Co-Founder & Principal", industry: "Finance & Technology", badge: "FOUNDER", badgeColor: "#D4AF37", status: "active" },
  { initials: "AP", name: "Dr. Akshay Prabhakar", role: "Co-Founder & Principal", industry: "Finance & Technology", badge: "FOUNDER", badgeColor: "#D4AF37", status: "active" },
  { initials: "KC", name: "K. Charoensook", role: "Managing Director", industry: "Manufacturing & Export", badge: "ENTERPRISE", badgeColor: "#06b6d4", status: "active" },
  { initials: "NW", name: "N. Wongprasert", role: "CEO", industry: "Hospitality & Leisure", badge: "MEMBER", badgeColor: "#8b5cf6", status: "active" },
  { initials: "MT", name: "M. Tanaka", role: "Investment Director", industry: "Finance & Investment", badge: "MEMBER", badgeColor: "#8b5cf6", status: "active" },
  { initials: "RL", name: "R. Limparat", role: "Founder", industry: "Food & Beverage", badge: "MEMBER", badgeColor: "#8b5cf6", status: "active" },
];

type Tab = "deals" | "events" | "members";

export default function PortalClubPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("deals");
  const [interested, setInterested] = useState<Set<number>>(new Set());
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" />
          <div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em]">BLOOM SOCIETY — THE CLUB ROOM</p>
            <p className="text-white font-serif font-bold text-sm">{user?.fullName ?? "Member"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/portal" className="text-[9px] font-mono text-[#3a5570] hover:text-[#D4AF37] transition-colors tracking-widest">← PORTAL</Link>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[9px] font-mono text-[#D4AF37]">LIVE</span>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="relative z-10 border-b border-[#0d1b35] px-6 py-8 bg-gradient-to-r from-[#030810] via-[#040c1a] to-[#030810] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at left, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl">
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-2">MEMBERS ONLY — PRIVATE</p>
          <h1 className="text-3xl font-serif font-black text-white mb-2">The Club Room</h1>
          <p className="text-[#3a5570] text-sm max-w-xl">Where Bloom Society principals deal, connect, and close. What's shared here stays here — this is your circle's private channel.</p>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="relative z-10 border-b border-[#0d1b35] px-6 flex gap-0">
        {([
          { key: "deals", label: "DEAL WALL", count: DEALS.length },
          { key: "events", label: "BKK EVENTS", count: EVENTS.length },
          { key: "members", label: "DIRECTORY", count: MEMBERS.length },
        ] as { key: Tab; label: string; count: number }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3.5 text-[10px] font-mono border-b-2 transition-all flex items-center gap-2 ${tab === t.key ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-[#3a5570] hover:text-white"}`}>
            {t.label}
            <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold ${tab === t.key ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-[#0a1628] text-[#3a5570]"}`}>{t.count}</span>
          </button>
        ))}
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">

        {/* DEAL WALL */}
        {tab === "deals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-1">DEAL WALL</p>
                <p className="text-[#3a5570] text-xs">Exclusive opportunities shared by Bloom Society principals. NDA implied by membership.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] font-mono text-[#D4AF37]">NDA-BOUND</span>
              </div>
            </div>

            {DEALS.map(deal => (
              <div key={deal.id} className="border border-[#0d1b35] bg-[#040c1a] rounded-sm p-5 hover:border-[#D4AF37]/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#D4AF37] text-xs font-mono font-bold">{deal.author}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm" style={{ color: deal.tagColor, background: deal.tagColor + "15", border: `1px solid ${deal.tagColor}30` }}>{deal.tag}</span>
                      {deal.hot && <span className="text-[8px] font-mono text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-sm">🔥 HOT</span>}
                      <span className="text-[9px] font-mono text-[#2a4060]">{deal.role} · {deal.time}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-2">{deal.title}</h3>
                    <p className="text-[#3a5570] text-xs leading-relaxed">{deal.body}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => setInterested(s => { const n = new Set(s); n.has(deal.id) ? n.delete(deal.id) : n.add(deal.id); return n; })}
                        className={`flex items-center gap-2 text-[10px] font-mono font-bold px-3 py-1.5 rounded-sm border transition-all ${interested.has(deal.id) ? "bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]" : "border-[#0d1b35] text-[#3a5570] hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"}`}>
                        {interested.has(deal.id) ? "✓ INTERESTED" : "REGISTER INTEREST"}
                        <span className="opacity-60">{deal.interests + (interested.has(deal.id) ? 1 : 0)}</span>
                      </button>
                      <span className="text-[9px] font-mono text-[#2a4060]">Under NDA · Principals only</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="border border-dashed border-[#0d1b35] rounded-sm p-6 text-center">
              <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-2">POST A DEAL</p>
              <p className="text-[#3a5570] text-xs mb-4">Share an opportunity with the circle. All posts are reviewed before going live.</p>
              <Link href="/portal/tasks" className="inline-block px-5 py-2 bg-[#D4AF37] text-[#030810] font-mono font-bold text-xs rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
                SUBMIT VIA GRAHAM →
              </Link>
            </div>
          </div>
        )}

        {/* EVENTS */}
        {tab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-1">UPCOMING EVENTS — BANGKOK</p>
                <p className="text-[#3a5570] text-xs">Private events for Bloom Society members. Attendance is by RSVP only.</p>
              </div>
              <span className="text-[9px] font-mono text-[#3a5570]">Q3 2026</span>
            </div>

            {EVENTS.map((event, i) => (
              <div key={i} className="border border-[#0d1b35] bg-[#040c1a] rounded-sm overflow-hidden hover:border-[#D4AF37]/25 transition-all">
                <div className="flex gap-0">
                  {/* Date column */}
                  <div className="w-20 shrink-0 border-r border-[#0d1b35] flex flex-col items-center justify-center py-5 px-3 bg-[#030810]">
                    <span className="text-[#D4AF37] font-mono font-bold text-sm leading-none">{event.date.split(" ")[0]}</span>
                    <span className="text-[#D4AF37] font-mono font-bold text-lg leading-none">{event.date.split(" ")[1]}</span>
                    <span className="text-[#3a5570] text-[9px] font-mono mt-1">{event.day}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm mr-2"
                          style={{ color: event.typeColor, background: event.typeColor + "15", border: `1px solid ${event.typeColor}30` }}>{event.type}</span>
                        <h3 className="text-white font-semibold text-sm mt-2">{event.title}</h3>
                      </div>
                      <button
                        onClick={() => setRsvpd(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                        className={`shrink-0 px-4 py-1.5 font-mono font-bold text-[10px] rounded-sm border transition-all ${rsvpd.has(i) ? "bg-[#00ff88]/20 border-[#00ff88]/40 text-[#00ff88]" : "bg-[#D4AF37] border-[#D4AF37] text-[#030810] hover:bg-[#b8952b]"}`}>
                        {rsvpd.has(i) ? "✓ RSVP'D" : "RSVP"}
                      </button>
                    </div>
                    <p className="text-[#3a5570] text-xs leading-relaxed mb-3">{event.desc}</p>
                    <div className="flex items-center gap-4 text-[9px] font-mono">
                      <span className="text-[#3a5570]">📍 {event.location}</span>
                      <span className={`${event.spots <= 5 ? "text-red-400" : "text-[#00ff88]"}`}>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-1">MEMBER DIRECTORY</p>
                <p className="text-[#3a5570] text-xs">Active Bloom Society principals. Contact via your Graham — privacy is standard.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1628] border border-[#0d1b35] rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-[9px] font-mono text-[#00ff88]">{MEMBERS.length} ACTIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEMBERS.map(m => (
                <div key={m.name} className="border border-[#0d1b35] bg-[#040c1a] rounded-sm p-5 hover:border-[#D4AF37]/25 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#D4AF37] text-xs font-mono font-bold">{m.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{m.name}</p>
                      <p className="text-[#3a5570] text-[10px] font-mono">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#2a4060]">{m.industry}</span>
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm"
                      style={{ color: m.badgeColor, background: m.badgeColor + "15", border: `1px solid ${m.badgeColor}30` }}>
                      {m.badge}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#0d1b35]">
                    <button className="w-full text-[9px] font-mono text-[#3a5570] hover:text-[#D4AF37] transition-colors tracking-widest py-1">
                      CONNECT VIA GRAHAM →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border border-[#0d1b35] bg-[#040c1a]/60 rounded-sm text-center">
              <p className="text-[9px] font-mono text-[#2a4060]">Full contact details shared exclusively via your Graham upon mutual opt-in · Privacy-first by design</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
