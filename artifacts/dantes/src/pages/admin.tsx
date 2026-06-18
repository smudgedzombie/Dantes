import { useState, useEffect } from "react";
import { useAuth } from "@clerk/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type StaffRequest = { id:number; email:string; fullName:string; role:string; reason:string; status:string; permittedTabs:string[]; adminNotes:string|null; createdAt:string; reviewedAt:string|null };
type MemberApp = { id:number; fullName:string; email:string; phone:string|null; company:string|null; country:string|null; industry:string|null; businessDescription:string; grahamGoals:string; budget:string|null; referral:string|null; status:string; quotationAmount:string|null; quotationNotes:string|null; adminNotes:string|null; bloomMemberId:string|null; bloomSecretPassword:string|null; assignedGrahamId:string|null; createdAt:string; quotationSentAt:string|null; paidAt:string|null };
type VaultClient = { member: MemberApp; vault: { id:number; healthScore:number; monthlyValueUsd:number; totalPaidUsd:number; riskLevel:string; privateNotes:string|null; contractNotes:string|null; tags:string[]; engagementStartDate:string|null; contractSignedAt:string|null } | null };
type RevenueData = { summary:{ totalApplications:number; activeMembers:number; pipelineCount:number; mrr:number; arr:number; totalRevenue:number; pipelineValue:number; avgDealSize:number }; statusBreakdown:{status:string;count:number;value:number}[]; referrals:{source:string;count:number}[]; industries:{industry:string;count:number}[]; monthlyTrend:{label:string;applications:number;activations:number}[]; healthBands:{label:string;count:number}[] };
type AuditLog = { id:number; adminEmail:string; action:string; targetType:string; targetId:string|null; details:unknown; createdAt:string };
type ClientTask = { id:number; clientEmail:string; grahamCode:string|null; title:string; description:string|null; module:string; priority:string; status:string; adminNotes:string|null; completedAt:string|null; createdAt:string };
type GrahamBoard = { memberId:number; memberName:string; memberEmail:string; company:string|null; bloomMemberId:string|null; grahamCode:string|null; agentStatus:string; agentModules:string[]; agentObjective:string|null; deployedAt:string|null };
type GrahamSummary = { total:number; active:number; configuring:number; standby:number; unassigned:number };
type Comment = { id:number; taskId:number; authorType:string; authorName:string; content:string; createdAt:string };

const ALL_TABS = ["command","grahams","clients","dashboard","transactions","accounts"];
const GOLD = "#D4AF37";
const STATUS_COLORS: Record<string,string> = {
  pending:"bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  denied:"bg-red-500/10 text-red-400 border-red-500/20",
  reviewing:"bg-blue-500/10 text-blue-400 border-blue-500/20",
  quoted:"bg-purple-500/10 text-purple-400 border-purple-500/20",
  paid:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  active:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected:"bg-red-500/10 text-red-400 border-red-500/20",
};
const AGENT_STATUS_COLORS: Record<string,string> = {
  active: "#00ff88", configuring: "#D4AF37", standby: "#06b6d4", inactive: "#3a5570", unassigned: "#2a4060",
};
const PIE_COLORS = ["#D4AF37","#06b6d4","#8b5cf6","#22c55e","#f97316","#ec4899","#64748b"];

const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";
const inputCls = "w-full bg-[#030810] border border-[#0d1b35] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono placeholder:text-[#2a4060] transition-colors";
const labelCls = "block text-[9px] font-mono text-[#3a5570] mb-1 uppercase tracking-widest";
const btnPrimary = "px-4 py-2 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest";
const btnSec = "px-4 py-2 bg-[#0a1628] border border-[#0d1b35] text-[#3a5570] text-[10px] font-mono rounded-sm hover:text-white transition-colors";

function Badge({ status }: { status: string }) {
  return <span className={`inline-flex px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${STATUS_COLORS[status]??""}`}>{status}</span>;
}
function EmptyPanel({ text }: { text: string }) {
  return <div className={`${panelCls} p-12 text-center`}><p className="text-[#2a4060] text-xs font-mono">{text}</p></div>;
}

