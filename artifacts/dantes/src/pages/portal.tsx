import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const MODULE_ICONS: Record<string, string> = {
  financial: "◈", marketing: "◉", operations: "◎", compliance: "◆",
  events: "✦", export_b2b: "◇", hr: "▸", logistics: "▹",
};
const MODULE_COLORS: Record<string, string> = {
  financial: "#D4AF37", marketing: "#ec4899", operations: "#06b6d4",
  compliance: "#8b5cf6", events: "#f97316", export_b2b: "#22c55e",
  hr: "#64748b", logistics: "#14b8a6",
};
const STATUS_DOT: Record<string, string> = {
  completed: "#00ff88", in_progress: "#D4AF37", pending: "#3a5570",
  failed: "#ef4444", milestone: "#D4AF37", report: "#06b6d4", alert: "#ef4444",
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

function HealthRing({ score }: { score: number }) {
  const r = 28; const c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  const color = score >= 80 ? "#00ff88" : score >= 60 ? "#D4AF37" : score >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#0d1b35" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="text-center">
        <span className="font-mono font-bold text-lg" style={{ color }}>{score}</span>
        <p className="text-[8px] font-mono text-[#3a5570] leading-none mt-0.5">HEALTH</p>
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
    <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-5">
      <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-4">ONBOARDING PROGRESS</p>
      <div className="flex items-start gap-2">
        {ONBOARDING_STAGES.map((s, i) => {
          const done = i < displayIdx;
          const active = i === displayIdx;
          return (
            <div key={s.key} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full mb-2">
                <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 text-[9px] font-mono font-bold transition-all ${done ? "bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88]" : active ? "bg-[#D4AF37] text-[#030810]" : "bg-[#0a1628] border border-[#0d1b35] text-[#2a4060]"}`}>
                  {done ? "✓" : `0${i + 1}`}
                </div>
                {i < 3 && <div className={`flex-1 h-px mx-1 ${done ? "bg-[#00ff88]/30" : "bg-[#0d1b35]"}`} />}
              </div>
              <div className="text-center w-full">
                <p className={`text-[8px] font-mono font-bold leading-tight ${active ? "text-[#D4AF37]" : done ? "text-[#00ff88]" : "text-[#2a4060]"}`}>{s.label}</p>
                <p className="text-[7px] font-mono text-[#2a4060] leading-tight mt-0.5 hidden sm:block">{s.desc}</p>
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
    <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">GRAHAM IMPACT METRICS</p>
        {metrics.grahamCode && <span className="text-[9px] font-mono text-[#3a5570]">{metrics.grahamCode}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "TASKS COMPLETED", value: `${metrics.tasksCompleted}/${metrics.tasksTotal}`, color: "#00ff88", sub: "of submitted tasks" },
          { label: "ACTIVITIES LOGGED", value: metrics.activitiesLogged, color: "#06b6d4", sub: "Graham executions" },
          { label: "EST. HOURS SAVED", value: `~${metrics.estimatedHoursSaved}h`, color: "#D4AF37", sub: "this engagement" },
          { label: "MODULES ACTIVE", value: metrics.modulesActive, color: "#8b5cf6", sub: "capability modules" },
        ].map(s => (
          <div key={s.label}>
            <p className="text-[8px] font-mono text-[#3a5570] tracking-widest mb-1">{s.label}</p>
            <p className="font-mono font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[8px] font-mono text-[#2a4060] mt-0.5">{s.sub}</p>
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

  const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";

  if (loading) return (
    <div className="min-h-screen bg-[#030810] flex items-center justify-center">
      <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] animate-pulse">LOADING PORTAL...</span>
    </div>
  );

  if (error || !overview) return (
    <div className="min-h-screen bg-[#030810] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <img src="/logo.png" alt="Dantès" className="w-16 h-16 object-contain mx-auto mb-5" />
        <p className="text-white font-semibold mb-2">Portal Unavailable</p>
        <p className="text-[#3a5570] text-sm mb-6">{error || "Could not load your portal."}</p>
        <Link href="/" className="text-[10px] font-mono text-[#D4AF37] hover:text-white transition-colors">← HOME</Link>
      </div>
    </div>
  );

  const { member, vault, recentActivities, pendingTasksCount, unpaidInvoicesCount } = overview;

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" />
          <div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em]">BLOOM SOCIETY PORTAL</p>
            <p className="text-white font-serif font-bold text-sm">{member.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {member.bloomMemberId && (
            <span className="text-[9px] font-mono text-[#3a5570] hidden sm:block">{member.bloomMemberId}</span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[9px] font-mono text-[#00ff88]">ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="relative z-10 border-b border-[#0d1b35] px-6 flex gap-0">
        {[
          { href: "/portal", label: "OVERVIEW" },
          { href: "/portal/tasks", label: `TASKS${pendingTasksCount > 0 ? ` (${pendingTasksCount})` : ""}` },
          { href: "/portal/documents", label: "DOCUMENTS" },
          { href: "/portal/billing", label: `BILLING${unpaidInvoicesCount > 0 ? ` (${unpaidInvoicesCount})` : ""}` },
          { href: "/portal/club", label: "✦ CLUB ROOM" },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="px-4 py-3 text-[10px] font-mono text-[#3a5570] hover:text-white border-b-2 border-transparent hover:border-[#D4AF37]/40 transition-all">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-5">
        {/* Onboarding tracker - only shown for non-active members */}
        {member.status !== "active" && <OnboardingTracker status={member.status} />}

        {/* Graham Status Banner */}
        <div className={`${panelCls} p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5`}>
          <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm flex items-center justify-center shrink-0">
            <span className="text-[#D4AF37] font-mono font-black text-sm">{member.assignedGrahamId ?? "GRM"}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-white font-serif font-bold text-base">{member.assignedGrahamId ?? "Graham Pending"}</p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#00ff88]/10 border border-[#00ff88]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-[9px] font-mono text-[#00ff88]">OPERATIONAL</span>
              </div>
            </div>
            <p className="text-[#3a5570] text-xs font-mono">{member.company ?? member.email} · Bloom Society Member</p>
          </div>
          {vault && <HealthRing score={vault.healthScore} />}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "ACTIVITIES", value: recentActivities.length + "+", sub: "This period", color: "#D4AF37" },
            { label: "OPEN TASKS", value: pendingTasksCount, sub: "Awaiting action", color: "#06b6d4" },
            { label: "INVOICES DUE", value: unpaidInvoicesCount, sub: "Pending payment", color: unpaidInvoicesCount > 0 ? "#f97316" : "#00ff88" },
            { label: "RISK LEVEL", value: (vault?.riskLevel ?? "normal").toUpperCase(), sub: "Account health", color: vault?.riskLevel === "high" ? "#ef4444" : vault?.riskLevel === "medium" ? "#f97316" : "#00ff88" },
          ].map(s => (
            <div key={s.label} className={`${panelCls} p-4`}>
              <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-2">{s.label}</p>
              <p className="font-mono font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-mono text-[#2a4060] mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ROI Metrics */}
        {metrics && <ROIMetrics metrics={metrics} />}

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">GRAHAM ACTIVITY FEED</p>
            <Link href="/portal/tasks" className="text-[9px] font-mono text-[#3a5570] hover:text-[#D4AF37] transition-colors">SUBMIT TASK →</Link>
          </div>
          {recentActivities.length === 0 ? (
            <div className={`${panelCls} p-10 text-center`}>
              <p className="text-[#2a4060] font-mono text-xs">No activity yet — your Graham is standing by.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivities.map(a => (
                <div key={a.id} className={`${panelCls} p-4 flex items-start gap-4 hover:border-[#D4AF37]/15 transition-colors`}>
                  <div className="w-8 h-8 rounded-sm bg-[#030810] border border-[#0d1b35] flex items-center justify-center shrink-0 text-sm"
                    style={{ color: MODULE_COLORS[a.module] ?? "#D4AF37" }}>
                    {MODULE_ICONS[a.module] ?? "◎"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-white truncate">{a.title}</p>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_DOT[a.status] ?? "#3a5570" }} />
                    </div>
                    {a.description && <p className="text-[10px] text-[#3a5570] leading-relaxed line-clamp-1">{a.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-mono text-[#2a4060]">{new Date(a.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] font-mono capitalize" style={{ color: MODULE_COLORS[a.module] ?? "#D4AF37" }}>{a.module}</p>
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
              className={`${panelCls} p-5 hover:border-[#D4AF37]/25 transition-all group cursor-pointer block`}>
              <div className="text-[#D4AF37] text-lg font-mono mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
              <p className="text-[10px] text-[#2a4060] leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
