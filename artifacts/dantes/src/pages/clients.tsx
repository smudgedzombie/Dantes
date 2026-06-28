import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const INDUSTRIES = [
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "export_trade", label: "Export & Trade" },
  { value: "real_estate", label: "Real Estate" },
  { value: "professional_services", label: "Professional Services" },
  { value: "other", label: "Other" },
];
const STATUSES = [
  { value: "prospect", label: "Prospect", color: "#a855f7" },
  { value: "active", label: "Active", color: "#00c45a" },
  { value: "paused", label: "Paused", color: "#64748b" },
  { value: "completed", label: "Completed", color: "#22d3ee" },
];

type Client = {
  id: number; name: string; industry: string; description: string | null;
  contactName: string | null; contactEmail: string | null; contactPhone: string | null;
  country: string | null; status: string; notes: string | null; createdAt: string;
};

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: "#1e1b4b" };

function ClientForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", industry: "other", description: "", contactName: "", contactEmail: "", contactPhone: "", country: "", status: "prospect", notes: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onCreated();
      onClose();
    } finally { setSaving(false); }
  }

  const inputCls = "w-full rounded-xl px-3 py-2 text-sm focus:outline-none font-mono";
  const labelCls = "block text-[10px] font-mono mb-1 uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ ...card, border: "1px solid rgba(168,85,247,0.3)" }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-xs tracking-widest" style={{ color: "#a855f7" }}>NEW CLIENT REGISTRATION</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Client / Business Name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} style={inputStyle} placeholder="e.g. The Amber Club" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Industry *</label>
          <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className={inputCls} style={inputStyle}>
            {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls} style={inputStyle}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Contact Name</label>
          <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className={inputCls} style={inputStyle} placeholder="e.g. Alex Thompson" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Contact Email</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className={inputCls} style={inputStyle} placeholder="alex@business.com" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Phone</label>
          <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className={inputCls} style={inputStyle} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Country</label>
          <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls} style={inputStyle} placeholder="UAE" />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Business Description</label>
          <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls + " resize-none"} style={inputStyle} placeholder="Brief description of the client's business..." />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Internal Notes (Bloom Society only)</label>
          <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls + " resize-none"} style={inputStyle} placeholder="Private notes — not visible to client..." />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-50 tracking-widest"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          {saving ? "REGISTERING..." : "REGISTER CLIENT"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-mono transition-colors" style={{ background: "rgba(168,85,247,0.08)", color: "#5a587a" }}>CANCEL</button>
      </div>
    </form>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/clients");
      const d = await r.json();
      setClients(Array.isArray(d) ? d : []);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function deleteClient(id: number) {
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    setClients(cs => cs.filter(c => c.id !== id));
  }

  const filtered = filterStatus ? clients.filter(c => c.status === filterStatus) : clients;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] mb-1" style={{ color: "#a855f7" }}>BLOOM SOCIETY</p>
            <h1 className="text-2xl sm:text-3xl font-serif font-black" style={{ color: "#1e1b4b" }}>Client Registry</h1>
            <p className="mt-1 font-mono text-xs" style={{ color: "#9898b8" }}>{clients.length} registered clients</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white transition-all tracking-widest"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
            <Plus className="w-3.5 h-3.5" />
            REGISTER CLIENT
          </button>
        </header>

        <div className="flex gap-2 flex-wrap">
          {[{ value: "", label: "ALL" }, ...STATUSES.map(s => ({ value: s.value, label: s.label.toUpperCase() }))].map(f => (
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

        {showForm && <ClientForm onClose={() => setShowForm(false)} onCreated={load} />}

        <div className="space-y-3">
          {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />) :
            filtered.length === 0 ? (
              <div className="rounded-2xl p-16 text-center" style={card}>
                <p className="font-mono text-sm" style={{ color: "#9898b8" }}>No clients found.</p>
              </div>
            ) : filtered.map(client => {
              const st = STATUSES.find(s => s.value === client.status);
              const ind = INDUSTRIES.find(i => i.value === client.industry);
              return (
                <div key={client.id} className="rounded-2xl p-5 group hover:shadow-md transition-all" style={card}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold" style={{ color: "#1e1b4b" }}>{client.name}</h3>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-lg border" style={{ color: st?.color ?? "#9898b8", borderColor: (st?.color ?? "#9898b8") + "30", backgroundColor: (st?.color ?? "#9898b8") + "12" }}>
                          {(st?.label ?? client.status).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono mb-2" style={{ color: "#9898b8" }}>{ind?.label ?? client.industry} {client.country && `· ${client.country}`}</p>
                      {client.description && <p className="text-xs leading-relaxed mb-2" style={{ color: "#5a587a" }}>{client.description}</p>}
                      <div className="flex flex-wrap gap-4 text-[10px] font-mono" style={{ color: "#9898b8" }}>
                        {client.contactName && <span>{client.contactName}</span>}
                        {client.contactEmail && <span>{client.contactEmail}</span>}
                        {client.contactPhone && <span>{client.contactPhone}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/clients/${client.id}`} className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50" style={{ color: "#9898b8" }}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteClient(client.id)} className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50" style={{ color: "#9898b8" }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