export default function AdminPage() {
  const { getToken } = useAuth();
  const [tab, setTab] = useState<"members"|"staff"|"revenue"|"vault"|"tasks"|"audit"|"grahams">("members");
  const [staffReqs, setStaffReqs] = useState<StaffRequest[]>([]);
  const [memberApps, setMemberApps] = useState<MemberApp[]>([]);
  const [vaultClients, setVaultClients] = useState<VaultClient[]>([]);
  const [revenue, setRevenue] = useState<RevenueData|null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminTasks, setAdminTasks] = useState<ClientTask[]>([]);
  const [grahamBoard, setGrahamBoard] = useState<GrahamBoard[]>([]);
  const [grahamSummary, setGrahamSummary] = useState<GrahamSummary|null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<MemberApp|null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffRequest|null>(null);
  const [selectedVault, setSelectedVault] = useState<VaultClient|null>(null);
  const [saving, setSaving] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportType, setExportType] = useState("members");
  const [exporting, setExporting] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ clientEmail:"", period:"", amountUsd:"", currency:"USD", notes:"", paymentLink:"", dueDate:"" });
  const [invoiceSaving, setInvoiceSaving] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");

  async function apiFetch(path: string, opts?: RequestInit) {
    const token = await getToken();
    return fetch(path, { ...opts, headers: { ...(opts?.headers??{}), Authorization:`Bearer ${token}`, ...(opts?.body?{"Content-Type":"application/json"}:{}) } });
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [sr, ma] = await Promise.all([
        apiFetch("/api/staff-requests").then(r=>r.json()),
        apiFetch("/api/member-applications").then(r=>r.json()),
      ]);
      setStaffReqs(Array.isArray(sr)?sr:[]);
      setMemberApps(Array.isArray(ma)?ma:[]);
    } finally { setLoading(false); }
  }

  async function loadRevenue() { const r = await apiFetch("/api/admin/revenue"); if(r.ok) setRevenue(await r.json()); }
  async function loadVault() { const r = await apiFetch("/api/vault/clients"); if(r.ok) setVaultClients(await r.json()); }
  async function loadAudit() { const r = await apiFetch("/api/admin/audit?limit=200"); if(r.ok) setAuditLogs(await r.json()); }
  async function loadTasks() { const r = await apiFetch("/api/admin/tasks"); if(r.ok) setAdminTasks(await r.json()); }
  async function loadGrahams() { const r = await apiFetch("/api/admin/grahams"); if(r.ok) { const d = await r.json(); setGrahamBoard(d.board); setGrahamSummary(d.summary); } }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => {
    if (tab==="revenue" && !revenue) loadRevenue();
    if (tab==="vault" && vaultClients.length===0) loadVault();
    if (tab==="audit" && auditLogs.length===0) loadAudit();
    if (tab==="tasks" && adminTasks.length===0) loadTasks();
    if (tab==="grahams" && grahamBoard.length===0) loadGrahams();
  }, [tab]);

  async function patchStaff(id:number, body:object) {
    setSaving(true);
    try { const r = await apiFetch(`/api/staff-requests/${id}`,{method:"PATCH",body:JSON.stringify(body)}); const u=await r.json(); setStaffReqs(rs=>rs.map(x=>x.id===id?u:x)); setSelectedStaff(u); }
    finally { setSaving(false); }
  }
  async function patchMember(id:number, body:object) {
    setSaving(true);
    try { const r = await apiFetch(`/api/member-applications/${id}`,{method:"PATCH",body:JSON.stringify(body)}); const u=await r.json(); setMemberApps(rs=>rs.map(x=>x.id===id?u:x)); setSelectedMember(u); }
    finally { setSaving(false); }
  }
  async function patchVault(memberId:number, body:object) {
    setSaving(true);
    try { await apiFetch(`/api/vault/clients/${memberId}`,{method:"PATCH",body:JSON.stringify(body)}); await loadVault(); }
    finally { setSaving(false); }
  }
  async function patchTask(id:number, body:object) {
    setSaving(true);
    try { const r = await apiFetch(`/api/portal/tasks/${id}`,{method:"PATCH",body:JSON.stringify(body)}); const u=await r.json(); setAdminTasks(ts=>ts.map(t=>t.id===id?u:t)); }
    finally { setSaving(false); }
  }
  async function postActivity(clientEmail:string, grahamCode:string, data:object) {
    setSaving(true);
    try { await apiFetch("/api/portal/activities",{method:"POST",body:JSON.stringify({clientEmail,grahamCode,...data})}); }
    finally { setSaving(false); }
  }

  async function exportCSV() {
    setExporting(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/export?type=${exportType}&format=csv`, { headers: { Authorization:`Bearer ${token}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `bloom-${exportType}-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    } finally { setExporting(false); setShowExport(false); }
  }

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault(); setInvoiceSaving(true); setInvoiceError("");
    try {
      const r = await apiFetch("/api/portal/invoices", { method:"POST", body:JSON.stringify(invoiceForm) });
      if (!r.ok) { const d = await r.json(); setInvoiceError(d.error ?? "Failed"); return; }
      setShowInvoiceModal(false);
      setInvoiceForm({ clientEmail:"", period:"", amountUsd:"", currency:"USD", notes:"", paymentLink:"", dueDate:"" });
    } finally { setInvoiceSaving(false); }
  }

  const TABS = [
    {id:"members",label:`Members (${memberApps.length})`},
    {id:"staff",label:`Staff (${staffReqs.length})`},
    {id:"revenue",label:"Revenue"},
    {id:"vault",label:"Vault"},
    {id:"tasks",label:`Tasks${adminTasks.length>0?` (${adminTasks.filter(t=>t.status==="pending").length} open)`:""}`},
    {id:"grahams",label:"Grahams"},
    {id:"audit",label:"Audit"},
  ];

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{backgroundImage:"linear-gradient(rgba(212,175,55,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.05) 1px,transparent 1px)",backgroundSize:"60px 60px"}} />
      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-0.5">THE BLOOM SOCIETY</p>
          <h1 className="text-lg font-serif font-black text-white tracking-wide">Admin Command Hub</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>setShowInvoiceModal(true)} className={btnSec}>+ INVOICE</button>
          <button onClick={()=>setShowExport(true)} className={btnSec}>⬇ EXPORT</button>
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#D4AF37] rounded-full" /><span className="text-[9px] font-mono text-[#D4AF37]">SUPER ADMIN</span></div>
        </div>
      </header>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-[#030810]/90 flex items-center justify-center z-50 px-6">
          <div className={`${panelCls} p-7 w-full max-w-sm space-y-4`}>
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">EXPORT DATA</p>
              <button onClick={()=>setShowExport(false)} className="text-[#3a5570] hover:text-white text-lg font-mono">×</button>
            </div>
            <div>
              <p className={labelCls}>Dataset</p>
              <div className="grid grid-cols-2 gap-2">
                {[{v:"members",l:"Members"},{v:"tasks",l:"Tasks"},{v:"audit",l:"Audit Log"},{v:"invoices",l:"Invoices"}].map(o=>(
                  <button key={o.v} onClick={()=>setExportType(o.v)} className={`py-2 text-[10px] font-mono border rounded-sm transition-colors ${exportType===o.v?"bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]":"bg-[#030810] border-[#0d1b35] text-[#3a5570] hover:text-white"}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <button disabled={exporting} onClick={exportCSV} className={`w-full py-2.5 ${btnPrimary}`}>
              {exporting ? "EXPORTING..." : `⬇ DOWNLOAD ${exportType.toUpperCase()} CSV`}
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-[#030810]/90 flex items-center justify-center z-50 px-6">
          <form onSubmit={createInvoice} className={`${panelCls} p-7 w-full max-w-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">CREATE INVOICE</p>
              <button type="button" onClick={()=>setShowInvoiceModal(false)} className="text-[#3a5570] hover:text-white text-lg font-mono">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className={labelCls}>Client Email *</label>
                <select value={invoiceForm.clientEmail} onChange={e=>setInvoiceForm(f=>({...f,clientEmail:e.target.value}))} className={inputCls} required>
                  <option value="">Select member…</option>
                  {memberApps.filter(m=>m.status==="active").map(m=><option key={m.id} value={m.email}>{m.fullName} ({m.email})</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Period *</label><input required value={invoiceForm.period} onChange={e=>setInvoiceForm(f=>({...f,period:e.target.value}))} className={inputCls} placeholder="e.g. June 2026" /></div>
              <div><label className={labelCls}>Amount (USD) *</label><input required value={invoiceForm.amountUsd} onChange={e=>setInvoiceForm(f=>({...f,amountUsd:e.target.value}))} className={inputCls} placeholder="e.g. 15000" /></div>
              <div><label className={labelCls}>Due Date</label><input type="date" value={invoiceForm.dueDate} onChange={e=>setInvoiceForm(f=>({...f,dueDate:e.target.value}))} className={inputCls} /></div>
              <div><label className={labelCls}>Currency</label>
                <select value={invoiceForm.currency} onChange={e=>setInvoiceForm(f=>({...f,currency:e.target.value}))} className={inputCls}>
                  {["USD","EUR","GBP","AED","SGD"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2"><label className={labelCls}>Payment Link</label><input value={invoiceForm.paymentLink} onChange={e=>setInvoiceForm(f=>({...f,paymentLink:e.target.value}))} className={inputCls} placeholder="https://pay.stripe.com/…" /></div>
              <div className="col-span-2"><label className={labelCls}>Notes</label><input value={invoiceForm.notes} onChange={e=>setInvoiceForm(f=>({...f,notes:e.target.value}))} className={inputCls} placeholder="Optional invoice notes" /></div>
            </div>
            {invoiceError && <p className="text-red-400 text-xs font-mono">{invoiceError}</p>}
            <p className="text-[9px] font-mono text-[#3a5570]">An email notification will be sent to the client automatically.</p>
            <button type="submit" disabled={invoiceSaving} className={`w-full py-2.5 ${btnPrimary}`}>
              {invoiceSaving ? "CREATING..." : "CREATE INVOICE & NOTIFY →"}
            </button>
          </form>
        </div>
      )}

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-6 border-b border-[#0d1b35] overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as typeof tab)} className={`px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-all ${tab===t.id?"border-b-2 border-[#D4AF37] text-[#D4AF37]":"text-[#3a5570] hover:text-white"}`}>{t.label}</button>
          ))}
        </div>

        {loading && (tab==="members"||tab==="staff") ? (
          <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING...</span></div>
        ) : (
          <>
            {tab==="members" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-3">{memberApps.length} APPLICATIONS</p>
                  {memberApps.map(m=>(
                    <div key={m.id} onClick={()=>setSelectedMember(m)} className={`${panelCls} p-4 cursor-pointer hover:border-[#D4AF37]/20 transition-colors ${selectedMember?.id===m.id?"border-[#D4AF37]/30 bg-[#D4AF37]/5":""}`}>
                      <div className="flex items-start justify-between mb-1"><div><p className="text-xs font-semibold text-white">{m.fullName}</p><p className="text-[10px] font-mono text-[#3a5570]">{m.email}</p></div><Badge status={m.status} /></div>
                      <p className="text-[10px] text-[#2a4060]">{m.company||m.industry||"—"} · {m.country||"—"}</p>
                    </div>
                  ))}
                  {memberApps.length===0&&<p className="text-[#2a4060] text-xs font-mono py-8 text-center">No applications yet</p>}
                </div>
                <div className="lg:col-span-2">
                  {selectedMember ? <MemberDetail member={selectedMember} onPatch={patchMember} saving={saving} onPostActivity={postActivity} /> : <EmptyPanel text="SELECT A MEMBER TO REVIEW" />}
                </div>
              </div>
            )}

            {tab==="staff" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-3">{staffReqs.length} REQUESTS</p>
                  {staffReqs.map(r=>(
                    <div key={r.id} onClick={()=>setSelectedStaff(r)} className={`${panelCls} p-4 cursor-pointer hover:border-[#D4AF37]/20 transition-colors ${selectedStaff?.id===r.id?"border-[#D4AF37]/30 bg-[#D4AF37]/5":""}`}>
                      <div className="flex items-start justify-between mb-1"><div><p className="text-xs font-semibold text-white">{r.fullName}</p><p className="text-[10px] font-mono text-[#3a5570]">{r.email}</p></div><Badge status={r.status} /></div>
                      <p className="text-[10px] text-[#2a4060]">{r.role}</p>
                    </div>
                  ))}
                  {staffReqs.length===0&&<p className="text-[#2a4060] text-xs font-mono py-8 text-center">No requests yet</p>}
                </div>
                <div className="lg:col-span-2">
                  {selectedStaff ? <StaffDetail req={selectedStaff} onPatch={patchStaff} saving={saving} /> : <EmptyPanel text="SELECT A REQUEST TO REVIEW" />}
                </div>
              </div>
            )}

            {tab==="revenue" && <RevenueTab revenue={revenue} onLoad={loadRevenue} />}
            {tab==="vault" && <VaultTab clients={vaultClients} onPatch={patchVault} saving={saving} selected={selectedVault} setSelected={setSelectedVault} />}
            {tab==="tasks" && <TasksTab tasks={adminTasks} onPatch={patchTask} saving={saving} apiFetch={apiFetch} onReload={loadTasks} />}
            {tab==="grahams" && <GrahamsTab board={grahamBoard} summary={grahamSummary} onReload={loadGrahams} />}
            {tab==="audit" && <AuditTab logs={auditLogs} onLoad={loadAudit} />}
          </>
        )}
      </div>
    </div>
  );
}

