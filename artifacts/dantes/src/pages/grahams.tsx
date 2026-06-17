import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const ALL_MODULES = [
  { id: "financial", label: "Financial Engine", color: "#D4AF37" },
  { id: "marketing", label: "Marketing Command", color: "#ec4899" },
  { id: "operations", label: "Operations Core", color: "#06b6d4" },
  { id: "compliance", label: "Compliance Shield", color: "#8b5cf6" },
  { id: "export_b2b", label: "Export / B2B", color: "#22c55e" },
  { id: "events", label: "Events Accelerator", color: "#f97316" },
  { id: "hr", label: "HR Management", color: "#64748b" },
  { id: "logistics", label: "Logistics", color: "#14b8a6" },
];

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: "#00ff88", label: "ACTIVE" },
  standby: { color: "#D4AF37", label: "STANDBY" },
  configuring: { color: "#06b6d4", label: "CONFIGURING" },
  suspended: { color: "#ef4444", label: "SUSPENDED" },
};

type Graham = {
  id: number;
  code: string;
  name: string;
  clientId: number | null;
  clientName: string | null;
  clientIndustry: string | null;
  status: string;
  modules: string[];
  objective: string | null;
  deployedAt: string | null;
  notes: string | null;
  createdAt: string;
};
type Client = { id: number; name: string; industry: string };

function GrahamForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ code: "", name: "", clientId: "", status: "configuring", modules: [] as string[], objective: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/clients").then(r => r.json()).then(d => setClients(Array.isArray(d) ? d : [])); }, []);

  function toggleModule(id: string) {
    setForm(f => ({ ...f, modules: f.modules.includes(id) ? f.modules.filter(m => m !== id) : [...f.modules, id] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, clientId: form.clientId ? parseInt(form.clientId) : undefined };
      await fetch("/api/graham-agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      onCreated();
      onClose();
    } finally { setSaving(false); }
  }

  const inputCls = "w-full bg-[#0a1628] border border-[#0d1b35] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60 font-mono placeholder:text-[#3a5570]";
  const labelCls = "block text-[10px] font-mono text-[#3a5570] mb-1 uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="bg-[#040c1a] border border-[#D4AF37]/20 rounded-sm p-6 space-y-5">
      <div className="font-mono text-[#D4AF37] text-xs tracking-widest mb-2">CONFIGURE NEW GRAHAM AGENT</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Agent Code *</label>
          <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className={inputCls} placeholder="GRM04" />
        </div>
        <div>
          <label className={labelCls}>Agent Name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Graham Revenue Alpha" />
        </div>
        <div>
          <label className={labelCls}>Assigned Client</label>
          <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} className={inputCls}>
            <option value="">— Unassigned —</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Initial Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
            <option value="configuring">Configuring</option>
            <option value="standby">Standby</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Primary Objective</label>
          <textarea rows={2} value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} className={inputCls + " resize-none"} placeholder="What is the core mission of this Graham agent?" />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Active Modules</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ALL_MODULES.map(m => {
              const active = form.modules.includes(m.id);
              return (
                <button key={m.id} type="button" onClick={() => toggleModule(m.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-mono transition-all text-left"
                  style={{ borderColor: active ? m.color + "60" : "#0d1b35", backgroundColor: active ? m.color + "15" : "#0a1628", color: active ? m.color : "#3a5570" }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: active ? m.color : "#3a5570" }} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Bloom Society Notes (private)</label>
          <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls + " resize-none"} placeholder="Internal configuration notes..." />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest">
          {saving ? "DEPLOYING..." : "DEPLOY GRAHAM"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2 bg-[#0a1628] text-[#3a5570] text-xs font-mono rounded-sm hover:text-white transition-colors">CANCEL</button>
      </div>
    </form>
  );
}

export default function GrahamsPage() {
  const [grahams, setGrahams] = useState<Graham[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/graham-agents");
      setGrahams(Array.isArray(await r.json()) ? await fetch("/api/graham-agents").then(r2 => r2.json()) : []);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    fetch("/api/graham-agents").then(r => r.json()).then(d => { setGrahams(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = filterStatus ? grahams.filter(g => g.status === filterStatus) : grahams;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#D4AF37] tracking-[0.3em] mb-1">DANTÈS PLATFORM</p>
            <h1 className="text-3xl font-serif font-black text-white">Graham Agents</h1>
            <p className="text-[#3a5570] mt-1 font-mono text-xs">{grahams.length} agents in registry</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
            <Plus className="w-3.5 h-3.5" />
            DEPLOY GRAHAM
          </button>
        </header>

        <div className="flex gap-2 flex-wrap">
          {[{ value: "", label: "ALL" }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))].map(f => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-sm transition-colors tracking-widest ${filterStatus === f.value ? "bg-[#D4AF37] text-[#030810]" : "bg-[#0a1628] border border-[#0d1b35] text-[#3a5570] hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {showForm && <GrahamForm onClose={() => setShowForm(false)} onCreated={() => { fetch("/api/graham-agents").then(r => r.json()).then(d => setGrahams(Array.isArray(d) ? d : [])); }} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40" />) :
            filtered.length === 0 ? (
              <div className="col-span-2 bg-[#040c1a] border border-[#0d1b35] rounded-sm p-16 text-center">
                <p className="text-[#3a5570] font-mono text-sm mb-3">No Graham agents deployed yet.</p>
                <button onClick={() => setShowForm(true)} className="text-[10px] font-mono text-[#D4AF37] hover:text-white transition-colors tracking-widest">DEPLOY FIRST GRAHAM →</button>
              </div>
            ) : filtered.map(g => {
              const st = STATUS_CONFIG[g.status];
              return (
                <Link key={g.id} href={`/grahams/${g.id}`}
                  className="block bg-[#040c1a] border border-[#0d1b35] rounded-sm p-5 hover:border-[#D4AF37]/30 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-xs text-[#D4AF37] tracking-widest mb-1">{g.code}</div>
                      <h3 className="text-sm font-semibold text-white">{g.name}</h3>
                      {g.clientName && <p className="text-[10px] font-mono text-[#3a5570] mt-0.5">{g.clientName}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-sm border shrink-0" style={{ color: st?.color ?? "#3a5570", borderColor: (st?.color ?? "#3a5570") + "25", backgroundColor: (st?.color ?? "#3a5570") + "10" }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${g.status === "active" ? "animate-pulse" : ""}`} style={{ backgroundColor: st?.color ?? "#3a5570" }} />
                      {st?.label ?? g.status}
                    </div>
                  </div>
                  {g.objective && <p className="text-xs text-[#3a5570] mb-3 leading-relaxed line-clamp-2">{g.objective}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {g.modules.map(m => {
                      const mod = ALL_MODULES.find(x => x.id === m);
                      return (
                        <span key={m} className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm border" style={{ color: mod?.color ?? "#3a5570", borderColor: (mod?.color ?? "#3a5570") + "25", backgroundColor: (mod?.color ?? "#3a5570") + "10" }}>
                          {mod?.label ?? m}
                        </span>
                      );
                    })}
                    {g.modules.length === 0 && <span className="text-[9px] font-mono text-[#2a4060]">No modules configured</span>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#0d1b35]">
                    <span className="text-[9px] font-mono text-[#2a4060]">Created {new Date(g.createdAt).toLocaleDateString()}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#2a4060] group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
