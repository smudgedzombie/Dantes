import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const MODULES = ["financial","marketing","operations","compliance","events","export_b2b","hr","logistics"];
const MODULE_LABELS: Record<string, string> = {
  financial:"Financial",marketing:"Marketing",operations:"Operations",
  compliance:"Compliance",events:"Events",export_b2b:"Export/B2B",hr:"HR",logistics:"Logistics",
};
const PRIORITY_COLORS: Record<string, string> = {
  low:"text-[#3a5570]", medium:"text-[#D4AF37]", high:"text-[#f97316]", critical:"text-[#ef4444]",
};
const STATUS_COLORS: Record<string, string> = {
  pending:"bg-amber-500/10 text-amber-400 border-amber-500/20",
  in_progress:"bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled:"bg-red-500/10 text-red-400 border-red-500/20",
};

type Task = { id:number; title:string; description:string|null; module:string; priority:string; status:string; adminNotes:string|null; completedAt:string|null; createdAt:string };

export default function PortalTasksPage() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", module:"operations", priority:"medium" });
  const [error, setError] = useState("");

  async function load() {
    const token = await getToken();
    const res = await fetch("/api/portal/tasks", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setError("");
    try {
      const token = await getToken();
      const res = await fetch("/api/portal/tasks", {
        method:"POST", headers: { Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed"); return; }
      const newTask = await res.json();
      setTasks(t => [newTask, ...t]);
      setForm({ title:"", description:"", module:"operations", priority:"medium" });
      setShowForm(false);
    } catch { setError("Network error."); }
    finally { setSubmitting(false); }
  }

  const inputCls = "w-full bg-[#030810] border border-[#0d1b35] rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono placeholder:text-[#2a4060] transition-colors";
  const labelCls = "block text-[9px] font-mono text-[#3a5570] mb-1.5 uppercase tracking-widest";
  const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/portal" className="w-8 h-8 bg-[#D4AF37] rounded-sm flex items-center justify-center">
            <span className="text-[#030810] font-mono font-black text-sm">D</span>
          </Link>
          <div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em]">BLOOM SOCIETY PORTAL</p>
            <p className="text-white font-serif font-bold text-sm">Task Inbox</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
          + NEW TASK
        </button>
      </header>

      <nav className="relative z-10 border-b border-[#0d1b35] px-6 flex gap-0">
        {[{href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},{href:"/portal/billing",l:"BILLING"}].map(i=>(
          <Link key={i.href} href={i.href} className={`px-4 py-3 text-[10px] font-mono border-b-2 transition-all ${i.href==="/portal/tasks"?"text-[#D4AF37] border-[#D4AF37]":"text-[#3a5570] border-transparent hover:text-white hover:border-[#D4AF37]/40"}`}>{i.l}</Link>
        ))}
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-[#030810]/90 flex items-center justify-center z-50 px-6">
            <form onSubmit={submit} className={`${panelCls} p-7 w-full max-w-lg space-y-4`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">NEW TASK FOR YOUR GRAHAM</p>
                <button type="button" onClick={()=>setShowForm(false)} className="text-[#3a5570] hover:text-white text-lg font-mono">×</button>
              </div>
              <div><label className={labelCls}>Task Title *</label><input required value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className={inputCls} placeholder="e.g. Prepare Q3 VAT filing summary" /></div>
              <div><label className={labelCls}>Description</label><textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls+" resize-none"} placeholder="Provide any relevant context, data sources, or expected output..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Module</label>
                  <select value={form.module} onChange={e=>setForm(f=>({...f,module:e.target.value}))} className={inputCls}>
                    {MODULES.map(m=><option key={m} value={m}>{MODULE_LABELS[m]}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Priority</label>
                  <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className={inputCls}>
                    {["low","medium","high","critical"].map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full py-3 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest">
                {submitting?"SUBMITTING...":"SUBMIT TASK →"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING...</span></div>
        ) : tasks.length === 0 ? (
          <div className={`${panelCls} p-16 text-center`}>
            <p className="text-[#D4AF37] font-mono text-2xl mb-3">◎</p>
            <p className="text-white font-semibold mb-2">No tasks yet</p>
            <p className="text-[#3a5570] text-sm mb-6">Submit your first task and your Graham will get to work.</p>
            <button onClick={()=>setShowForm(true)} className="px-5 py-2.5 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">+ NEW TASK</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono text-[#3a5570]">{tasks.length} TASKS</p>
              <div className="flex gap-2">
                {["all","pending","in_progress","completed"].map(f=>(
                  <span key={f} className="text-[9px] font-mono text-[#2a4060] capitalize cursor-pointer hover:text-white transition-colors">{f.replace("_"," ")}</span>
                ))}
              </div>
            </div>
            {tasks.map(t => (
              <div key={t.id} className={`${panelCls} p-4 hover:border-[#D4AF37]/15 transition-colors`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${STATUS_COLORS[t.status] ?? ""}`}>{t.status.replace("_"," ")}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-0.5">{t.title}</p>
                    {t.description && <p className="text-[10px] text-[#3a5570] leading-relaxed line-clamp-2">{t.description}</p>}
                    {t.adminNotes && (
                      <div className="mt-2 p-2 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-sm">
                        <p className="text-[9px] font-mono text-[#D4AF37] mb-0.5">GRAHAM NOTE</p>
                        <p className="text-[10px] text-[#8aa0b8]">{t.adminNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-mono text-[#2a4060]">{new Date(t.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] font-mono text-[#D4AF37] capitalize mt-0.5">{MODULE_LABELS[t.module] ?? t.module}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