function MemberDetail({ member, onPatch, saving, onPostActivity }:{member:MemberApp;onPatch:(id:number,b:object)=>void;saving:boolean;onPostActivity:(e:string,g:string,d:object)=>void}) {
  const [notes,setNotes]=useState(member.adminNotes??"");
  const [quoteAmt,setQuoteAmt]=useState(member.quotationAmount??"");
  const [quoteNotes,setQuoteNotes]=useState(member.quotationNotes??"");
  const [bloomId,setBloomId]=useState(member.bloomMemberId??"");
  const [secret,setSecret]=useState(member.bloomSecretPassword??"");
  const [grahamId,setGrahamId]=useState(member.assignedGrahamId??"");
  const [actTitle,setActTitle]=useState(""); const [actDesc,setActDesc]=useState(""); const [actModule,setActModule]=useState("operations");
  useEffect(()=>{setNotes(member.adminNotes??"");setQuoteAmt(member.quotationAmount??"");setQuoteNotes(member.quotationNotes??"");setBloomId(member.bloomMemberId??"");setSecret(member.bloomSecretPassword??"");setGrahamId(member.assignedGrahamId??"");},[member.id]);

  return (
    <div className={`${panelCls} p-6 space-y-5 overflow-y-auto max-h-[80vh]`}>
      <div className="flex items-start justify-between"><div><h3 className="text-base font-serif font-bold text-white mb-0.5">{member.fullName}</h3><p className="text-xs font-mono text-[#3a5570]">{member.email} · {member.phone??"-"}</p></div><Badge status={member.status}/></div>
      <div className="grid grid-cols-2 gap-2 text-xs">{([["Company",member.company],["Country",member.country],["Industry",member.industry],["Budget",member.budget],["Referral",member.referral]] as [string,string|null][]).filter(([,v])=>v).map(([l,v])=><div key={l}><span className="text-[#3a5570] font-mono text-[9px]">{l}: </span><span className="text-white">{v}</span></div>)}</div>
      <div><p className={labelCls}>Business Description</p><p className="text-xs text-[#8aa0b8] leading-relaxed bg-[#030810] border border-[#0d1b35] rounded-sm p-3">{member.businessDescription}</p></div>
      <div><p className={labelCls}>Graham Goals</p><p className="text-xs text-[#8aa0b8] leading-relaxed bg-[#030810] border border-[#0d1b35] rounded-sm p-3">{member.grahamGoals}</p></div>
      <div><label className={labelCls}>Admin Notes</label><textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} className={inputCls+" resize-none"}/></div>

      <div className="border border-[#0d1b35] rounded-sm p-4 space-y-3">
        <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">QUOTATION</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Amount (USD/month)</label><input value={quoteAmt} onChange={e=>setQuoteAmt(e.target.value)} className={inputCls} placeholder="e.g. 15000"/></div>
          <div><label className={labelCls}>Notes</label><input value={quoteNotes} onChange={e=>setQuoteNotes(e.target.value)} className={inputCls}/></div>
        </div>
        <button disabled={saving} onClick={()=>onPatch(member.id,{status:"quoted",quotationAmount:quoteAmt,quotationNotes:quoteNotes,adminNotes:notes})} className={btnPrimary}>SEND QUOTATION →</button>
      </div>

      <div className="border border-[#0d1b35] rounded-sm p-4 space-y-3">
        <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">ACTIVATION</p>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Bloom Member ID</label><input value={bloomId} onChange={e=>setBloomId(e.target.value)} className={inputCls} placeholder="BLM-001"/></div>
          <div><label className={labelCls}>Secret Password</label><input value={secret} onChange={e=>setSecret(e.target.value)} className={inputCls}/></div>
          <div><label className={labelCls}>Graham Agent ID</label><input value={grahamId} onChange={e=>setGrahamId(e.target.value)} className={inputCls} placeholder="GRM01"/></div>
        </div>
        <div className="flex gap-2">
          <button disabled={saving} onClick={()=>onPatch(member.id,{status:"paid",adminNotes:notes})} className={btnSec}>MARK PAID</button>
          <button disabled={saving} onClick={()=>onPatch(member.id,{status:"active",bloomMemberId:bloomId,bloomSecretPassword:secret,assignedGrahamId:grahamId,adminNotes:notes})} className={btnPrimary}>ACTIVATE MEMBER →</button>
        </div>
      </div>

      <div className="border border-[#0d1b35] rounded-sm p-4 space-y-3">
        <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">POST GRAHAM ACTIVITY</p>
        <div><label className={labelCls}>Activity Title</label><input value={actTitle} onChange={e=>setActTitle(e.target.value)} className={inputCls} placeholder="e.g. Monthly Financial Report Generated"/></div>
        <div><label className={labelCls}>Description</label><input value={actDesc} onChange={e=>setActDesc(e.target.value)} className={inputCls}/></div>
        <div><label className={labelCls}>Module</label>
          <select value={actModule} onChange={e=>setActModule(e.target.value)} className={inputCls}>
            {["financial","marketing","operations","compliance","events","export_b2b","hr","logistics"].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <button disabled={saving||!actTitle} onClick={()=>{if(member.email&&member.assignedGrahamId){onPostActivity(member.email,member.assignedGrahamId,{title:actTitle,description:actDesc,module:actModule,type:"task"});setActTitle("");setActDesc("");}}} className={btnSec}>POST ACTIVITY</button>
      </div>

      <div className="flex gap-2 flex-wrap pt-2 border-t border-[#0d1b35]">
        {["pending","reviewing","rejected"].map(s=><button key={s} disabled={saving} onClick={()=>onPatch(member.id,{status:s,adminNotes:notes})} className={btnSec}>{s.toUpperCase()}</button>)}
      </div>
    </div>
  );
}

