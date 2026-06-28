import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const MODULE_ICONS: Record<string, string> = {
  financial: "◈", marketing: "◉", operations: "◎", compliance: "◆",
  events: "✦", export_b2b: "◇", hr: "▸", logistics: "▹",
};
const MODULE_COLORS: Record<string, string> = {
  financial: "#a855f7", marketing: "#ec4899", operations: "#22d3ee",
  compliance: "#8b5cf6", events: "#fb923c", export_b2b: "#22c55e",
  hr: "#64748b", logistics: "#14b8a6",
};
const STATUS_DOT: Record<string, string> = {
  completed: "#00c45a", in_progress: "#22d3ee", pending: "#9898b8",
  failed: "#ef4444", milestone: "#a855f7", report: "#22d3ee", alert: "#ef4444",
};

type Overview = {
  member: { fullName: string; email: string; bloomMemberId: string | null; assignedGrahamId: string | null; status: string; company: string | null };
  vault: { healthScore: number; riskLevel: string; monthlyValueUsd: number; totalPaidUsd: number } | null;
  recentActivities: Activity[];
  pendingTasksCount: number;
  unpaidInvoicesCount: number;
};
type Activity = { id: number; type: string; module: string; title: string; description: string | null; status: string; createdAt: string };
type Metrics = { tasksTotal: number; tasksCompleted: number; activitiesLogged: number; modulesActive: number; estimatedHoursSaved: number; totalPaidUsd: number; grahamCode: string | null };

const P = {
  bg: "#f5f0ff",
  heading: "#1e1b4b",
  body: "#5a587a",
  muted: "#9898b8",
  purple: "#a855f7",
  card: "rgba(255,255,255,0.68)",
  cardBorder: "rgba(168,85,247,0.18)",
};

function HealthRing({ score }: { score: number }) {
  const r = 28; const c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  const color = score >= 80 ? "#00c45a" : score >= 60 ? "#a855f7" : score >= 40 ? "#fb923c" : "#ef4444";
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="text-center">
        <span className="font-mono font-bold text-lg" style={{ color }}>{score}</span>
        <p className="text-[8px] font-mono leading-none mt-0.5" style={{ color: P.muted }}>HEALTH</p>
      </div>
    </div>
  );
}

const ONBOARDING_STAGES: { key: string; label: string; desc: string }[] = [
  { key: "pending", label: "Application", desc: "Received & under review" },
  { key: "reviewing", label: "Vetting", desc: "Profile assessment" },
  { key: "quoted", label: "Proposal", desc: "Custom Graham designed" },
  { key: "active", label: "Live", desc: "Graham deployed 24/7" },
];

