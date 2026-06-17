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

    const inputCls = "w-full bg-[#040c1a] border border-[#0d1b35] rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono placeholder:text-[#2a4060] transition-colors";
    const labelCls = "block text-[10px] font-mono text-[#3a5570] mb-1.5 uppercase tracking-widest";

    if (submitted) return (
      <div className="min-h-screen bg-[#030810] flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-[#D4AF37] text-3xl font-serif font-bold">✦</span>
          </div>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-3">APPLICATION RECEIVED</p>
          <h2 className="text-3xl font-serif font-black text-white mb-4">Welcome to the Queue</h2>
          <p className="text-[#3a5570] text-sm leading-relaxed mb-8">
            Your Bloom Society application has been received. Dr. Graham and Dr. Prabhakar will personally review your profile and reach out within <span className="text-[#D4AF37]">48–72 hours</span>.
          </p>
          <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-5 mb-8 text-left space-y-4">
            <p className="text-[9px] font-mono text-[#D4AF37]/50 tracking-widest">WHAT HAPPENS NEXT</p>
            {[
              { n:"01", t:"Profile Review", d:"We analyse your business, goals, and design your custom Graham configuration." },
              { n:"02", t:"Bespoke Quotation", d:"You receive a personalised proposal detailing your Graham and investment." },
              { n:"03", t:"Onboarding & Access", d:"Upon payment, we issue your secret Bloom Society credentials and deploy your Graham 24/7." },
            ].map(s => (
              <div key={s.n} className="flex gap-4">
                <span className="font-mono text-[#D4AF37] font-bold text-sm shrink-0 w-6">{s.n}</span>
                <div><p className="text-xs font-semibold text-white mb-0.5">{s.t}</p><p className="text-[10px] text-[#3a5570] leading-relaxed">{s.d}</p></div>
              </div>
            ))}
          </div>
          <Link href="/" className="text-[10px] font-mono text-[#D4AF37] hover:text-white transition-colors tracking-widest">← RETURN TO DANTÈS</Link>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-[#030810] text-white">
        <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#0d1b35]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#D4AF37] rounded-sm flex items-center justify-center"><span className="text-[#030810] font-mono font-black text-xs">D</span></div>
            <span className="font-serif font-black text-white tracking-widest text-base">DANTÈS</span>
            <span className="text-[9px] font-mono text-[#D4AF37]/50 tracking-[0.3em] hidden sm:block">THE BLOOM SOCIETY</span>
          </Link>
          <span className="text-[9px] font-mono text-[#D4AF37]/50 tracking-widest hidden sm:block">MEMBERSHIP APPLICATION</span>
        </nav>

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.4em] mb-3">RESTRICTED MEMBERSHIP</p>
            <h1 className="text-4xl font-serif font-black text-white mb-3">Join the Bloom Society</h1>
            <p className="text-[#3a5570] text-sm leading-relaxed max-w-lg mx-auto">Every Bloom Society member receives a custom Graham agent — a precision AI built exclusively for their business, operating 24/7 on their behalf.</p>
          </div>

          {/* Steps bar */}
          <div className="flex items-center gap-2 mb-3">
            {([1,2,3,4] as Step[]).map((s,i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-all ${step===s?"bg-[#D4AF37] text-[#030810]":step>s?"bg-[#D4AF37]/20 text-[#D4AF37]":"bg-[#0a1628] border border-[#0d1b35] text-[#2a4060]"}`}>
                  {step>s?"✓":`0${s}`}
                </div>
                {i<3 && <div className={`h-px flex-1 transition-all ${step>s?"bg-[#D4AF37]/40":"bg-[#0d1b35]"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono mb-10 px-0.5">
            {["IDENTITY","BUSINESS","OBJECTIVES","REVIEW"].map((l,i) => (
              <span key={l} className={step===i+1?"text-[#D4AF37]":"text-[#2a4060]"}>{l}</span>
            ))}
          </div>

          <div className="bg-[#040c1a] border border-[#0d1b35] rounded-sm p-7">
            {step===1 && (
              <div className="space-y-5">
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-5">STEP 01 — YOUR IDENTITY</p>
                <div><label className={labelCls}>Full Name *</label><input value={form.fullName} onChange={e=>set("fullName",e.target.value)} className={inputCls} placeholder="Dr. Jane Smith" /></div>
                <div><label className={labelCls}>Email Address *</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} className={inputCls} placeholder="jane@company.com" /></div>
                <div><label className={labelCls}>Phone / WhatsApp *</label><input value={form.phone} onChange={e=>set("phone",e.target.value)} className={inputCls} placeholder="+1 555 000 0000" /></div>
                <div><label className={labelCls}>How did you hear about Dantès?</label><input value={form.referral} onChange={e=>set("referral",e.target.value)} className={inputCls} placeholder="Referral, social media, event…" /></div>
              </div>
            )}

            {step===2 && (
              <div className="space-y-5">
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-5">STEP 02 — YOUR BUSINESS</p>
                <div><label className={labelCls}>Business / Company Name</label><input value={form.company} onChange={e=>set("company",e.target.value)} className={inputCls} placeholder="Apex Ventures Ltd" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Country *</label><input value={form.country} onChange={e=>set("country",e.target.value)} className={inputCls} placeholder="UAE" /></div>
                  <div><label className={labelCls}>Industry *</label>
                    <select value={form.industry} onChange={e=>set("industry",e.target.value)} className={inputCls}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className={labelCls}>Monthly investment range</label>
                  <select value={form.budget} onChange={e=>set("budget",e.target.value)} className={inputCls}>
                    <option value="">Select range</option>
                    {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step===3 && (
              <div className="space-y-5">
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-5">STEP 03 — YOUR OBJECTIVES</p>
                <div>
                  <label className={labelCls}>Describe your business and its current challenges *</label>
                  <textarea rows={4} value={form.businessDescription} onChange={e=>set("businessDescription",e.target.value)} className={inputCls+" resize-none"} placeholder="Tell us about your business: what you do, who you serve, your current revenue, and the biggest challenges you face right now..." />
                  <p className="text-[9px] font-mono text-[#2a4060] mt-1">{form.businessDescription.length}/50 min characters</p>
                </div>
                <div>
                  <label className={labelCls}>What do you want your Graham agent to achieve? *</label>
                  <textarea rows={4} value={form.grahamGoals} onChange={e=>set("grahamGoals",e.target.value)} className={inputCls+" resize-none"} placeholder="What outcomes matter most? Revenue growth, compliance, operational efficiency, market expansion? Be specific — this shapes how we build your Graham." />
                  <p className="text-[9px] font-mono text-[#2a4060] mt-1">{form.grahamGoals.length}/50 min characters</p>
                </div>
              </div>
            )}

            {step===4 && (
              <div className="space-y-4">
                <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-5">STEP 04 — REVIEW & SUBMIT</p>
                {[["Name",form.fullName],["Email",form.email],["Phone",form.phone],["Company",form.company||"—"],["Country",form.country],["Industry",form.industry],["Budget",form.budget||"—"]].map(([l,v])=>(
                  <div key={l} className="flex justify-between text-xs border-b border-[#0d1b35] pb-3 last:border-0">
                    <span className="font-mono text-[#3a5570]">{l}</span><span className="text-white font-medium">{v}</span>
                  </div>
                ))}
                <div><p className="text-[9px] font-mono text-[#3a5570] mb-1.5">BUSINESS DESCRIPTION</p><p className="text-xs text-white leading-relaxed line-clamp-3">{form.businessDescription}</p></div>
                <div><p className="text-[9px] font-mono text-[#3a5570] mb-1.5">GRAHAM GOALS</p><p className="text-xs text-white leading-relaxed line-clamp-3">{form.grahamGoals}</p></div>
                <div className="mt-4 p-4 border border-[#D4AF37]/15 bg-[#D4AF3706] rounded-sm">
                  <p className="text-[10px] text-[#3a5570] leading-relaxed">By submitting, you acknowledge this is a confidential application to The Bloom Society. Dr. Graham and Dr. Prabhakar will personally review your profile. No Graham is deployed without a signed engagement and confirmed payment.</p>
                </div>
                {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step>1 && <button onClick={()=>setStep(s=>(s-1) as Step)} className="px-5 py-2.5 bg-[#0a1628] border border-[#0d1b35] text-[#3a5570] text-xs font-mono rounded-sm hover:text-white transition-colors">← BACK</button>}
              {step<4
                ? <button onClick={()=>setStep(s=>(s+1) as Step)} disabled={step===1?!step1Valid:step===2?!step2Valid:!step3Valid} className="flex-1 py-2.5 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed tracking-widest">CONTINUE →</button>
                : <button onClick={submit} disabled={submitting} className="flex-1 py-2.5 bg-[#D4AF37] text-[#030810] text-xs font-mono font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50 tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.25)]">{submitting?"SUBMITTING...":"SUBMIT APPLICATION →"}</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
  