function StaffDetail({ req, onPatch, saving }:{req:StaffRequest;onPatch:(id:number,b:object)=>void;saving:boolean}) {
  const [notes,setNotes]=useState(req.adminNotes??"");
  const [tabs,setTabs]=useState<string[]>(req.permittedTabs??[]);
  useEffect(()=>{setNotes(req.adminNotes??"");setTabs(req.permittedTabs??[]);},[req.id]);
  function toggleTab(t:string){setTabs(ts=>ts.includes(t)?ts.filter(x=>x!==t):[...ts,t]);}
  return (
    <div className={`${panelCls} p-6 space-y-5`}>
      <div className="flex items-start justify-between"><div><h3 className="text-base font-serif font-bold text-white mb-0.5">{req.fullName}</h3><p className="text-xs font-mono text-[#3a5570]">{req.email} · {req.role}</p></div><Badge status={req.status}/></div>
      <div><p className={labelCls}>Reason</p><p className="text-xs text-[#8aa0b8] bg-[#030810] border border-[#0d1b35] rounded-sm p-3">{req.reason}</p></div>
      <div><p className={labelCls}>Permitted Tabs</p>
        <div className="flex flex-wrap gap-2 mt-2">{ALL_TABS.map(t=><button key={t} onClick={()=>toggleTab(t)} className={`px-3 py-1.5 text-[10px] font-mono rounded-sm border transition-colors ${tabs.includes(t)?"bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]":"bg-[#030810] border-[#0d1b35] text-[#2a4060] hover:text-white"}`}>{t}</button>)}</div>
      </div>
      <div><label className={labelCls}>Admin Notes</label><textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} className={inputCls+" resize-none"}/></div>
      <div className="flex gap-2 pt-2 border-t border-[#0d1b35]">
        <button disabled={saving} onClick={()=>onPatch(req.id,{status:"denied",adminNotes:notes})} className={btnSec}>DENY</button>
        <button disabled={saving} onClick={()=>onPatch(req.id,{status:"approved",permittedTabs:tabs,adminNotes:notes})} className={btnPrimary}>APPROVE ACCESS →</button>
      </div>
    </div>
  );
}

