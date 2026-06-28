import { useState } from "react";
import { useUser, useClerk } from "@clerk/react";
import type { AccessRole } from "@/hooks/useAccess";

const P = {
  bg: "#f5f0ff",
  heading: "#1e1b4b",
  body: "#5a587a",
  muted: "#9898b8",
  purple: "#a855f7",
  card: "rgba(255,255,255,0.72)",
  cardBorder: "rgba(168,85,247,0.2)",
};

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

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none font-mono transition-colors";
  const inputStyle = { background: "rgba(255,255,255,0.8)", border: "1px solid rgba(168,85,247,0.25)", color: P.heading };
  const labelCls = "block text-[10px] font-mono mb-1.5 uppercase tracking-widest";

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: P.bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 30% 20%,rgba(168,85,247,0.08),transparent),radial-gradient(ellipse 60% 60% at 80% 80%,rgba(34,211,238,0.07),transparent)" }} />
      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <span className="font-serif font-bold text-lg" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>D</span>
          </div>
          <p className="text-[9px] font-mono tracking-[0.4em] mb-2" style={{ color: P.purple }}>THE BLOOM SOCIETY</p>

          {status === "denied" && (
            <><h2 className="text-2xl font-serif font-black mb-3" style={{ color: P.heading }}>Access Denied</h2>
            <p className="text-sm leading-relaxed" style={{ color: P.body }}>Your access request was not approved. Contact Dr. Graham or Dr. Prabhakar directly if you believe this is an error.</p></>
          )}
          {status === "pending" && (
            <><h2 className="text-2xl font-serif font-black mb-3" style={{ color: P.heading }}>Access Pending</h2>
            <p className="text-sm leading-relaxed" style={{ color: P.body }}>Your request is under review. You'll be notified once Dr. Graham or Dr. Prabhakar approves your access.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: P.purple }} />
              <span className="text-[10px] font-mono" style={{ color: P.purple }}>AWAITING AUTHORIZATION</span>
            </div></>
          )}
          {status === "unknown" && !submitted && (
            <><h2 className="text-2xl font-serif font-black mb-3" style={{ color: P.heading }}>Request Platform Access</h2>
            <p className="text-sm mb-1" style={{ color: P.body }}>Signed in as <span className="font-mono text-xs" style={{ color: P.heading }}>{email}</span></p>
            <p className="text-xs" style={{ color: P.muted }}>Your account hasn't been granted access yet. Complete the form below — Dr. Graham or Dr. Prabhakar will review it.</p></>
          )}
          {submitted && (
            <><h2 className="text-2xl font-serif font-black mb-3" style={{ color: P.heading }}>Request Submitted</h2>
            <p className="text-sm leading-relaxed" style={{ color: P.body }}>Your request has been sent to Dr. Graham and Dr. Prabhakar for review.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: P.purple }} />
              <span className="text-[10px] font-mono" style={{ color: P.purple }}>PENDING REVIEW</span>
            </div></>
          )}
        </div>

        {status === "unknown" && !submitted && (
          <form onSubmit={submit} className="rounded-2xl p-6 space-y-4" style={{ background: P.card, border: `1px solid ${P.cardBorder}`, backdropFilter: "blur(12px)" }}>
            <div><label className={labelCls} style={{ color: P.muted }}>Full Name *</label><input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className={inputCls} style={inputStyle} placeholder="Jane Smith" /></div>
            <div><label className={labelCls} style={{ color: P.muted }}>Your Role / Position *</label><input required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls} style={inputStyle} placeholder="e.g. Financial Analyst, Operations Manager" /></div>
            <div><label className={labelCls} style={{ color: P.muted }}>Why do you need access? *</label>
              <textarea required rows={3} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className={inputCls + " resize-none"} style={inputStyle} placeholder="Explain your role and why you require access to Dantès..." /></div>
            {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-50 tracking-widest" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
              {submitting ? "SUBMITTING..." : "REQUEST ACCESS →"}</button>
          </form>
        )}

        <button onClick={() => signOut()} className="mt-6 w-full text-center text-[10px] font-mono transition-colors" style={{ color: P.muted }}>
          Sign out — {email}
        </button>
      </div>
    </div>
  );
}
