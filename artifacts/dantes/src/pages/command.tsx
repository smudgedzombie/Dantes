import { useListAccounts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useEffect, useState } from "react";

const MODULE_COLORS: Record<string, string> = {
  financial: "#D4AF37",
  marketing: "#ec4899",
  operations: "#06b6d4",
  compliance: "#8b5cf6",
  export_b2b: "#22c55e",
  events: "#f97316",
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

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-5">
      <p className="text-[10px] font-mono text-[#3a5570] uppercase tracking-widest mb-2">{label}</p>
      <p className="font-mono font-bold text-3xl mb-1" style={{ color: accent ?? "#ffffff" }}>{value}</p>
      {sub && <p className="text-[10px] font-mono text-[#3a5570]">{sub}</p>}
    </div>
  );
}

function AgentRow({ agent }: { agent: ClientAgent }) {
  const STATUS_COLOR: Record<string, string> = {
    active: "#00ff88",
    standby: "#D4AF37",
    configuring: "#06b6d4",
    suspended: "#ef4444",
  };
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-[#0d1b35]/60 last:border-0 hover:bg-[#0a1628]/40 transition-colors group">
      <div className="w-16">
        <span className="font-mono text-xs text-[#D4AF37] font-bold tracking-widest">{agent.code}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{agent.name}</p>
        {agent.clientName && <p className="text-[10px] font-mono text-[#3a5570]">{agent.clientName} · {agent.clientIndustry}</p>}
      </div>
      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
        {agent.modules.slice(0, 3).map(m => (
          <span key={m} className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm border" style={{ borderColor: (MODULE_COLORS[m] ?? "#D4AF37") + "30", color: MODULE_COLORS[m] ?? "#D4AF37", backgroundColor: (MODULE_COLORS[m] ?? "#D4AF37") + "10" }}>
            {MODULE_LABELS[m] ?? m}
          </span>
        ))}
        {agent.modules.length > 3 && <span className="text-[9px] font-mono text-[#3a5570]">+{agent.modules.length - 3}</span>}
      </div>
      <div className="flex items-center gap-1.5 w-24 justify-end">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[agent.status] ?? "#3a5570" }} />
        <span className="text-[10px] font-mono" style={{ color: STATUS_COLOR[agent.status] ?? "#3a5570" }}>{agent.status.toUpperCase()}</span>
      </div>
    </div>
  );
}

type ClientAgent = {
  id: number;
  code: string;
  name: string;
  clientId: number | null;
  clientName: string | null;
  clientIndustry: string | null;
  status: string;
  modules: string[];
  createdAt: string;
};

type Client = {
  id: number;
  name: string;
  industry: string;
  status: string;
  contactName: string | null;
  createdAt: string;
};

type OperatorSummary = {
  totalClients: number;
  activeClients: number;
  totalGrahams: number;
  activeGrahams: number;
  pendingTasks: number;
  completedTasks: number;
};

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
        <header className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[9px] font-mono text-[#00ff88] tracking-[0.3em]">SYSTEM OPERATIONAL</span>
            </div>
            <h1 className="text-3xl font-serif font-black text-white">Command Center</h1>
            <p className="text-[#3a5570] mt-1 font-mono text-xs">Bloom Society · Restricted Access Terminal</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[#D4AF37] text-lg font-bold">{clock.toLocaleTimeString()}</p>
            <p className="text-[10px] font-mono text-[#3a5570]">{clock.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingSummary ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />) : (<>
            <StatCard label="Active Grahams" value={summary?.activeGrahams ?? 0} sub={`of ${summary?.totalGrahams ?? 0} total`} accent="#00ff88" />
            <StatCard label="Clients" value={summary?.activeClients ?? 0} sub={`${summary?.totalClients ?? 0} registered`} accent="#D4AF37" />
            <StatCard label="Pending Tasks" value={summary?.pendingTasks ?? 0} sub="across all agents" accent="#06b6d4" />
            <StatCard label="Tasks Done" value={summary?.completedTasks ?? 0} sub="completed" accent="#8b5cf6" />
          </>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graham agents */}
          <div className="lg:col-span-2 bg-[#040c1a] border border-[#0d1b35] rounded-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#0d1b35]">
              <h3 className="text-sm font-serif font-bold text-white">Graham Deployments</h3>
              <Link href="/grahams" className="text-[10px] font-mono text-[#D4AF37] hover:text-white transition-colors tracking-wider">VIEW ALL →</Link>
            </div>
            {loadingGrahams ? (
              <div className="p-4 space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : grahams.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#3a5570] text-sm font-mono mb-3">No Graham agents deployed yet</p>
                <Link href="/grahams" className="text-xs font-mono text-[#D4AF37] hover:text-white transition-colors">DEPLOY FIRST GRAHAM →</Link>
              </div>
            ) : grahams.map(a => <AgentRow key={a.id} agent={a} />)}
          </div>

          {/* Client registry */}
          <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#0d1b35]">
              <h3 className="text-sm font-serif font-bold text-white">Client Registry</h3>
              <Link href="/clients" className="text-[10px] font-mono text-[#D4AF37] hover:text-white transition-colors tracking-wider">VIEW ALL →</Link>
            </div>
            {loadingClients ? (
              <div className="p-4 space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[#3a5570] text-xs font-mono mb-3">No clients registered</p>
                <Link href="/clients" className="text-[10px] font-mono text-[#D4AF37]">ADD CLIENT →</Link>
              </div>
            ) : clients.slice(0, 6).map(c => {
              const STATUS_COLOR: Record<string, string> = { active: "#00ff88", prospect: "#D4AF37", paused: "#64748b", completed: "#8b5cf6" };
              return (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-[#0d1b35]/60 last:border-0 hover:bg-[#0a1628]/40 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[c.status] ?? "#3a5570" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{c.name}</p>
                    <p className="text-[9px] font-mono text-[#3a5570] capitalize">{c.industry.replace(/_/g, " ")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial overview (existing module) */}
        {accounts && accounts.length > 0 && (
          <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#0d1b35]">
              <div>
                <h3 className="text-sm font-serif font-bold text-white">Financial Module</h3>
                <p className="text-[10px] font-mono text-[#3a5570]">Internal accounts · Bloom Society</p>
              </div>
              <Link href="/dashboard" className="text-[10px] font-mono text-[#D4AF37] hover:text-white transition-colors tracking-wider">FULL TELEMETRY →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#0d1b35]">
              {accounts.slice(0, 4).map(a => (
                <div key={a.id} className="px-5 py-4">
                  <p className="text-[9px] font-mono text-[#3a5570] mb-1 uppercase tracking-wider">{a.name}</p>
                  <p className="font-mono text-sm font-bold text-white">${a.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-[9px] font-mono text-[#3a5570] capitalize">{a.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
