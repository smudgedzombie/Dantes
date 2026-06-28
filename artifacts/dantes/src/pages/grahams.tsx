import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const ALL_MODULES = [
  { id: "financial", label: "Financial Engine", color: "#a855f7" },
  { id: "marketing", label: "Marketing Command", color: "#ec4899" },
  { id: "operations", label: "Operations Core", color: "#22d3ee" },
  { id: "compliance", label: "Compliance Shield", color: "#8b5cf6" },
  { id: "export_b2b", label: "Export / B2B", color: "#22c55e" },
  { id: "events", label: "Events Accelerator", color: "#fb923c" },
  { id: "hr", label: "HR Management", color: "#64748b" },
  { id: "logistics", label: "Logistics", color: "#14b8a6" },
];

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: "#00c45a", label: "ACTIVE" },
  standby: { color: "#a855f7", label: "STANDBY" },
  configuring: { color: "#22d3ee", label: "CONFIGURING" },
  suspended: { color: "#ef4444", label: "SUSPENDED" },
};

type Graham = {
  id: number; code: string; name: string; clientId: number | null;
  clientName: string | null; clientIndustry: string | null; status: string;
  modules: string[]; objective: string | null; deployedAt: string | null;
  notes: string | null; createdAt: string;
};
type Client = { id: number; name: string; industry: string };

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: "#1e1b4b" };

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

  const inputCls = "w-full rounded-xl px-3 py-2 text-sm focus:outline-none font-mono";
  const labelCls = "block text-[10px] font-mono mb-1 uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ ...card, border: "1px solid rgba(168,85,247,0.3)" }}>
      <div className="font-mono text-xs tracking-widest" style={{ color: "#a855f7" }}>CONFIGURE NEW GRAHAM AGENT</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Agent Code *</label>
          <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className={inputCls} style={inputStyle} placeholder="GRM04" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Agent Name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} style={inputStyle} placeholder="e.g. Graham Revenue Alpha" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Assigned Client</label>
          <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} className={inputCls} style={inputStyle}>
            <option value="">— Unassigned —</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Initial Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls} style={inputStyle}>
            <option value="configuring">Configuring</option>
            <option value="standby">Standby</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Primary Objective</label>
          <textarea rows={2} value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} className={inputCls + " resize-none"} style={inputStyle} placeholder="What is the core mission of this Graham agent?" />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Active Modules</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ALL_MODULES.map(m => {
              const active = form.modules.includes(m.id);
              return (
                <button key={m.id} type="button" onClick={() => toggleModule(m.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all text-left"
                  style={{ borderColor: active ? m.color + "50" : "rgba(168,85,247,0.18)", backgroundColor: active ? m.color + "12" : "rgba(255,255,255,0.5)", color: active ? m.color : "#5a587a" }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: active ? m.color : "#9898b8" }} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Bloom Society Notes (private)</label>
          <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls + " resize-none"} style={inputStyle} placeholder="Internal configuration notes..." />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-50 tracking-widest"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          {saving ? "DEPLOYING..." : "DEPLOY GRAHAM"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-mono transition-colors" style={{ background: "rgba(168,85,247,0.08)", color: "#5a587a" }}>CANCEL</button>
      </div>
    </form>
  );
}

export default function GrahamsPage() {
  const [grahams, setGrahams] = useState<Graham[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetch("/api/graham-agents").then(r => r.json()).then(d => { setGrahams(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = filterStatus ? grahams.filter(g => g.status === filterStatus) : grahams;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] mb-1" style={{ color: "#a855f7" }}>DANTÈS PLATFORM</p>
            <h1 className="text-2xl sm:text-3xl font-serif font-black" style={{ color: "#1e1b4b" }}>Graham Agents</h1>
            <p className="mt-1 font-mono text-xs" style={{ color: "#9898b8" }}>{grahams.length} agents in registry</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white transition-all tracking-widest"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
            <Plus className="w-3.5 h-3.5" />
            DEPLOY GRAHAM
          </button>
        </header>

        <div className="flex gap-2 flex-wrap">
          {[{ value: "", label: "ALL" }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))].map(f => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className="px-3 py-1.5 text-[10px] font-mono rounded-xl transition-all tracking-widest"
              style={filterStatus === f.value
                ? { background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff" }
                : { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(168,85,247,0.2)", color: "#5a587a" }
              }>
              {f.label}
            </button>
          ))}
        </div>

        {showForm && <GrahamForm onClose={() => setShowForm(false)} onCreated={() => { fetch("/api/graham-agents").then(r => r.json()).then(d => setGrahams(Array.isArray(d) ? d : [])); }} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40" />) :
            filtered.length === 0 ? (
              <div className="col-span-2 rounded-2xl p-16 text-center" style={card}>
                <p className="font-mono text-sm mb-3" style={{ color: "#9898b8" }}>No Graham agents deployed yet.</p>
                <button onClick={() => setShowForm(true)} className="text-[10px] font-mono transition-colors tracking-widest" style={{ color: "#a855f7" }}>DEPLOY FIRST GRAHAM →</button>
              </div>
            ) : filtered.map(g => {
              const st = STATUS_CONFIG[g.status];
              return (
                <Link key={g.id} href={`/grahams/${g.id}`}
                  className="block rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer group" style={card}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-xs tracking-widest mb-1" style={{ color: "#a855f7" }}>{g.code}</div>
                      <h3 className="text-sm font-semibold" style={{ color: "#1e1b4b" }}>{g.name}</h3>
                      {g.clientName && <p className="text-[10px] font-mono mt-0.5" style={{ color: "#9898b8" }}>{g.clientName}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg border shrink-0" style={{ color: st?.color ?? "#9898b8", borderColor: (st?.color ?? "#9898b8") + "30", backgroundColor: (st?.color ?? "#9898b8") + "12" }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${g.status === "active" ? "animate-pulse" : ""}`} style={{ backgroundColor: st?.color ?? "#9898b8" }} />
                      {st?.label ?? g.status}
                    </div>
                  </div>
                  {g.objective && <p className="text-xs mb-3 leading-relaxed line-clamp-2" style={{ color: "#5a587a" }}>{g.objective}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {g.modules.map(m => {
                      const mod = ALL_MODULES.find(x => x.id === m);
                      return (
                        <span key={m} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md border" style={{ color: mod?.color ?? "#9898b8", borderColor: (mod?.color ?? "#9898b8") + "30", backgroundColor: (mod?.color ?? "#9898b8") + "12" }}>
                          {mod?.label ?? m}
                        </span>
                      );
                    })}
                    {g.modules.length === 0 && <span className="text-[9px] font-mono" style={{ color: "#9898b8" }}>No modules configured</span>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
                    <span className="text-[9px] font-mono" style={{ color: "#9898b8" }}>Created {new Date(g.createdAt).toLocaleDateString()}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-colors" style={{ color: "#9898b8" }} />
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