function OnboardingTracker({ status }: { status: string }) {
  const stageOrder = ["pending", "reviewing", "quoted", "paid", "active"];
  const currentIdx = stageOrder.indexOf(status);
  const displayIdx = Math.min(currentIdx, 3);

  if (status === "active") return null;

  return (
    <div className="rounded-2xl p-5" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
      <p className="text-[9px] font-mono tracking-widest mb-4" style={{ color: P.purple }}>ONBOARDING PROGRESS</p>
      <div className="flex items-start gap-2">
        {ONBOARDING_STAGES.map((s, i) => {
          const done = i < displayIdx;
          const active = i === displayIdx;
          return (
            <div key={s.key} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full mb-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-mono font-bold transition-all"
                  style={done
                    ? { background: "rgba(0,196,90,0.15)", border: "1px solid rgba(0,196,90,0.35)", color: "#00c45a" }
                    : active
                    ? { background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff" }
                    : { background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", color: P.muted }
                  }>
                  {done ? "✓" : `0${i + 1}`}
                </div>
                {i < 3 && <div className="flex-1 h-px mx-1" style={{ background: done ? "linear-gradient(90deg,#00c45a50,#a855f720)" : "rgba(168,85,247,0.12)" }} />}
              </div>
              <div className="text-center w-full">
                <p className="text-[8px] font-mono font-bold leading-tight" style={{ color: active ? P.purple : done ? "#00c45a" : P.muted }}>{s.label}</p>
                <p className="text-[7px] font-mono leading-tight mt-0.5 hidden sm:block" style={{ color: P.muted }}>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ROIMetrics({ metrics }: { metrics: Metrics }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] font-mono tracking-widest" style={{ color: P.purple }}>GRAHAM IMPACT METRICS</p>
        {metrics.grahamCode && <span className="text-[9px] font-mono" style={{ color: P.muted }}>{metrics.grahamCode}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "TASKS COMPLETED", value: `${metrics.tasksCompleted}/${metrics.tasksTotal}`, color: "#00c45a", sub: "of submitted tasks" },
          { label: "ACTIVITIES LOGGED", value: metrics.activitiesLogged, color: "#22d3ee", sub: "Graham executions" },
          { label: "EST. HOURS SAVED", value: `~${metrics.estimatedHoursSaved}h`, color: P.purple, sub: "this engagement" },
          { label: "MODULES ACTIVE", value: metrics.modulesActive, color: "#ec4899", sub: "capability modules" },
        ].map(s => (
          <div key={s.label}>
            <p className="text-[8px] font-mono tracking-widest mb-1" style={{ color: P.muted }}>{s.label}</p>
            <p className="font-mono font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[8px] font-mono mt-0.5" style={{ color: P.muted }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortalPage() {
  const { getToken } = useAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const [ovRes, meRes] = await Promise.all([
          fetch("/api/portal/overview", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/portal/metrics", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!ovRes.ok) { setError("Unable to load portal. Your membership may not be active yet."); return; }
        setOverview(await ovRes.json());
        if (meRes.ok) setMetrics(await meRes.json());
      } catch { setError("Network error."); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: P.bg }}>
      <span className="text-[9px] font-mono tracking-[0.4em] animate-pulse" style={{ color: P.purple }}>LOADING PORTAL...</span>
    </div>
  );

  if (error || !overview) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: P.bg }}>
      <div className="text-center max-w-sm">
        <img src="/logo.png" alt="Dantès" className="w-16 h-16 object-contain mx-auto mb-5" />
        <p className="font-semibold mb-2" style={{ color: P.heading }}>Portal Unavailable</p>
        <p className="text-sm mb-6" style={{ color: P.body }}>{error || "Could not load your portal."}</p>
        <Link href="/" className="text-[10px] font-mono transition-colors" style={{ color: P.purple }}>← HOME</Link>
      </div>
    </div>
  );

  const { member, vault, recentActivities, pendingTasksCount, unpaidInvoicesCount } = overview;

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 10% 0%,rgba(168,85,247,0.07),transparent),radial-gradient(ellipse 60% 60% at 90% 100%,rgba(34,211,238,0.06),transparent)" }} />

      {/* Header */}
      <header className="relative z-10 border-b px-4 sm:px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" />
          <div>
            <p className="text-[9px] font-mono tracking-[0.3em]" style={{ color: P.purple }}>BLOOM SOCIETY PORTAL</p>
            <p className="font-serif font-bold text-sm" style={{ color: P.heading }}>{member.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {member.bloomMemberId && (
            <span className="text-[9px] font-mono hidden sm:block" style={{ color: P.muted }}>{member.bloomMemberId}</span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500">ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="relative z-10 border-b px-4 sm:px-6 flex gap-0 overflow-x-auto" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderColor: "rgba(168,85,247,0.12)" }}>
        {[
          { href: "/portal", label: "OVERVIEW" },
          { href: "/portal/tasks", label: `TASKS${pendingTasksCount > 0 ? ` (${pendingTasksCount})` : ""}` },
          { href: "/portal/documents", label: "DOCUMENTS" },
          { href: "/portal/billing", label: `BILLING${unpaidInvoicesCount > 0 ? ` (${unpaidInvoicesCount})` : ""}` },
          { href: "/portal/club", label: "✦ CLUB ROOM" },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="px-4 py-3 text-[10px] font-mono border-b-2 border-transparent transition-all whitespace-nowrap"
            style={{ color: P.muted }}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {member.status !== "active" && <OnboardingTracker status={member.status} />}

        {/* Graham Status Banner */}
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <span className="font-mono font-black text-sm" style={{ color: P.purple }}>{member.assignedGrahamId ?? "GRM"}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <p className="font-serif font-bold text-base" style={{ color: P.heading }}>{member.assignedGrahamId ?? "Graham Pending"}</p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg" style={{ background: "rgba(0,196,90,0.1)", border: "1px solid rgba(0,196,90,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-500">OPERATIONAL</span>
              </div>
            </div>
            <p className="text-xs font-mono" style={{ color: P.muted }}>{member.company ?? member.email} · Bloom Society Member</p>
          </div>
          {vault && <HealthRing score={vault.healthScore} />}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "ACTIVITIES", value: recentActivities.length + "+", sub: "This period", color: P.purple },
            { label: "OPEN TASKS", value: pendingTasksCount, sub: "Awaiting action", color: "#22d3ee" },
            { label: "INVOICES DUE", value: unpaidInvoicesCount, sub: "Pending payment", color: unpaidInvoicesCount > 0 ? "#fb923c" : "#00c45a" },
            { label: "RISK LEVEL", value: (vault?.riskLevel ?? "normal").toUpperCase(), sub: "Account health", color: vault?.riskLevel === "high" ? "#ef4444" : vault?.riskLevel === "medium" ? "#fb923c" : "#00c45a" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
              <p className="text-[9px] font-mono tracking-widest mb-2" style={{ color: P.muted }}>{s.label}</p>
              <p className="font-mono font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-mono mt-1" style={{ color: P.muted }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {metrics && <ROIMetrics metrics={metrics} />}

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-mono tracking-widest" style={{ color: P.purple }}>GRAHAM ACTIVITY FEED</p>
            <Link href="/portal/tasks" className="text-[9px] font-mono transition-colors" style={{ color: P.muted }}>SUBMIT TASK →</Link>
          </div>
          {recentActivities.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
              <p className="font-mono text-xs" style={{ color: P.muted }}>No activity yet — your Graham is standing by.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivities.map(a => (
                <div key={a.id} className="rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-all" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm" style={{ background: "rgba(168,85,247,0.08)", color: MODULE_COLORS[a.module] ?? P.purple }}>
                    {MODULE_ICONS[a.module] ?? "◎"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold truncate" style={{ color: P.heading }}>{a.title}</p>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_DOT[a.status] ?? P.muted }} />
                    </div>
                    {a.description && <p className="text-[10px] leading-relaxed line-clamp-1" style={{ color: P.body }}>{a.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-mono" style={{ color: P.muted }}>{new Date(a.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] font-mono capitalize mt-0.5" style={{ color: MODULE_COLORS[a.module] ?? P.purple }}>{a.module}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/portal/tasks", icon: "◎", label: "Submit a Task", desc: "Send a brief directly to your Graham — includes reply threads" },
            { href: "/portal/documents", icon: "◈", label: "View Documents", desc: "Reports, contracts, files — upload your own too" },
            { href: "/portal/billing", icon: "◆", label: "Billing & Invoices", desc: "Review payments and pay invoices online" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer block group" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
              <div className="text-lg font-mono mb-2" style={{ color: P.purple }}>{item.icon}</div>
              <p className="text-sm font-semibold mb-1" style={{ color: P.heading }}>{item.label}</p>
              <p className="text-[10px] leading-relaxed" style={{ color: P.muted }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
