import { useListAccounts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useEffect, useState } from "react";

const MODULE_COLORS: Record<string, string> = {
  financial: "#a855f7",
  marketing: "#ec4899",
  operations: "#22d3ee",
  compliance: "#8b5cf6",
  export_b2b: "#22c55e",
  events: "#fb923c",
  hr: "#64748b",
  logistics: "#14b8a6",
};
const MODULE_LABELS: Record<string, string> = {
  financial: "Financial",
  marketing: "Marketing",
  operations: "Operations",
  compliance: "Compliance",
  export_b2b: "Export/B2B",
  events: "Events",
  hr: "HR",
  logistics: "Logistics",
};

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const cardDivide = { borderColor: "rgba(168,85,247,0.12)" };

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl p-5" style={card}>
      <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: "#9898b8" }}>{label}</p>
      <p className="font-mono font-bold text-3xl mb-1" style={{ color: accent ?? "#1e1b4b" }}>{value}</p>
      {sub && <p className="text-[10px] font-mono" style={{ color: "#9898b8" }}>{sub}</p>}
    </div>
  );
}

function AgentRow({ agent }: { agent: ClientAgent }) {
  const STATUS_COLOR: Record<string, string> = {
    active: "#00c45a",
    standby: "#a855f7",
    configuring: "#22d3ee",
    suspended: "#ef4444",
  };
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-purple-50/40 transition-colors group" style={{ borderColor: "rgba(168,85,247,0.1)" }}>
      <div className="w-16">
        <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "#a855f7" }}>{agent.code}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "#1e1b4b" }}>{agent.name}</p>
        {agent.clientName && <p className="text-[10px] font-mono" style={{ color: "#9898b8" }}>{agent.clientName} · {agent.clientIndustry}</p>}
      </div>
      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
        {agent.modules.slice(0, 3).map(m => (
          <span key={m} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md border" style={{ borderColor: (MODULE_COLORS[m] ?? "#a855f7") + "30", color: MODULE_COLORS[m] ?? "#a855f7", backgroundColor: (MODULE_COLORS[m] ?? "#a855f7") + "12" }}>
            {MODULE_LABELS[m] ?? m}
          </span>
        ))}
        {agent.modules.length > 3 && <span className="text-[9px] font-mono" style={{ color: "#9898b8" }}>+{agent.modules.length - 3}</span>}
      </div>
      <div className="flex items-center gap-1.5 w-24 justify-end">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[agent.status] ?? "#9898b8" }} />
        <span className="text-[10px] font-mono" style={{ color: STATUS_COLOR[agent.status] ?? "#9898b8" }}>{agent.status.toUpperCase()}</span>
      </div>
    </div>
  );
}

type ClientAgent = {
  id: number; code: string; name: string; clientId: number | null;
  clientName: string | null; clientIndustry: string | null; status: string; modules: string[]; createdAt: string;
};
type Client = { id: number; name: string; industry: string; status: string; contactName: string | null; createdAt: string; };
type OperatorSummary = { totalClients: number; activeClients: number; totalGrahams: number; activeGrahams: number; pendingTasks: number; completedTasks: number; };

function useSummary() {
  const [data, setData] = useState<OperatorSummary | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/operator/summary").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { data, loading };
}
function useGrahams() {
  const [data, setData] = useState<ClientAgent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/graham-agents").then(r => r.json()).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { data, loading };
}
function useClients() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return { data, loading };
}

