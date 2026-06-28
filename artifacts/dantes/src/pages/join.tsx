import { useState } from "react";
import { Link } from "wouter";

const INDUSTRIES = [
  "Food & Beverage","Hospitality & Leisure","Retail","Manufacturing & Export",
  "Technology & SaaS","Healthcare & Wellness","Finance & Investment",
  "Real Estate & Property","Professional Services","Events & Entertainment",
  "Education","Logistics & Supply Chain","Other",
];
const BUDGETS = [
  "Under $5,000 / month","$5,000 – $10,000 / month","$10,000 – $25,000 / month",
  "$25,000 – $50,000 / month","$50,000+ / month","Prefer to discuss",
];

type Step = 1 | 2 | 3 | 4;

const P = {
  bg: "#f5f0ff",
  heading: "#1e1b4b",
  body: "#5a587a",
  muted: "#9898b8",
  purple: "#a855f7",
  card: "rgba(255,255,255,0.72)",
  cardBorder: "rgba(168,85,247,0.2)",
};

export default function JoinPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName:"",email:"",phone:"",company:"",country:"",industry:"",
    businessDescription:"",grahamGoals:"",budget:"",referral:"",
  });

  function set(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const step1Valid = form.fullName && form.email && form.phone;
  const step2Valid = form.company && form.country && form.industry;
  const step3Valid = form.businessDescription.length >= 50 && form.grahamGoals.length >= 50;

  async function submit() {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/member-applications", {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Submission failed. Please try again."); return; }
      setSubmitted(true);
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none font-mono transition-colors";
  const inputStyle = { background: "rgba(255,255,255,0.8)", border: "1px solid rgba(168,85,247,0.25)", color: P.heading };
  const labelCls = "block text-[10px] font-mono mb-1.5 uppercase tracking-widest";

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: P.bg }}>
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
          <span className="text-3xl font-serif font-bold" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦</span>
        </div>
        <p className="text-[9px] font-mono tracking-[0.4em] mb-3" style={{ color: P.purple }}>APPLICATION RECEIVED</p>
        <h2 className="text-3xl font-serif font-black mb-4" style={{ color: P.heading }}>Welcome to the Queue</h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: P.body }}>
          Your Bloom Society application has been received. Dr. Graham and Dr. Prabhakar will personally review your profile and reach out within <span style={{ color: P.purple }}>48–72 hours</span>.
        </p>
        <div className="rounded-2xl p-5 mb-8 text-left space-y-4" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
          <p className="text-[9px] font-mono tracking-widest" style={{ color: P.muted }}>WHAT HAPPENS NEXT</p>
          {[
            { n:"01", t:"Profile Review", d:"We analyse your business, goals, and design your custom Graham configuration." },
            { n:"02", t:"Bespoke Quotation", d:"You receive a personalised proposal detailing your Graham and investment." },
            { n:"03", t:"Onboarding & Access", d:"Upon payment, we issue your secret Bloom Society credentials and deploy your Graham 24/7." },
          ].map(s => (
            <div key={s.n} className="flex gap-4">
              <span className="font-mono font-bold text-sm shrink-0 w-6" style={{ color: P.purple }}>{s.n}</span>
              <div><p className="text-xs font-semibold mb-0.5" style={{ color: P.heading }}>{s.t}</p><p className="text-[10px] leading-relaxed" style={{ color: P.body }}>{s.d}</p></div>
            </div>
          ))}
        </div>
        <Link href="/" className="text-[10px] font-mono transition-colors tracking-widest" style={{ color: P.purple }}>← RETURN TO DANTÈS</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      {/* Subtle holographic radial glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 20% 10%,rgba(34,211,238,0.07),transparent),radial-gradient(ellipse 60% 60% at 80% 90%,rgba(236,72,153,0.07),transparent)" }} />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Dantès" className="w-8 h-8 object-contain" />
          <span className="font-serif font-black tracking-widest text-base" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DANTÈS</span>
          <span className="text-[9px] font-mono tracking-[0.3em] hidden sm:block" style={{ color: P.muted }}>THE BLOOM SOCIETY</span>
        </Link>
        <span className="text-[9px] font-mono tracking-widest hidden sm:block" style={{ color: P.muted }}>MEMBERSHIP APPLICATION</span>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-[9px] font-mono tracking-[0.4em] mb-3" style={{ color: P.purple }}>RESTRICTED MEMBERSHIP</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black mb-3" style={{ color: P.heading }}>Join the Bloom Society</h1>
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: P.body }}>Every Bloom Society member receives a custom Graham agent — a precision AI built exclusively for their business, operating 24/7 on their behalf.</p>
        </div>

        {/* Steps bar */}
        <div className="flex items-center gap-2 mb-3">
          {([1,2,3,4] as Step[]).map((s,i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-all"
                style={step===s
                  ? { background: "linear-gradient(135deg,#a855f7,#ec4899)", color: "#fff" }
                  : step>s
                  ? { background: "rgba(168,85,247,0.15)", color: P.purple }
                  : { background: "rgba(255,255,255,0.6)", border: "1px solid rgba(168,85,247,0.2)", color: P.muted }
                }>
                {step>s?"✓":`0${s}`}
              </div>
              {i<3 && <div className="h-px flex-1 transition-all" style={{ background: step>s ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(168,85,247,0.15)" }} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] font-mono mb-10 px-0.5">
          {["IDENTITY","BUSINESS","OBJECTIVES","REVIEW"].map((l,i) => (
            <span key={l} style={{ color: step===i+1 ? P.purple : P.muted }}>{l}</span>
          ))}
        </div>

        <div className="rounded-2xl p-6 sm:p-7" style={{ background: P.card, border: `1px solid ${P.cardBorder}`, backdropFilter: "blur(12px)" }}>
          {step===1 && (
            <div className="space-y-5">
              <p className="text-[9px] font-mono tracking-widest mb-5" style={{ color: P.purple }}>STEP 01 — YOUR IDENTITY</p>
              <div><label className={labelCls} style={{ color: P.muted }}>Full Name *</label><input value={form.fullName} onChange={e=>set("fullName",e.target.value)} className={inputCls} style={inputStyle} placeholder="Dr. Jane Smith" /></div>
              <div><label className={labelCls} style={{ color: P.muted }}>Email Address *</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} className={inputCls} style={inputStyle} placeholder="jane@company.com" /></div>
              <div><label className={labelCls} style={{ color: P.muted }}>Phone / WhatsApp *</label><input value={form.phone} onChange={e=>set("phone",e.target.value)} className={inputCls} style={inputStyle} placeholder="+1 555 000 0000" /></div>
              <div><label className={labelCls} style={{ color: P.muted }}>How did you hear about Dantès?</label><input value={form.referral} onChange={e=>set("referral",e.target.value)} className={inputCls} style={inputStyle} placeholder="Referral, social media, event…" /></div>
            </div>
          )}

          {step===2 && (
            <div className="space-y-5">
              <p className="text-[9px] font-mono tracking-widest mb-5" style={{ color: P.purple }}>STEP 02 — YOUR BUSINESS</p>
              <div><label className={labelCls} style={{ color: P.muted }}>Business / Company Name</label><input value={form.company} onChange={e=>set("company",e.target.value)} className={inputCls} style={inputStyle} placeholder="Apex Ventures Ltd" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls} style={{ color: P.muted }}>Country *</label><input value={form.country} onChange={e=>set("country",e.target.value)} className={inputCls} style={inputStyle} placeholder="UAE" /></div>
                <div><label className={labelCls} style={{ color: P.muted }}>Industry *</label>
                  <select value={form.industry} onChange={e=>set("industry",e.target.value)} className={inputCls} style={inputStyle}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={labelCls} style={{ color: P.muted }}>Monthly investment range</label>
                <select value={form.budget} onChange={e=>set("budget",e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="">Select range</option>
                  {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {step===3 && (
            <div className="space-y-5">
              <p className="text-[9px] font-mono tracking-widest mb-5" style={{ color: P.purple }}>STEP 03 — YOUR OBJECTIVES</p>
              <div>
                <label className={labelCls} style={{ color: P.muted }}>Describe your business and its current challenges *</label>
                <textarea rows={4} value={form.businessDescription} onChange={e=>set("businessDescription",e.target.value)} className={inputCls+" resize-none"} style={inputStyle} placeholder="Tell us about your business: what you do, who you serve, your current revenue, and the biggest challenges you face right now..." />
                <p className="text-[9px] font-mono mt-1" style={{ color: P.muted }}>{form.businessDescription.length}/50 min characters</p>
              </div>
              <div>
                <label className={labelCls} style={{ color: P.muted }}>What do you want your Graham agent to achieve? *</label>
                <textarea rows={4} value={form.grahamGoals} onChange={e=>set("grahamGoals",e.target.value)} className={inputCls+" resize-none"} style={inputStyle} placeholder="What outcomes matter most? Revenue growth, compliance, operational efficiency, market expansion? Be specific — this shapes how we build your Graham." />
                <p className="text-[9px] font-mono mt-1" style={{ color: P.muted }}>{form.grahamGoals.length}/50 min characters</p>
              </div>
            </div>
          )}

          {step===4 && (
            <div className="space-y-4">
              <p className="text-[9px] font-mono tracking-widest mb-5" style={{ color: P.purple }}>STEP 04 — REVIEW & SUBMIT</p>
              {[["Name",form.fullName],["Email",form.email],["Phone",form.phone],["Company",form.company||"—"],["Country",form.country],["Industry",form.industry],["Budget",form.budget||"—"]].map(([l,v])=>(
                <div key={l} className="flex justify-between text-xs border-b pb-3 last:border-0" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
                  <span className="font-mono" style={{ color: P.body }}>{l}</span><span className="font-medium" style={{ color: P.heading }}>{v}</span>
                </div>
              ))}
              <div><p className="text-[9px] font-mono mb-1.5" style={{ color: P.body }}>BUSINESS DESCRIPTION</p><p className="text-xs leading-relaxed line-clamp-3" style={{ color: P.heading }}>{form.businessDescription}</p></div>
              <div><p className="text-[9px] font-mono mb-1.5" style={{ color: P.body }}>GRAHAM GOALS</p><p className="text-xs leading-relaxed line-clamp-3" style={{ color: P.heading }}>{form.grahamGoals}</p></div>
              <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
                <p className="text-[10px] leading-relaxed" style={{ color: P.body }}>By submitting, you acknowledge this is a confidential application to The Bloom Society. Dr. Graham and Dr. Prabhakar will personally review your profile. No Graham is deployed without a signed engagement and confirmed payment.</p>
              </div>
              {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step>1 && <button onClick={()=>setStep(s=>(s-1) as Step)} className="px-5 py-2.5 rounded-xl text-xs font-mono transition-colors" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(168,85,247,0.2)", color: P.body }}>← BACK</button>}
            {step<4
              ? <button onClick={()=>setStep(s=>(s+1) as Step)} disabled={step===1?!step1Valid:step===2?!step2Valid:!step3Valid} className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-widest" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>CONTINUE →</button>
              : <button onClick={submit} disabled={submitting} className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold text-white transition-all disabled:opacity-50 tracking-widest" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)", boxShadow: "0 0 24px rgba(168,85,247,0.35)" }}>{submitting?"SUBMITTING...":"SUBMIT APPLICATION →"}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
