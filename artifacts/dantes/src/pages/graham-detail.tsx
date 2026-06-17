import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Check, X, Clock, AlertTriangle } from "lucide-react";

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

const TASK_PRIORITY_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  low: { color: "#64748b", icon: <Clock className="w-3 h-3" /> },
  medium: { color: "#06b6d4", icon: <Clock className="w-3 h-3" /> },
  high: { color: "#f97316", icon: <AlertTriangle className="w-3 h-3" /> },
  critical: { color: "#ef4444", icon: <AlertTriangle className="w-3 h-3" /> },
};

const TASK_STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: "#D4AF37", label: "PENDING" },
  in_progress: { color: "#06b6d4", label: "IN PROGRESS" },
  completed: { color: "#00ff88", label: "DONE" },
  cancelled: { color: "#64748b", label: "CANCELLED" },
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
type Task = {
  id: number;
  agentId: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
};

function TaskForm({ agentId, onClose, onCreated }: { agentId: number; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", type: "operations", status: "pending", priority: "medium", dueDate: "", notes: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/graham-agents/${agentId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dueDate: form.dueDate || undefined, description: form.description || undefined, notes: form.notes || undefined }),
      });
      onCreated();
      onClose();
    } finally { setSaving(false); }
  }

  const inputCls = "w-full bg-[#0a1628] border border-[#0d1b35] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60 font-mono placeholder:text-[#3a5570]";
  const labelCls = "block text-[10px] font-mono text-[#3a5570] mb-1 uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="bg-[#040c1a] border border-[#D4AF37]/15 rounded-sm p-5 space-y-4">
      <div className="font-mono text-[#D4AF37] text-[10px] tracking-widest">NEW TASK</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className={labelCls}>Task Title *</label>
          <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="e.g. File Q2 VAT return" />
        </div>
        <div>
          <label className={labelCls}>Module</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
            {ALL_MODULES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Priority</label>
          <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className={inputCls}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls + " resize-none"} placeholder="Task details..." />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest disabled:opacity-50">
          {saving ? "ADDING..." : "ADD TASK"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-[#0a1628] text-[#3a5570] text-[10px] font-mono rounded-sm hover:text-white transition-colors">CANCEL</button>
      </div>
    </form>
  );
}

export default function GrahamDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0");

  const [graham, setGraham] = useState<Graham | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function loadTasks() {
    const r = await fetch(`/api/graham-agents/${id}/tasks`);
    const d = await r.json();
    setTasks(Array.isArray(d) ? d : []);
  }

  useEffect(() => {
    Promise.all([
      fetch(`/api/graham-agents/${id}`).then(r => r.json()),
      fetch(`/api/graham-agents/${id}/tasks`).then(r => r.json()),
    ]).then(([g, t]) => {
      setGraham(g);
      setTasks(Array.isArray(t) ? t : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function updateTaskStatus(taskId: number, status: string) {
    await fetch(`/api/tasks/${taskId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status } : t));
  }

  async function updateAgentStatus(status: string) {
    setUpdatingStatus(true);
    await fetch(`/api/graham-agents/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setGraham(g => g ? { ...g, status } : g);
    setUpdatingStatus(false);
  }

  if (loading) return <Layout><div className="max-w-5xl mx-auto space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div></Layout>;
  if (!graham) return <Layout><div className="max-w-5xl mx-auto p-12 text-center text-[#3a5570] font-mono">Graham agent not found.</div></Layout>;

  const st = STATUS_CONFIG[graham.status];
  const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
  const doneTasks = tasks.filter(t => t.status === "completed");

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="font-mono text-[#D4AF37] text-sm tracking-widest mb-1">{graham.code}</div>
              <h1 className="text-2xl font-serif font-black text-white mb-1">{graham.name}</h1>
              {graham.clientName && (
                <p className="text-xs font-mono text-[#3a5570]">
                  Deployed for: <span className="text-white">{graham.clientName}</span>
                  {graham.clientIndustry && <span className="text-[#3a5570]"> · {graham.clientIndustry.replace(/_/g, " ")}</span>}
                </p>
              )}
              {graham.objective && <p className="text-sm text-[#4a6080] mt-3 max-w-lg leading-relaxed">{graham.objective}</p>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-sm border" style={{ color: st?.color ?? "#3a5570", borderColor: (st?.color ?? "#3a5570") + "30", backgroundColor: (st?.color ?? "#3a5570") + "10" }}>
                <span className={`w-2 h-2 rounded-full ${graham.status === "active" ? "animate-pulse" : ""}`} style={{ backgroundColor: st?.color ?? "#3a5570" }} />
                {st?.label ?? graham.status}
              </div>
              <select value={graham.status} onChange={e => updateAgentStatus(e.target.value)} disabled={updatingStatus}
                className="text-[10px] font-mono bg-[#0a1628] border border-[#0d1b35] text-[#3a5570] rounded-sm px-2 py-1.5 focus:outline-none hover:border-[#D4AF37]/30">
                <option value="configuring">Set: Configuring</option>
                <option value="standby">Set: Standby</option>
                <option value="active">Set: Active</option>
                <option value="suspended">Set: Suspended</option>
              </select>
            </div>
          </div>

          {/* Modules */}
          <div className="mt-5 pt-5 border-t border-[#0d1b35]">
            <p className="text-[10px] font-mono text-[#3a5570] tracking-widest mb-3">ACTIVE MODULES</p>
            <div className="flex flex-wrap gap-2">
              {graham.modules.length === 0 ? (
                <span className="text-[10px] font-mono text-[#2a4060]">No modules configured</span>
              ) : graham.modules.map(m => {
                const mod = ALL_MODULES.find(x => x.id === m);
                return (
                  <span key={m} className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-sm border" style={{ color: mod?.color ?? "#3a5570", borderColor: (mod?.color ?? "#3a5570") + "30", backgroundColor: (mod?.color ?? "#3a5570") + "10" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mod?.color ?? "#3a5570" }} />
                    {mod?.label ?? m}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 pt-5 border-t border-[#0d1b35] grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-mono text-2xl font-bold text-[#D4AF37]">{tasks.length}</p>
              <p className="text-[9px] font-mono text-[#3a5570] tracking-wider">TOTAL TASKS</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-[#06b6d4]">{pendingTasks.length}</p>
              <p className="text-[9px] font-mono text-[#3a5570] tracking-wider">IN PROGRESS</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-[#00ff88]">{doneTasks.length}</p>
              <p className="text-[9px] font-mono text-[#3a5570] tracking-wider">COMPLETED</p>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-serif font-bold text-white">Task Queue</h2>
            <button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors tracking-widest">
              <Plus className="w-3 h-3" />
              ADD TASK
            </button>
          </div>

          {showTaskForm && <div className="mb-4"><TaskForm agentId={id} onClose={() => setShowTaskForm(false)} onCreated={loadTasks} /></div>}

          <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#3a5570] font-mono text-sm">No tasks assigned to this Graham.</p>
              </div>
            ) : tasks.map(task => {
              const tst = TASK_STATUS_CONFIG[task.status];
              const prio = TASK_PRIORITY_CONFIG[task.priority];
              const mod = ALL_MODULES.find(m => m.id === task.type);
              return (
                <div key={task.id} className="flex items-start gap-4 px-5 py-4 border-b border-[#0d1b35]/60 last:border-0 hover:bg-[#0a1628]/30 transition-colors group">
                  <div className="flex gap-1.5 mt-0.5">
                    {task.status !== "completed" && task.status !== "cancelled" && (
                      <button onClick={() => updateTaskStatus(task.id, "completed")}
                        className="w-7 h-7 rounded-sm border border-[#0d1b35] flex items-center justify-center text-[#3a5570] hover:border-[#00ff88] hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-all">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(task.status === "completed" || task.status === "cancelled") && (
                      <div className="w-7 h-7 rounded-sm border border-[#00ff88]/30 bg-[#00ff88]/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#00ff88]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-[#3a5570]" : "text-white"}`}>{task.title}</p>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm" style={{ color: prio?.color, backgroundColor: (prio?.color ?? "#3a5570") + "15" }}>{task.priority.toUpperCase()}</span>
                    </div>
                    {task.description && <p className="text-xs text-[#3a5570] mb-1">{task.description}</p>}
                    <div className="flex items-center gap-3 text-[9px] font-mono text-[#2a4060]">
                      {mod && <span style={{ color: mod.color + "80" }}>{mod.label}</span>}
                      {task.dueDate && <span>Due {new Date(task.dueDate + "T00:00:00").toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono" style={{ color: tst?.color ?? "#3a5570" }}>{tst?.label ?? task.status}</span>
                    {task.status !== "cancelled" && task.status !== "completed" && (
                      <button onClick={() => updateTaskStatus(task.id, "cancelled")}
                        className="p-1.5 opacity-0 group-hover:opacity-100 text-[#3a5570] hover:text-red-400 transition-all rounded-sm hover:bg-red-400/10">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Private notes */}
        {graham.notes && (
          <div className="bg-[#040c1a] border border-[#D4AF37]/10 rounded-sm p-5">
            <p className="text-[9px] font-mono text-[#D4AF37]/50 tracking-widest mb-3">BLOOM SOCIETY — PRIVATE NOTES</p>
            <p className="text-xs text-[#3a5570] leading-relaxed">{graham.notes}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
