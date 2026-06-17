import { useState } from "react";
  import { useUser, useClerk } from "@clerk/react";
  import type { AccessRole } from "@/hooks/useAccess";

  export default function AccessPendingPage({ status }: { status: AccessRole }) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const email = user?.primaryEmailAddress?.emailAddress ?? "";
    const [form, setForm] = useState({ fullName: user?.fullName ?? "", role: "", reason: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      setError("");
      try {
        const res = await fetch("/api/staff-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, email }),
        });
        if (!res.ok) { const d = await res.json(); setError(d.error ?? "Submission failed"); return; }
        setSubmitted(true);
      } catch { setError("Network error. Please try again."); }
      finally { setSubmitting(false); }
    }

    const inputCls = "w-full bg-[#040c1a] border border-[#0d1b35] rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono placeholder:text-[#2a4060] transition-colors";
    const labelCls = "block text-[10px] font-mono text-[#3a5570] mb-1.5 uppercase tracking-widest";

    return (
      <div className="min-h-screen bg-[#030810] flex items-center justify-center px-6">
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="max-w-lg w-full relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm flex items-center justify-center mx-auto mb-5">
              <span className="text-[#D4AF37] font-mono font-bold text-lg">D</span>
            </div>
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-2">THE BLOOM SOCIETY</p>

            {status === "denied" && (
              <><h2 className="text-2xl font-serif font-black text-white mb-3">Access Denied</h2>
              <p className="text-[#3a5570] text-sm leading-relaxed">Your access request was not approved. Contact Dr. Graham or Dr. Prabhakar directly if you believe this is an error.</p></>
            )}
            {status === "pending" && (
              <><h2 className="text-2xl font-serif font-black text-white mb-3">Access Pending</h2>
              <p className="text-[#3a5570] text-sm leading-relaxed">Your request is under review. You'll be notified once Dr. Graham or Dr. Prabhakar approves your access and configures your permitted areas.</p>
              <div className="mt-4 flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" /><span className="text-[10px] font-mono text-[#D4AF37]">AWAITING AUTHORIZATION</span></div></>
            )}
            {status === "unknown" && !submitted && (
              <><h2 className="text-2xl font-serif font-black text-white mb-3">Request Platform Access</h2>
              <p className="text-[#3a5570] text-sm mb-1">Signed in as <span className="text-white font-mono text-xs">{email}</span></p>
              <p className="text-[#2a4060] text-xs">Your account hasn't been granted access yet. Complete the form below — Dr. Graham or Dr. Prabhakar will review it.</p></>
            )}
            {submitted && (
              <><h2 className="text-2xl font-serif font-black text-white mb-3">Request Submitted</h2>
              <p className="text-[#3a5570] text-sm leading-relaxed">Your request has been sent to Dr. Graham and Dr. Prabhakar for review.</p>
              <div className="mt-4 flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" /><span className="text-[10px] font-mono text-[#D4AF37]">PENDING REVIEW</span></div></>
            )}
          </div>

          {status === "unknown" && !submitted && (
            <form onSubmit={submit} className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-6 space-y-4">
              <div><label className={labelCls}>Full Name *</label><input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className={inputCls} placeholder="Jane Smith" /></div>
              <div><label className={labelCls}>Your Role / Position *</label><input required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} placeholder="e.g. Financial Analyst, Operations Manager" /></div>
              <div><label className={labelCls}>Why do you need access? *</label>
                <textarea required rows={3} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className={inputCls + " resize-none"} placeholder="Explain your role and why you require access to Dantès..." /></div>
              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full py-3 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest">
                {submitting ? "SUBMITTING..." : "REQUEST ACCESS →"}</button>
            </form>
          )}

          <button onClick={() => signOut()} className="mt-6 w-full text-center text-[10px] font-mono text-[#2a4060] hover:text-[#3a5570] transition-colors">
            Sign out — {email}
          </button>
        </div>
      </div>
    );
  }
  