function RevenueTab({ revenue, onLoad }:{revenue:RevenueData|null;onLoad:()=>void}) {
  useEffect(()=>{if(!revenue)onLoad();},[]);
  if (!revenue) return <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING REVENUE DATA...</span></div>;
  const { summary, statusBreakdown, referrals, industries, monthlyTrend, healthBands } = revenue;
  const tooltipStyle={backgroundColor:"#040c1a",border:"1px solid #0d1b35",borderRadius:"2px",fontSize:"11px",fontFamily:"monospace"};
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {l:"MRR",v:`$${summary.mrr.toLocaleString()}`,s:"Monthly Recurring Revenue",c:GOLD},
          {l:"ARR",v:`$${summary.arr.toLocaleString()}`,s:"Annual Run Rate",c:GOLD},
          {l:"ACTIVE MEMBERS",v:summary.activeMembers,s:`${summary.totalApplications} total applications`,c:"#00ff88"},
          {l:"PIPELINE VALUE",v:`$${summary.pipelineValue.toLocaleString()}`,s:`${summary.pipelineCount} prospects`,c:"#06b6d4"},
        ].map(s=><div key={s.l} className={`${panelCls} p-4`}><p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-2">{s.l}</p><p className="font-mono font-bold text-2xl" style={{color:s.c}}>{s.v}</p><p className="text-[9px] font-mono text-[#2a4060] mt-1">{s.s}</p></div>)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {l:"TOTAL COLLECTED",v:`$${summary.totalRevenue.toLocaleString()}`,c:"#22c55e"},
          {l:"AVG DEAL SIZE",v:`$${summary.avgDealSize.toLocaleString()}/mo`,c:"#8b5cf6"},
          {l:"TOTAL APPLICATIONS",v:summary.totalApplications,c:GOLD},
        ].map(s=><div key={s.l} className={`${panelCls} p-4`}><p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-2">{s.l}</p><p className="font-mono font-bold text-xl" style={{color:s.c}}>{s.v}</p></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${panelCls} p-5`}>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-4">MONTHLY APPLICATION TREND</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyTrend} barGap={2}>
              <XAxis dataKey="label" tick={{fontSize:9,fontFamily:"monospace",fill:"#3a5570"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fontFamily:"monospace",fill:"#3a5570"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Bar dataKey="applications" fill="#D4AF3740" radius={[2,2,0,0]} name="Applications"/>
              <Bar dataKey="activations" fill={GOLD} radius={[2,2,0,0]} name="Activations"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`${panelCls} p-5`}>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-4">PIPELINE STATUS BREAKDOWN</p>
          <div className="space-y-2">
            {statusBreakdown.filter(s=>s.count>0).map(s=>(
              <div key={s.status} className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-[#3a5570] w-20 capitalize">{s.status}</span>
                <div className="flex-1 h-1.5 bg-[#0d1b35] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#D4AF37]" style={{width:`${Math.max((s.count/summary.totalApplications)*100,2)}%`}}/>
                </div>
                <span className="text-[9px] font-mono text-white w-6 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${panelCls} p-5`}>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-4">TOP REFERRAL SOURCES</p>
          {referrals.length===0 ? <p className="text-[#2a4060] text-xs font-mono">No referral data yet</p> : (
            <div className="space-y-2">
              {referrals.slice(0,8).map((r,i)=>(
                <div key={r.source} className="flex items-center gap-3">
                  <span className="text-[9px] font-mono" style={{color:PIE_COLORS[i%PIE_COLORS.length]}}>{String(i+1).padStart(2,"0")}</span>
                  <span className="text-xs text-white flex-1 truncate">{r.source}</span>
                  <span className="text-[9px] font-mono text-[#D4AF37]">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={`${panelCls} p-5`}>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-4">INDUSTRIES</p>
          {industries.length===0 ? <p className="text-[#2a4060] text-xs font-mono">No data</p> : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={industries} dataKey="count" nameKey="industry" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>
                  {industries.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className={`${panelCls} p-5`}>
        <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-4">CLIENT HEALTH DISTRIBUTION</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {healthBands.map((b,i)=>{
            const colors=["#00ff88","#D4AF37","#f97316","#ef4444"];
            return <div key={b.label} className="text-center"><p className="font-mono font-bold text-3xl" style={{color:colors[i]}}>{b.count}</p><p className="text-[9px] font-mono text-[#3a5570] mt-1 leading-relaxed">{b.label}</p></div>;
          })}
        </div>
      </div>
    </div>
  );
}

function VaultTab({ clients, onPatch, saving, selected, setSelected }:{clients:VaultClient[];onPatch:(id:number,b:object)=>void;saving:boolean;selected:VaultClient|null;setSelected:(v:VaultClient|null)=>void}) {
  if (clients.length===0) return <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING VAULT...</span></div>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-3">🔐 PRINCIPALS ONLY · {clients.length} RECORDS</p>
        {clients.map(c=>(
          <div key={c.member.id} onClick={()=>setSelected(c)} className={`${panelCls} p-4 cursor-pointer hover:border-[#D4AF37]/20 transition-colors ${selected?.member.id===c.member.id?"border-[#D4AF37]/30 bg-[#D4AF37]/5":""}`}>
            <div className="flex items-start justify-between mb-1"><div><p className="text-xs font-semibold text-white">{c.member.fullName}</p><p className="text-[10px] font-mono text-[#3a5570]">{c.member.email}</p></div><Badge status={c.member.status}/></div>
            <div className="flex items-center gap-3 mt-1">
              {c.vault ? (
                <>
                  <span className="text-[9px] font-mono" style={{color:c.vault.healthScore>=70?"#00ff88":c.vault.healthScore>=40?"#D4AF37":"#ef4444"}}>♥ {c.vault.healthScore}</span>
                  {c.vault.monthlyValueUsd>0&&<span className="text-[9px] font-mono text-[#D4AF37]">${c.vault.monthlyValueUsd.toLocaleString()}/mo</span>}
                  <span className={`text-[9px] font-mono ${c.vault.riskLevel==="high"?"text-red-400":c.vault.riskLevel==="medium"?"text-amber-400":"text-[#3a5570]"}`}>{c.vault.riskLevel}</span>
                </>
              ) : <span className="text-[9px] font-mono text-[#2a4060]">no vault record</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-2">
        {selected ? <VaultDetail client={selected} onPatch={onPatch} saving={saving}/> : <EmptyPanel text="SELECT A CLIENT TO VIEW VAULT RECORD"/>}
      </div>
    </div>
  );
}

function VaultDetail({ client, onPatch, saving }:{client:VaultClient;onPatch:(id:number,b:object)=>void;saving:boolean}) {
  const v = client.vault;
  const [notes,setNotes]=useState(v?.privateNotes??"");
  const [contractNotes,setContractNotes]=useState(v?.contractNotes??"");
  const [health,setHealth]=useState(String(v?.healthScore??50));
  const [monthly,setMonthly]=useState(String(v?.monthlyValueUsd??0));
  const [totalPaid,setTotalPaid]=useState(String(v?.totalPaidUsd??0));
  const [risk,setRisk]=useState(v?.riskLevel??"normal");
  const [tags,setTags]=useState((v?.tags??[]).join(", "));
  useEffect(()=>{setNotes(v?.privateNotes??"");setContractNotes(v?.contractNotes??"");setHealth(String(v?.healthScore??50));setMonthly(String(v?.monthlyValueUsd??0));setTotalPaid(String(v?.totalPaidUsd??0));setRisk(v?.riskLevel??"normal");setTags((v?.tags??[]).join(", "));},[client.member.id]);

  return (
    <div className={`${panelCls} p-6 space-y-5 overflow-y-auto max-h-[80vh]`}>
      <div className="flex items-start justify-between">
        <div><h3 className="text-base font-serif font-bold text-white">{client.member.fullName}</h3><p className="text-xs font-mono text-[#3a5570]">{client.member.email} · {client.member.bloomMemberId||"no ID"}</p></div>
        <span className="px-2 py-1 border border-[#D4AF37]/30 rounded-sm text-[9px] font-mono text-[#D4AF37]">🔐 VAULT</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">{([["Graham",client.member.assignedGrahamId],["Company",client.member.company],["Country",client.member.country],["Joined",new Date(client.member.createdAt).toLocaleDateString()]] as [string,string|null][]).map(([l,v])=><div key={l}><span className="text-[#3a5570] font-mono text-[9px]">{l}: </span><span className="text-white">{v||"—"}</span></div>)}</div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>Health Score (0-100)</label><input type="number" min={0} max={100} value={health} onChange={e=>setHealth(e.target.value)} className={inputCls}/></div>
        <div><label className={labelCls}>Monthly Value (USD)</label><input value={monthly} onChange={e=>setMonthly(e.target.value)} className={inputCls} placeholder="0"/></div>
        <div><label className={labelCls}>Total Paid (USD)</label><input value={totalPaid} onChange={e=>setTotalPaid(e.target.value)} className={inputCls} placeholder="0"/></div>
      </div>
      <div><label className={labelCls}>Risk Level</label>
        <select value={risk} onChange={e=>setRisk(e.target.value)} className={inputCls}>
          {["normal","medium","high"].map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
        </select>
      </div>
      <div><label className={labelCls}>Tags (comma separated)</label><input value={tags} onChange={e=>setTags(e.target.value)} className={inputCls} placeholder="vip, upsell, at-risk"/></div>
      <div><label className={labelCls}>🔐 Private Notes (principals only)</label><textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} className={inputCls+" resize-none"} placeholder="Confidential observations, client personality, relationship notes..."/></div>
      <div><label className={labelCls}>Contract Notes</label><textarea rows={2} value={contractNotes} onChange={e=>setContractNotes(e.target.value)} className={inputCls+" resize-none"} placeholder="Engagement terms, custom agreements, renewal notes..."/></div>
      <button disabled={saving} onClick={()=>onPatch(client.member.id,{privateNotes:notes,contractNotes,healthScore:parseInt(health)||50,monthlyValueUsd:monthly,totalPaidUsd:totalPaid,riskLevel:risk,tags:tags.split(",").map(t=>t.trim()).filter(Boolean)})} className={`w-full py-2.5 ${btnPrimary}`}>SAVE VAULT RECORD →</button>
    </div>
  );
}

function TasksTab({ tasks, onPatch, saving, apiFetch, onReload }:{tasks:ClientTask[];onPatch:(id:number,b:object)=>void;saving:boolean;apiFetch:(p:string,o?:RequestInit)=>Promise<Response>;onReload:()=>void}) {
  const STATUS_TC: Record<string,string> = {pending:"text-amber-400",in_progress:"text-blue-400",completed:"text-emerald-400",cancelled:"text-red-400"};
  const [expanded, setExpanded] = useState<number|null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [adminNoteEditing, setAdminNoteEditing] = useState<Record<number,string>>({});
  const [reply, setReply] = useState<Record<number,string>>({});
  const [sendingReply, setSendingReply] = useState<Record<number,boolean>>({});

  async function loadComments(taskId: number) {
    const r = await apiFetch(`/api/portal/tasks/${taskId}/comments`);
    if (r.ok) { const data = await r.json(); setComments(c => ({ ...c, [taskId]: data })); }
  }

  async function toggleExpand(taskId: number) {
    if (expanded === taskId) { setExpanded(null); return; }
    setExpanded(taskId);
    if (!comments[taskId]) await loadComments(taskId);
  }

  async function sendReply(taskId: number) {
    const content = reply[taskId]?.trim();
    if (!content) return;
    setSendingReply(s => ({ ...s, [taskId]: true }));
    try {
      const r = await apiFetch(`/api/portal/tasks/${taskId}/comments`, { method:"POST", body:JSON.stringify({ content }) });
      if (r.ok) {
        const c = await r.json();
        setComments(cs => ({ ...cs, [taskId]: [...(cs[taskId] ?? []), c] }));
        setReply(rs => ({ ...rs, [taskId]: "" }));
      }
    } finally { setSendingReply(s => ({ ...s, [taskId]: false })); }
  }

  async function saveNote(task: ClientTask) {
    const note = adminNoteEditing[task.id] ?? task.adminNotes ?? "";
    onPatch(task.id, { adminNotes: note });
  }

  if (tasks.length===0) return <div className={`${panelCls} p-16 text-center`}><p className="text-[#2a4060] text-xs font-mono">No client tasks yet. Tasks submitted via the client portal will appear here.</p></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-mono text-[#3a5570] tracking-widest">{tasks.length} CLIENT TASKS</p>
        <p className="text-[9px] font-mono text-[#D4AF37]">{tasks.filter(t=>t.status==="pending").length} PENDING REVIEW</p>
      </div>
      {tasks.map(t=>(
        <div key={t.id} className={`${panelCls} p-4`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-mono font-bold uppercase ${STATUS_TC[t.status]}`}>{t.status.replace("_"," ")}</span>
                <span className="text-[9px] font-mono text-[#D4AF37] capitalize">{t.priority}</span>
                <span className="text-[9px] font-mono text-[#3a5570] capitalize">{t.module}</span>
              </div>
              <p className="text-sm font-semibold text-white mb-0.5">{t.title}</p>
              {t.description&&<p className="text-[10px] text-[#3a5570] line-clamp-2">{t.description}</p>}
              <p className="text-[9px] font-mono text-[#2a4060] mt-1">{t.clientEmail} · {new Date(t.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              {t.status==="pending"&&<button disabled={saving} onClick={()=>onPatch(t.id,{status:"in_progress"})} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-mono rounded-sm hover:bg-blue-500/20 transition-colors">IN PROGRESS</button>}
              {t.status!=="completed"&&<button disabled={saving} onClick={()=>onPatch(t.id,{status:"completed"})} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono rounded-sm hover:bg-emerald-500/20 transition-colors">COMPLETE</button>}
              <button onClick={()=>toggleExpand(t.id)} className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono rounded-sm hover:bg-[#D4AF37]/20 transition-colors">
                {expanded===t.id ? "▲ CLOSE" : "▼ THREAD"}
              </button>
            </div>
          </div>

          {expanded===t.id && (
            <div className="mt-3 pt-3 border-t border-[#0d1b35] space-y-3">
              <div>
                <label className={labelCls}>Admin Note for Client</label>
                <div className="flex gap-2">
                  <input
                    value={adminNoteEditing[t.id] ?? t.adminNotes ?? ""}
                    onChange={e=>setAdminNoteEditing(n=>({...n,[t.id]:e.target.value}))}
                    className={inputCls+" flex-1"}
                    placeholder="Leave a note visible to the client..."
                  />
                  <button onClick={()=>saveNote(t)} disabled={saving} className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono rounded-sm">SAVE</button>
                </div>
              </div>

              <div className="space-y-2">
                <p className={labelCls}>Comment Thread ({(comments[t.id]??[]).length})</p>
                {(comments[t.id]??[]).map(c=>(
                  <div key={c.id} className={`${c.authorType==="admin"?"bg-[#D4AF37]/5 border border-[#D4AF37]/15":"bg-[#030810] border border-[#0d1b35]"} rounded-sm p-2.5`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-mono font-bold ${c.authorType==="admin"?"text-[#D4AF37]":"text-[#06b6d4]"}`}>{c.authorName}</span>
                      <span className="text-[8px] font-mono text-[#2a4060] ml-auto">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-[#8aa0b8] leading-relaxed">{c.content}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={reply[t.id]??""}
                    onChange={e=>setReply(r=>({...r,[t.id]:e.target.value}))}
                    className={inputCls+" flex-1"}
                    placeholder="Reply to client..."
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendReply(t.id);}}}
                  />
                  <button onClick={()=>sendReply(t.id)} disabled={sendingReply[t.id]||!reply[t.id]?.trim()} className="px-3 py-1 bg-[#D4AF37] text-[#030810] text-[9px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50">SEND</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GrahamsTab({ board, summary, onReload }:{board:GrahamBoard[];summary:GrahamSummary|null;onReload:()=>void}) {
  const [filter, setFilter] = useState("all");
  useEffect(()=>{if(board.length===0)onReload();},[]);

  if (board.length===0 && !summary) return <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING GRAHAM STATUS BOARD...</span></div>;

  const filtered = filter==="all" ? board : board.filter(b=>b.agentStatus===filter);

  return (
    <div className="space-y-5">
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {l:"TOTAL",v:summary.total,c:"#D4AF37"},
            {l:"ACTIVE",v:summary.active,c:"#00ff88"},
            {l:"CONFIGURING",v:summary.configuring,c:"#D4AF37"},
            {l:"STANDBY",v:summary.standby,c:"#06b6d4"},
            {l:"UNASSIGNED",v:summary.unassigned,c:"#2a4060"},
          ].map(s=>(
            <div key={s.l} className={`${panelCls} p-4`}>
              <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-2">{s.l}</p>
              <p className="font-mono font-bold text-2xl" style={{color:s.c}}>{s.v}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {["all","active","configuring","standby","unassigned"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 text-[9px] font-mono border rounded-sm transition-colors capitalize ${filter===f?"bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]":"bg-[#040c1a] border-[#0d1b35] text-[#3a5570] hover:text-white"}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length===0 && <div className={`${panelCls} p-10 text-center`}><p className="text-[#2a4060] text-xs font-mono">No Grahams in this state</p></div>}
        {filtered.map(b=>(
          <div key={b.memberId} className={`${panelCls} p-4`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm flex items-center justify-center shrink-0">
                <span className="text-[#D4AF37] font-mono font-bold text-xs">{b.grahamCode ?? "—"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-semibold text-white">{b.memberName}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{background:AGENT_STATUS_COLORS[b.agentStatus]??"#2a4060"}} />
                    <span className="text-[9px] font-mono font-bold uppercase" style={{color:AGENT_STATUS_COLORS[b.agentStatus]??"#2a4060"}}>{b.agentStatus}</span>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-[#3a5570] mb-1">{b.memberEmail}{b.company?` · ${b.company}`:""}</p>
                {b.agentObjective && <p className="text-[10px] text-[#8aa0b8] leading-relaxed line-clamp-1">{b.agentObjective}</p>}
                {b.agentModules.length>0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {b.agentModules.map(m=><span key={m} className="px-1.5 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[8px] font-mono text-[#D4AF37] rounded-sm capitalize">{m}</span>)}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                {b.bloomMemberId && <p className="text-[9px] font-mono text-[#D4AF37]">{b.bloomMemberId}</p>}
                {b.deployedAt && <p className="text-[8px] font-mono text-[#2a4060] mt-0.5">Deployed {new Date(b.deployedAt).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditTab({ logs, onLoad }:{logs:AuditLog[];onLoad:()=>void}) {
  useEffect(()=>{if(logs.length===0)onLoad();},[]);
  const ACTION_COLORS: Record<string,string>={vault_update:"#D4AF37",data_export:"#ef4444",member_activate:"#00ff88",staff_approve:"#06b6d4"};
  if (logs.length===0) return <div className={`${panelCls} p-16 text-center`}><p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-3">IMMUTABLE LOG</p><p className="text-[#2a4060] text-xs font-mono">No audit events recorded yet. All admin actions are logged here.</p></div>;
  return (
    <div className="space-y-2">
      <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-3">{logs.length} AUDIT EVENTS · IMMUTABLE LOG</p>
      {logs.map(l=>(
        <div key={l.id} className={`${panelCls} p-3 flex items-start gap-4`}>
          <span className="text-[9px] font-mono text-[#2a4060] shrink-0 w-16">{new Date(l.createdAt).toLocaleTimeString()}</span>
          <span className="text-[9px] font-mono font-bold uppercase shrink-0 w-28" style={{color:ACTION_COLORS[l.action]??"#3a5570"}}>{l.action.replace(/_/g," ")}</span>
          <span className="text-[9px] font-mono text-[#3a5570] shrink-0 w-32 capitalize">{l.targetType.replace(/_/g," ")}{l.targetId?` #${l.targetId}`:""}</span>
          <span className="text-[9px] font-mono text-[#2a4060] flex-1 truncate">{l.adminEmail}</span>
        </div>
      ))}
    </div>
  );
}
