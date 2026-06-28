import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const MODULES = ["financial","marketing","operations","compliance","events","export_b2b","hr","logistics"];
const MODULE_LABELS: Record<string, string> = {
  financial:"Financial",marketing:"Marketing",operations:"Operations",
  compliance:"Compliance",events:"Events",export_b2b:"Export/B2B",hr:"HR",logistics:"Logistics",
};
const PRIORITY_COLORS: Record<string, string> = {
  low:"#9898b8", medium:"#a855f7", high:"#fb923c", critical:"#ef4444",
};
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg:"rgba(168,85,247,0.08)", text:"#a855f7", border:"rgba(168,85,247,0.25)" },
  in_progress: { bg:"rgba(34,211,238,0.08)", text:"#22d3ee", border:"rgba(34,211,238,0.25)" },
  completed: { bg:"rgba(0,196,90,0.08)", text:"#00c45a", border:"rgba(0,196,90,0.25)" },
  cancelled: { bg:"rgba(239,68,68,0.08)", text:"#ef4444", border:"rgba(239,68,68,0.25)" },
};

const P = {
  bg: "#f5f0ff", heading: "#1e1b4b", body: "#5a587a", muted: "#9898b8", purple: "#a855f7",
  card: "rgba(255,255,255,0.68)", cardBorder: "rgba(168,85,247,0.18)",
};

type Task = { id:number; title:string; description:string|null; module:string; priority:string; status:string; adminNotes:string|null; completedAt:string|null; createdAt:string };
type Comment = { id:number; taskId:number; authorType:string; authorName:string; content:string; createdAt:string };

