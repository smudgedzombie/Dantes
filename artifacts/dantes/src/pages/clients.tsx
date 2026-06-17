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
  { value: "prospect", label: "Prospect", color: "#D4AF37" },
  { value: "active", label: "Active", color: "#00ff88" },
  { value: "paused", label: "Paused", color: "#64748b" },
  { value: "completed", label: "Completed", color: "#8b5cf6" },
];

type Client = {
  id: number;
  name: string;
  industry: string;
  description: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  country: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

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

  const inputCls = "w-full bg-[#0a1628] border border-[#0d1b35] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60 font-mono placeholder:text-[#3a5570]";
  const labelCls = "block text-[10px] font-mono text-[#3a5570] mb-1 uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="bg-[#040c1a] border border-[#D4AF37]/20 rounded-sm p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[#D4AF37] text-xs tracking-widest">NEW CLIENT REGISTRATION</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelCls}>Client / Business Name *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. The Amber Club" />
        </div>
        <div>
          <label className={labelCls}>Industry *</label>
          <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className={inputCls}>
            {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Contact Name</label>
          <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className={inputCls} placeholder="e.g. Alex Thompson" />
        </div>
        <div>
          <label className={labelCls}>Contact Email</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className={inputCls} placeholder="alex@business.com" />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className={inputCls} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls} placeholder="UAE" />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Business Description</label>
          <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls + " resize-none"} placeholder="Brief description of the client's business..." />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Internal Notes (Bloom Society only)</label>
          <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls + " resize-none"} placeholder="Private notes — not visible to client..." />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest">
          {saving ? "REGISTERING..." : "REGISTER CLIENT"}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2 bg-[#0a1628] text-[#3a5570] text-xs font-mono rounded-sm hover:text-white transition-colors">CANCEL</button>
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
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#D4AF37] tracking-[0.3em] mb-1">BLOOM SOCIETY</p>
            <h1 className="text-3xl font-serif font-black text-white">Client Registry</h1>
            <p className="text-[#3a5570] mt-1 font-mono text-xs">{clients.length} registered clients</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
            <Plus className="w-3.5 h-3.5" />
            REGISTER CLIENT
          </button>
        </header>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {[{ value: "", label: "ALL" }, ...STATUSES.map(s => ({ value: s.value, label: s.label.toUpperCase() }))].map(f => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-sm transition-colors tracking-widest ${filterStatus === f.value ? "bg-[#D4AF37] text-[#030810]" : "bg-[#0a1628] border border-[#0d1b35] text-[#3a5570] hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {showForm && <ClientForm onClose={() => setShowForm(false)} onCreated={load} />}

        <div className="space-y-3">
          {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />) :
            filtered.length === 0 ? (
              <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-16 text-center">
                <p className="text-[#3a5570] font-mono text-sm">No clients found.</p>
              </div>
            ) : filtered.map(client => {
              const st = STATUSES.find(s => s.value === client.status);
              const ind = INDUSTRIES.find(i => i.value === client.industry);
              return (
                <div key={client.id} className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-5 group hover:border-[#D4AF37]/25 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-white">{client.name}</h3>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm border" style={{ color: st?.color ?? "#3a5570", borderColor: (st?.color ?? "#3a5570") + "30", backgroundColor: (st?.color ?? "#3a5570") + "10" }}>
                          {(st?.label ?? client.status).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-[#3a5570] mb-2">{ind?.label ?? client.industry} {client.country && `· ${client.country}`}</p>
                      {client.description && <p className="text-xs text-[#4a6080] leading-relaxed mb-2">{client.description}</p>}
                      <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#3a5570]">
                        {client.contactName && <span>{client.contactName}</span>}
                        {client.contactEmail && <span>{client.contactEmail}</span>}
                        {client.contactPhone && <span>{client.contactPhone}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/clients/${client.id}`} className="p-2 rounded-sm opacity-0 group-hover:opacity-100 text-[#3a5570] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteClient(client.id)} className="p-2 rounded-sm opacity-0 group-hover:opacity-100 text-[#3a5570] hover:text-red-400 hover:bg-red-400/10 transition-all">
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
