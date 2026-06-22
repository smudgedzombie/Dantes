import React, { useEffect } from "react";
import { ArrowRight, ChevronRight, Play, Shield, Activity, Fingerprint } from "lucide-react";

export function Cinematic() {
  // Inject fonts
  useEffect(() => {
    const linkId = "dantes-cinematic-fonts";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.media = "print";
      // @ts-ignore
      link.onload = function () { this.media = 'all'; };
      link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#8B1C1C] selection:text-white relative overflow-hidden" style={{ fontFamily: "'EB Garamond', serif" }}>
      {/* Film grain overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <div className="font-['Playfair_Display'] font-black tracking-widest text-xl uppercase">Dantès</div>
        <div className="flex gap-8 text-xs tracking-[0.2em] uppercase font-semibold text-gray-300">
          <a href="#intelligence" className="hover:text-[#C9A84C] transition-colors">Intelligence</a>
          <a href="#society" className="hover:text-[#C9A84C] transition-colors">The Society</a>
          <a href="#access" className="hover:text-[#C9A84C] transition-colors">Access</a>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="relative h-[100dvh] w-full flex overflow-hidden">
        {/* Left Typography */}
        <div className="w-[40%] h-full flex flex-col justify-center px-12 md:px-24 z-10 relative">
          <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-[#C9A84C] hidden md:block"></div>
          
          <h1 className="font-['Playfair_Display'] text-7xl md:text-[8rem] leading-[0.8] font-black uppercase tracking-tighter mb-8 pl-8">
            <span className="block text-gray-100">Dan</span>
            <span className="block text-gray-400">tès</span>
          </h1>
          
          <div className="pl-8 space-y-8">
            <p className="text-xl md:text-2xl text-gray-400 max-w-md font-light italic">
              The Command Layer for Serious Capital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pt-4">
              <button className="border border-[#C9A84C] text-[#C9A84C] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#C9A84C] hover:text-[#0c0c0c] transition-all duration-500 relative overflow-hidden group">
                <span className="relative z-10">Request Admission</span>
                <div className="absolute inset-0 bg-[#C9A84C] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
              </button>
              
              <button className="text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold flex items-center gap-2 group transition-colors">
                See the Platform
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Abstract Composition */}
        <div className="w-[60%] h-full relative">
          {/* Deep dark gradient structure */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0c0c0c] to-[#8B1C1C]/20"></div>
          
          {/* Abstract geometric shapes mimicking a vault/lens */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-white/5 opacity-50 blur-[2px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-[#C9A84C]/10 opacity-70"></div>
          
          {/* Cinematic lighting effect */}
          <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-[#8B1C1C]/10 to-transparent mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl"></div>
          
          {/* Architectural lines */}
          <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
      </section>

      {/* 2. STATEMENT ROW */}
      <section className="w-full py-32 bg-[#080808] border-y border-white/5 relative">
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <h2 className="font-['Playfair_Display'] italic font-bold text-4xl md:text-6xl text-gray-200 leading-tight">
            "While others track markets,<br/>our members command them."
          </h2>
          <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto mt-12"></div>
        </div>
      </section>

      {/* 3. INTELLIGENCE SECTION */}
      <section id="intelligence" className="py-32 px-8 md:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="flex flex-col justify-center">
            <div className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#C9A84C]"></span>
              Graham AI Architecture
            </div>
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold mb-8 leading-none">
              Asymmetric<br/>Advantage.
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-md">
              Custom-trained autonomous agents scanning Bangkok real estate, global equities, and private equity dealflow while you sleep. They do not guess. They compute.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Cards */}
            {[
              { title: "Alpha Scout", desc: "Predictive anomaly detection across SET and offshore markets.", icon: Activity },
              { title: "Risk Sentinel", desc: "Real-time exposure monitoring and automated hedging triggers.", icon: Shield },
              { title: "Portfolio Architect", desc: "Tax-optimized restructuring models for complex family office structures.", icon: Fingerprint }
            ].map((card, i) => (
              <div key={i} className="group relative bg-[#111] border border-white/5 p-8 flex items-start gap-6 hover:bg-[#151515] transition-colors duration-500 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C9A84C] to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-gray-500 group-hover:text-[#C9A84C] transition-colors">
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2 text-gray-200">{card.title}</h3>
                  <p className="text-gray-500 text-lg">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEMBERSHIP */}
      <section id="society" className="py-32 border-t border-white/5 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#8B1C1C]/5 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-8 md:px-24 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-gray-500">The Society</h2>
          </div>

          <div className="space-y-0">
            {/* Tiers */}
            {[
              { name: "Analyst", price: "฿250,000 / YR", desc: "Core platform access, market intelligence, and standard execution routing." },
              { name: "Principal", price: "฿850,000 / YR", desc: "Dedicated Graham instance, private dealflow, and priority liquidity access." },
              { name: "Operator", price: "By Invitation", desc: "Full command suite, dedicated analysts, and off-market bespoke structuring." }
            ].map((tier, i) => (
              <div key={i} className="group flex flex-col lg:flex-row items-baseline lg:items-center py-12 border-b border-white/10 hover:border-[#C9A84C]/50 transition-colors duration-500">
                <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                  <h3 className="font-['Playfair_Display'] text-4xl text-gray-300 group-hover:text-white transition-colors">{tier.name}</h3>
                </div>
                <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#C9A84C] uppercase">{tier.price}</span>
                </div>
                <div className="w-full lg:w-1/2">
                  <p className="text-xl text-gray-500 font-light italic">{tier.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EVIDENCE SECTION */}
      <section className="py-32 bg-[#050505] relative">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#8B1C1C]/10 to-transparent mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-8 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-24 relative z-10">
          <div>
            <span className="text-[#C9A84C] text-8xl font-['Playfair_Display'] leading-[0] block mb-8">"</span>
            <p className="font-['Playfair_Display'] text-3xl leading-snug text-gray-300 mb-8 italic">
              Dantès replaced three wealth managers and a family office analyst in its first month. The execution speed is frightening.
            </p>
            <div className="text-xs tracking-[0.2em] text-gray-500 uppercase font-bold">
              — Managing Partner, Sukhumvit Capital
            </div>
          </div>
          <div>
            <span className="text-[#C9A84C] text-8xl font-['Playfair_Display'] leading-[0] block mb-8">"</span>
            <p className="font-['Playfair_Display'] text-3xl leading-snug text-gray-300 mb-8 italic">
              It feels less like a software platform and more like having a Goldman Sachs trading desk in your pocket.
            </p>
            <div className="text-xs tracking-[0.2em] text-gray-500 uppercase font-bold">
              — Principal, Silom Real Estate Trust
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLOSE */}
      <section id="access" className="py-48 px-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-[#0c0c0c]">
        {/* Deep red underglow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#8B1C1C]/20 blur-[100px] pointer-events-none"></div>

        <h2 className="font-['Playfair_Display'] text-5xl md:text-7xl font-bold mb-6 relative z-10">
          Seven seats.<br/>
          <span className="text-gray-500">No extensions.</span><br/>
          <span className="text-[#8B1C1C]">No exceptions.</span>
        </h2>
        
        <p className="text-xl text-gray-400 mb-16 max-w-lg relative z-10 italic">
          Cohort III opens in Q4. Request prospectus and admission requirements.
        </p>

        <form className="w-full max-w-md relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Official Corporate Email" 
            className="w-full bg-transparent border-b border-gray-700 pb-4 text-center text-lg focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-gray-700 font-sans tracking-wide"
          />
          <button className="bg-[#C9A84C] text-[#0c0c0c] w-full py-5 uppercase tracking-[0.2em] text-xs font-black hover:bg-white transition-colors duration-500">
            Submit Credentials
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-xs tracking-widest text-gray-600 uppercase font-sans">
        © {new Date().getFullYear()} Dantès Command Platform. All rights reserved.
      </footer>
    </div>
  );
}