function TaskThread({ task, token }: { task: Task; token: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  async function loadComments() {
    const res = await fetch(`/api/portal/tasks/${task.id}/comments`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setComments(await res.json());
    setLoaded(true);
  }

  function toggle() { setOpen(o => !o); if (!loaded) loadComments(); }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/portal/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply }),
      });
      if (res.ok) { const c = await res.json(); setComments(cs => [...cs, c]); setReply(""); }
    } finally { setSending(false); }
  }

  return (
    <div>
      <button onClick={toggle} className="text-[9px] font-mono mt-2 flex items-center gap-1 transition-colors" style={{ color: open ? P.purple : P.muted }}>
        <span>{open ? "▼" : "▶"}</span>
        {comments.length > 0 ? `${comments.length} COMMENT${comments.length > 1 ? "S" : ""}` : "THREAD"} {!loaded && open ? "..." : ""}
      </button>

      {open && (
        <div className="mt-3 space-y-2 pl-3 border-l" style={{ borderColor: "rgba(168,85,247,0.2)" }}>
          {loaded && comments.length === 0 && (
            <p className="text-[9px] font-mono" style={{ color: P.muted }}>No replies yet — start the conversation.</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="rounded-xl p-3" style={
              c.authorType === "admin"
                ? { background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }
                : { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(168,85,247,0.12)" }
            }>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono font-bold" style={{ color: c.authorType === "admin" ? P.purple : "#22d3ee" }}>{c.authorName}</span>
                {c.authorType === "admin" && <span className="text-[8px] font-mono tracking-widest" style={{ color: P.muted }}>BLOOM SOCIETY</span>}
                <span className="text-[8px] font-mono ml-auto" style={{ color: P.muted }}>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: P.body }}>{c.content}</p>
            </div>
          ))}
          <form onSubmit={send} className="flex gap-2 pt-1">
            <input value={reply} onChange={e => setReply(e.target.value)}
              className="flex-1 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: P.heading }}
              placeholder="Write a reply..." />
            <button type="submit" disabled={sending || !reply.trim()}
              className="px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              SEND
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function PortalTasksPage() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", module:"operations", priority:"medium" });
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [filter, setFilter] = useState("all");

  async function load() {
    const tok = await getToken();
    setToken(tok ?? "");
    const res = await fetch("/api/portal/tasks", { headers: { Authorization: `Bearer ${tok}` } });
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setError("");
    try {
      const tok = await getToken();
      const res = await fetch("/api/portal/tasks", {
        method:"POST", headers: { Authorization:`Bearer ${tok}`, "Content-Type":"application/json" },
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

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none font-mono";
  const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: P.heading };
  const labelCls = "block text-[9px] font-mono mb-1.5 uppercase tracking-widest";
  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  const navLinks = [
    {href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:`TASKS${tasks.filter(t=>t.status==="pending").length>0?" ("+tasks.filter(t=>t.status==="pending").length+")":""}`},
    {href:"/portal/documents",l:"DOCUMENTS"},{href:"/portal/billing",l:"BILLING"},{href:"/portal/club",l:"✦ CLUB ROOM"}
  ];

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 10% 0%,rgba(168,85,247,0.07),transparent),radial-gradient(ellipse 60% 60% at 90% 100%,rgba(34,211,238,0.06),transparent)" }} />

      <header className="relative z-10 border-b px-4 sm:px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <div className="flex items-center gap-3">
          <Link href="/portal"><img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" /></Link>
          <div>
            <p className="text-[9px] font-mono tracking-[0.3em]" style={{ color: P.purple }}>BLOOM SOCIETY PORTAL</p>
            <p className="font-serif font-bold text-sm" style={{ color: P.heading }}>Task Inbox</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-[10px] font-mono font-bold text-white transition-all tracking-widest"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          + NEW TASK
        </button>
      </header>

      <nav className="relative z-10 border-b px-4 sm:px-6 flex gap-0 overflow-x-auto" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderColor: "rgba(168,85,247,0.12)" }}>
        {navLinks.map(i=>(
          <Link key={i.href} href={i.href}
            className="px-4 py-3 text-[10px] font-mono border-b-2 transition-all whitespace-nowrap"
            style={i.href==="/portal/tasks" ? { color: P.purple, borderColor: P.purple } : { color: P.muted, borderColor: "transparent" }}>
            {i.l}
          </Link>
        ))}
      </nav>

      {/* New task modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background: "rgba(30,27,75,0.5)", backdropFilter: "blur(8px)" }}>
          <form onSubmit={submit} className="rounded-2xl p-7 w-full max-w-lg space-y-4" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 32px 80px rgba(168,85,247,0.2)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono tracking-widest" style={{ color: P.purple }}>NEW TASK FOR YOUR GRAHAM</p>
              <button type="button" onClick={()=>setShowForm(false)} className="text-lg font-mono" style={{ color: P.muted }}>×</button>
            </div>
            <div>
              <label className={labelCls} style={{ color: P.muted }}>Task Title *</label>
              <input required value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className={inputCls} style={inputStyle} placeholder="e.g. Prepare Q3 VAT filing summary" />
            </div>
            <div>
              <label className={labelCls} style={{ color: P.muted }}>Description</label>
              <textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls+" resize-none"} style={inputStyle} placeholder="Provide any relevant context, data sources, or expected output..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} style={{ color: P.muted }}>Module</label>
                <select value={form.module} onChange={e=>setForm(f=>({...f,module:e.target.value}))} className={inputCls} style={inputStyle}>
                  {MODULES.map(m=><option key={m} value={m}>{MODULE_LABELS[m]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: P.muted }}>Priority</label>
                <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className={inputCls} style={inputStyle}>
                  {["low","medium","high","critical"].map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-50 tracking-widest"
              style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
              {submitting ? "SUBMITTING..." : "SUBMIT TASK →"}
            </button>
          </form>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-mono text-xs animate-pulse" style={{ color: P.purple }}>LOADING...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
            <p className="font-mono text-2xl mb-3" style={{ color: P.purple }}>◎</p>
            <p className="font-semibold mb-2" style={{ color: P.heading }}>No tasks yet</p>
            <p className="text-sm mb-6" style={{ color: P.body }}>Submit your first task and your Graham will get to work.</p>
            <button onClick={()=>setShowForm(true)} className="px-5 py-2.5 rounded-xl text-[10px] font-mono font-bold text-white transition-all tracking-widest"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              + NEW TASK
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-[9px] font-mono" style={{ color: P.muted }}>{tasks.length} TASKS</p>
              <div className="flex gap-1.5 flex-wrap">
                {["all","pending","in_progress","completed"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)}
                    className="px-2.5 py-1 text-[9px] font-mono rounded-xl transition-all capitalize"
                    style={filter===f
                      ? { background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff" }
                      : { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(168,85,247,0.2)", color: P.body }
                    }>
                    {f.replace("_"," ")}
                  </button>
                ))}
              </div>
            </div>
            {filtered.map(t => {
              const sc = STATUS_COLORS[t.status];
              return (
                <div key={t.id} className="rounded-2xl p-4 hover:shadow-sm transition-all" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase"
                          style={{ background: sc?.bg, color: sc?.text, border: `1px solid ${sc?.border}` }}>
                          {t.status.replace("_"," ")}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase" style={{ color: PRIORITY_COLORS[t.priority] }}>{t.priority}</span>
                      </div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: P.heading }}>{t.title}</p>
                      {t.description && <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: P.body }}>{t.description}</p>}
                      {t.adminNotes && (
                        <div className="mt-2 p-2 rounded-xl" style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.2)" }}>
                          <p className="text-[9px] font-mono mb-0.5" style={{ color: P.purple }}>GRAHAM NOTE</p>
                          <p className="text-[10px]" style={{ color: P.body }}>{t.adminNotes}</p>
                        </div>
                      )}
                      <TaskThread task={t} token={token} />
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-mono" style={{ color: P.muted }}>{new Date(t.createdAt).toLocaleDateString()}</p>
                      <p className="text-[9px] font-mono capitalize mt-0.5" style={{ color: P.purple }}>{MODULE_LABELS[t.module] ?? t.module}</p>
                      {t.completedAt && <p className="text-[8px] font-mono mt-0.5" style={{ color: "#00c45a" }}>✓ Done</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
