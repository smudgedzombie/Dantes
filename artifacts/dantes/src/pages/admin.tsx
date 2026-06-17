import { useState, useEffect } from "react";
  import { useAuth } from "@clerk/react";

  type StaffRequest = {
    id: number; email: string; fullName: string; role: string; reason: string;
    status: "pending"|"approved"|"denied"; permittedTabs: string[]; adminNotes: string|null;
    createdAt: string; reviewedAt: string|null;
  };
  type MemberApp = {
    id: number; fullName: string; email: string; phone: string|null; company: string|null;
    country: string|null; industry: string|null; businessDescription: string; grahamGoals: string;
    budget: string|null; referral: string|null; status: string;
    quotationAmount: string|null; quotationNotes: string|null; adminNotes: string|null;
    bloomMemberId: string|null; bloomSecretPassword: string|null; assignedGrahamId: string|null;
    createdAt: string; quotationSentAt: string|null; paidAt: string|null;
  };

  const ALL_TABS = ["command","grahams","clients","dashboard","transactions","accounts"];

  const STATUS_COLORS: Record<string, string> = {
    pending:"bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    denied:"bg-red-500/10 text-red-400 border-red-500/20",
    reviewing:"bg-blue-500/10 text-blue-400 border-blue-500/20",
    quoted:"bg-purple-500/10 text-purple-400 border-purple-500/20",
    paid:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    active:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected:"bg-red-500/10 text-red-400 border-red-500/20",
  };

  function Badge({ status }: { status: string }) {
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${STATUS_COLORS[status]??""}`}>{status}</span>;
  }

  export default function AdminPage() {
    const { getToken } = useAuth();
    const [tab, setTab] = useState<"members"|"staff">("members");
    const [staffReqs, setStaffReqs] = useState<StaffRequest[]>([]);
    const [memberApps, setMemberApps] = useState<MemberApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<MemberApp|null>(null);
    const [selectedStaff, setSelectedStaff] = useState<StaffRequest|null>(null);
    const [saving, setSaving] = useState(false);

    async function apiFetch(path: string, opts?: RequestInit) {
      const token = await getToken();
      return fetch(path, { ...opts, headers: { ...(opts?.headers ?? {}), Authorization: `Bearer ${token}`, ...(opts?.body ? { "Content-Type":"application/json" } : {}) } });
    }

    async function loadAll() {
      setLoading(true);
      try {
        const [sr, ma] = await Promise.all([
          apiFetch("/api/staff-requests").then(r=>r.json()),
          apiFetch("/api/member-applications").then(r=>r.json()),
        ]);
        setStaffReqs(Array.isArray(sr) ? sr : []);
        setMemberApps(Array.isArray(ma) ? ma : []);
      } finally { setLoading(false); }
    }

    useEffect(() => { loadAll(); }, []);

    async function patchStaff(id: number, body: object) {
      setSaving(true);
      try {
        const res = await apiFetch(`/api/staff-requests/${id}`, { method:"PATCH", body: JSON.stringify(body) });
        const updated = await res.json();
        setStaffReqs(rs => rs.map(r => r.id===id ? updated : r));
        setSelectedStaff(updated);
      } finally { setSaving(false); }
    }

    async function patchMember(id: number, body: object) {
      setSaving(true);
      try {
        const res = await apiFetch(`/api/member-applications/${id}`, { method:"PATCH", body: JSON.stringify(body) });
        const updated = await res.json();
        setMemberApps(rs => rs.map(r => r.id===id ? updated : r));
        setSelectedMember(updated);
      } finally { setSaving(false); }
    }

    const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";
    const inputCls = "w-full bg-[#030810] border border-[#0d1b35] rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono placeholder:text-[#2a4060]";
    const labelCls = "block text-[9px] font-mono text-[#3a5570] mb-1 uppercase tracking-widest";
    const btnPrimary = "px-4 py-2 bg-[#D4AF37] text-[#030810] text-[10px] font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50";
    const btnSec = "px-4 py-2 bg-[#0a1628] border border-[#0d1b35] text-[#3a5570] text-[10px] font-mono rounded-sm hover:text-white transition-colors";

    return (
      <div className="min-h-screen bg-[#030810] text-white">
        <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.05) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
        <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-0.5">THE BLOOM SOCIETY</p>
            <h1 className="text-lg font-serif font-black text-white tracking-wide">Admin Command Hub</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
            <span className="text-[9px] font-mono text-[#D4AF37]">SUPER ADMIN</span>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[#0d1b35]">
            {([["members","Member Applications"],["staff","Staff Access Requests"]] as const).map(([k,label]) => (
              <button key={k} onClick={()=>setTab(k)} className={`px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${tab===k?"border-b-2 border-[#D4AF37] text-[#D4AF37]":"text-[#3a5570] hover:text-white"}`}>{label}</button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING...</span></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* List */}
              <div className="space-y-2">
                <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-3">
                  {tab==="members" ? `${memberApps.length} APPLICATIONS` : `${staffReqs.length} REQUESTS`}
                </p>
                {tab==="members" && memberApps.map(m => (
                  <div key={m.id} onClick={()=>setSelectedMember(m)} className={`${panelCls} p-4 cursor-pointer hover:border-[#D4AF37]/20 transition-colors ${selectedMember?.id===m.id?"border-[#D4AF37]/30 bg-[#D4AF37]/5":""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-xs font-semibold text-white">{m.fullName}</p><p className="text-[10px] font-mono text-[#3a5570]">{m.email}</p></div>
                      <Badge status={m.status} />
                    </div>
                    <p className="text-[10px] text-[#2a4060]">{m.company || m.industry || "—"} · {m.country || "—"}</p>
                    <p className="text-[9px] font-mono text-[#1a2840] mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {tab==="staff" && staffReqs.map(r => (
                  <div key={r.id} onClick={()=>setSelectedStaff(r)} className={`${panelCls} p-4 cursor-pointer hover:border-[#D4AF37]/20 transition-colors ${selectedStaff?.id===r.id?"border-[#D4AF37]/30 bg-[#D4AF37]/5":""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-xs font-semibold text-white">{r.fullName}</p><p className="text-[10px] font-mono text-[#3a5570]">{r.email}</p></div>
                      <Badge status={r.status} />
                    </div>
                    <p className="text-[10px] text-[#2a4060]">{r.role}</p>
                    <p className="text-[9px] font-mono text-[#1a2840] mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {tab==="members" && memberApps.length===0 && <p className="text-[#2a4060] text-xs font-mono py-8 text-center">No applications yet</p>}
                {tab==="staff" && staffReqs.length===0 && <p className="text-[#2a4060] text-xs font-mono py-8 text-center">No requests yet</p>}
              </div>

              {/* Detail panel */}
              <div className="lg:col-span-2">
                {tab==="members" && selectedMember && <MemberDetail member={selectedMember} onPatch={patchMember} saving={saving} panelCls={panelCls} inputCls={inputCls} labelCls={labelCls} btnPrimary={btnPrimary} btnSec={btnSec} />}
                {tab==="staff" && selectedStaff && <StaffDetail req={selectedStaff} onPatch={patchStaff} saving={saving} panelCls={panelCls} inputCls={inputCls} labelCls={labelCls} btnPrimary={btnPrimary} btnSec={btnSec} />}
                {!selectedMember && !selectedStaff && <div className={`${panelCls} p-12 text-center`}><p className="text-[#2a4060] text-xs font-mono">SELECT AN ITEM TO REVIEW</p></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function MemberDetail({ member, onPatch, saving, panelCls, inputCls, labelCls, btnPrimary, btnSec }: any) {
    const [notes, setNotes] = useState(member.adminNotes ?? "");
    const [quoteAmt, setQuoteAmt] = useState(member.quotationAmount ?? "");
    const [quoteNotes, setQuoteNotes] = useState(member.quotationNotes ?? "");
    const [bloomId, setBloomId] = useState(member.bloomMemberId ?? "");
    const [secret, setSecret] = useState(member.bloomSecretPassword ?? "");
    const [grahamId, setGrahamId] = useState(member.assignedGrahamId ?? "");
    useEffect(() => {
      setNotes(member.adminNotes ?? ""); setQuoteAmt(member.quotationAmount ?? "");
      setQuoteNotes(member.quotationNotes ?? ""); setBloomId(member.bloomMemberId ?? "");
      setSecret(member.bloomSecretPassword ?? ""); setGrahamId(member.assignedGrahamId ?? "");
    }, [member.id]);

    return (
      <div className={`${panelCls} p-6 space-y-5`}>
        <div className="flex items-start justify-between">
          <div><h3 className="text-base font-serif font-bold text-white mb-0.5">{member.fullName}</h3><p className="text-xs font-mono text-[#3a5570]">{member.email} · {member.phone ?? "—"}</p></div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${STATUS_COLORS[member.status]??""}`}>{member.status}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[["Company",member.company],["Country",member.country],["Industry",member.industry],["Budget",member.budget],["Referral",member.referral]].map(([l,v])=>v&&<div key={l}><span className="text-[#3a5570] font-mono text-[9px]">{l}: </span><span className="text-white">{v}</span></div>)}
        </div>
        <div><p className={labelCls}>Business Description</p><p className="text-xs text-[#8aa0b8] leading-relaxed bg-[#030810] border border-[#0d1b35] rounded-sm p-3">{member.businessDescription}</p></div>
        <div><p className={labelCls}>Graham Goals</p><p className="text-xs text-[#8aa0b8] leading-relaxed bg-[#030810] border border-[#0d1b35] rounded-sm p-3">{member.grahamGoals}</p></div>

        {/* Admin notes */}
        <div><label className={labelCls}>Admin Notes</label><textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} className={inputCls+" resize-none"} /></div>

        {/* Quotation */}
        <div className="border border-[#0d1b35] rounded-sm p-4 space-y-3">
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">QUOTATION</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Amount (USD/month)</label><input value={quoteAmt} onChange={e=>setQuoteAmt(e.target.value)} className={inputCls} placeholder="e.g. 15000" /></div>
            <div><label className={labelCls}>Quotation Notes</label><input value={quoteNotes} onChange={e=>setQuoteNotes(e.target.value)} className={inputCls} placeholder="Includes..." /></div>
          </div>
          <button disabled={saving} onClick={()=>onPatch(member.id,{status:"quoted",quotationAmount:quoteAmt,quotationNotes:quoteNotes,adminNotes:notes})} className={btnPrimary}>SEND QUOTATION →</button>
        </div>

        {/* Activation */}
        <div className="border border-[#0d1b35] rounded-sm p-4 space-y-3">
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest">ACTIVATION</p>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelCls}>Bloom Member ID</label><input value={bloomId} onChange={e=>setBloomId(e.target.value)} className={inputCls} placeholder="BLM-001" /></div>
            <div><label className={labelCls}>Secret Password</label><input value={secret} onChange={e=>setSecret(e.target.value)} className={inputCls} placeholder="••••••••" /></div>
            <div><label className={labelCls}>Graham Agent ID</label><input value={grahamId} onChange={e=>setGrahamId(e.target.value)} className={inputCls} placeholder="GRM01" /></div>
          </div>
          <div className="flex gap-2">
            <button disabled={saving} onClick={()=>onPatch(member.id,{status:"paid",adminNotes:notes})} className={btnSec}>MARK PAID</button>
            <button disabled={saving} onClick={()=>onPatch(member.id,{status:"active",bloomMemberId:bloomId,bloomSecretPassword:secret,assignedGrahamId:grahamId,adminNotes:notes})} className={btnPrimary}>ACTIVATE MEMBER →</button>
          </div>
        </div>

        {/* Status controls */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-[#0d1b35]">
          {["pending","reviewing","rejected"].map(s=><button key={s} disabled={saving} onClick={()=>onPatch(member.id,{status:s,adminNotes:notes})} className={btnSec}>{s.toUpperCase()}</button>)}
        </div>
      </div>
    );
  }

  function StaffDetail({ req, onPatch, saving, panelCls, inputCls, labelCls, btnPrimary, btnSec }: any) {
    const [notes, setNotes] = useState(req.adminNotes ?? "");
    const [tabs, setTabs] = useState<string[]>(req.permittedTabs ?? []);
    useEffect(() => { setNotes(req.adminNotes ?? ""); setTabs(req.permittedTabs ?? []); }, [req.id]);

    function toggleTab(t: string) { setTabs(ts => ts.includes(t) ? ts.filter(x=>x!==t) : [...ts,t]); }

    return (
      <div className={`${panelCls} p-6 space-y-5`}>
        <div className="flex items-start justify-between">
          <div><h3 className="text-base font-serif font-bold text-white mb-0.5">{req.fullName}</h3><p className="text-xs font-mono text-[#3a5570]">{req.email} · {req.role}</p></div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${STATUS_COLORS[req.status]??""}`}>{req.status}</span>
        </div>
        <div><p className={labelCls}>Reason for Access</p><p className="text-xs text-[#8aa0b8] leading-relaxed bg-[#030810] border border-[#0d1b35] rounded-sm p-3">{req.reason}</p></div>
        <div>
          <p className={labelCls}>Permitted Tabs</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {ALL_TABS.map(t => (
              <button key={t} onClick={()=>toggleTab(t)} className={`px-3 py-1.5 text-[10px] font-mono rounded-sm border transition-colors ${tabs.includes(t)?"bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]":"bg-[#030810] border-[#0d1b35] text-[#2a4060] hover:text-white"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div><label className={labelCls}>Admin Notes</label><textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} className={inputCls+" resize-none"} /></div>
        <div className="flex gap-2 pt-2 border-t border-[#0d1b35]">
          <button disabled={saving} onClick={()=>onPatch(req.id,{status:"denied",adminNotes:notes})} className={btnSec}>DENY</button>
          <button disabled={saving} onClick={()=>onPatch(req.id,{status:"approved",permittedTabs:tabs,adminNotes:notes})} className={btnPrimary}>APPROVE ACCESS →</button>
        </div>
      </div>
    );
  }
  