export default function CommandPage() {
  const { data: summary, loading: loadingSummary } = useSummary();
  const { data: grahams, loading: loadingGrahams } = useGrahams();
  const { data: clients, loading: loadingClients } = useClients();
  const { data: accounts } = useListAccounts();
  const [clock, setClock] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono tracking-[0.3em]" style={{ color: "#00c45a" }}>SYSTEM OPERATIONAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black" style={{ color: "#1e1b4b" }}>Command Center</h1>
            <p className="mt-1 font-mono text-xs" style={{ color: "#9898b8" }}>Bloom Society · Restricted Access Terminal</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-bold" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{clock.toLocaleTimeString()}</p>
            <p className="text-[10px] font-mono" style={{ color: "#9898b8" }}>{clock.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingSummary ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />) : (<>
            <StatCard label="Active Grahams" value={summary?.activeGrahams ?? 0} sub={`of ${summary?.totalGrahams ?? 0} total`} accent="#00c45a" />
            <StatCard label="Clients" value={summary?.activeClients ?? 0} sub={`${summary?.totalClients ?? 0} registered`} accent="#a855f7" />
            <StatCard label="Pending Tasks" value={summary?.pendingTasks ?? 0} sub="across all agents" accent="#22d3ee" />
            <StatCard label="Tasks Done" value={summary?.completedTasks ?? 0} sub="completed" accent="#ec4899" />
          </>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graham agents */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={card}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={cardDivide}>
              <h3 className="text-sm font-serif font-bold" style={{ color: "#1e1b4b" }}>Graham Deployments</h3>
              <Link href="/grahams" className="text-[10px] font-mono transition-colors tracking-wider" style={{ color: "#a855f7" }}>VIEW ALL →</Link>
            </div>
            {loadingGrahams ? (
              <div className="p-4 space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : grahams.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm font-mono mb-3" style={{ color: "#9898b8" }}>No Graham agents deployed yet</p>
                <Link href="/grahams" className="text-xs font-mono transition-colors" style={{ color: "#a855f7" }}>DEPLOY FIRST GRAHAM →</Link>
              </div>
            ) : grahams.map(a => <AgentRow key={a.id} agent={a} />)}
          </div>

          {/* Client registry */}
          <div className="rounded-2xl overflow-hidden" style={card}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={cardDivide}>
              <h3 className="text-sm font-serif font-bold" style={{ color: "#1e1b4b" }}>Client Registry</h3>
              <Link href="/clients" className="text-[10px] font-mono transition-colors tracking-wider" style={{ color: "#a855f7" }}>VIEW ALL →</Link>
            </div>
            {loadingClients ? (
              <div className="p-4 space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-mono mb-3" style={{ color: "#9898b8" }}>No clients registered</p>
                <Link href="/clients" className="text-[10px] font-mono" style={{ color: "#a855f7" }}>ADD CLIENT →</Link>
              </div>
            ) : clients.slice(0, 6).map(c => {
              const STATUS_COLOR: Record<string, string> = { active: "#00c45a", prospect: "#a855f7", paused: "#64748b", completed: "#8b5cf6" };
              return (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0 hover:bg-purple-50/40 transition-colors" style={{ borderColor: "rgba(168,85,247,0.1)" }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[c.status] ?? "#9898b8" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "#1e1b4b" }}>{c.name}</p>
                    <p className="text-[9px] font-mono capitalize" style={{ color: "#9898b8" }}>{c.industry.replace(/_/g, " ")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial overview */}
        {accounts && accounts.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={card}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={cardDivide}>
              <div>
                <h3 className="text-sm font-serif font-bold" style={{ color: "#1e1b4b" }}>Financial Module</h3>
                <p className="text-[10px] font-mono" style={{ color: "#9898b8" }}>Internal accounts · Bloom Society</p>
              </div>
              <Link href="/dashboard" className="text-[10px] font-mono transition-colors tracking-wider" style={{ color: "#a855f7" }}>FULL TELEMETRY →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: "rgba(168,85,247,0.1)" }}>
              {accounts.slice(0, 4).map(a => (
                <div key={a.id} className="px-5 py-4">
                  <p className="text-[9px] font-mono mb-1 uppercase tracking-wider" style={{ color: "#9898b8" }}>{a.name}</p>
                  <p className="font-mono text-sm font-bold" style={{ color: "#1e1b4b" }}>${a.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono capitalize" style={{ color: "#9898b8" }}>{a.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
