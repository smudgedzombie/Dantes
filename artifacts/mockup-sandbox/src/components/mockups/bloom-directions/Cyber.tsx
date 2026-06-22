import React, { useEffect, useState } from "react";
import { Terminal, ShieldAlert, Cpu, ChevronRight, Lock, Activity, Globe, Zap, ArrowRight, CornerDownRight } from "lucide-react";

export function Cyber() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [text, setText] = useState("");
  const fullText = "COMMAND YOUR CAPITAL";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#090b0f] text-white overflow-hidden relative selection:bg-[#00f5d4] selection:text-black">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" style={{ background: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }} />
      
      {/* CSS overrides for fonts */}
      <style>{`
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        .glow-text-cyan { text-shadow: 0 0 10px rgba(0, 245, 212, 0.5); }
        .glow-text-gold { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        .glow-border-cyan { box-shadow: 0 0 15px rgba(0, 245, 212, 0.2), inset 0 0 10px rgba(0, 245, 212, 0.1); border-color: rgba(0, 245, 212, 0.5); }
        .glow-border-gold { box-shadow: 0 0 15px rgba(255, 215, 0, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1); border-color: rgba(255, 215, 0, 0.5); }
        
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 20s linear infinite; }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
      `}</style>

      {/* Ticker */}
      <div className="absolute top-0 left-0 w-full bg-black/80 border-b border-[#00f5d4]/20 py-1.5 z-40 overflow-hidden font-tech text-xs tracking-wider text-[#00f5d4]/80 flex">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <span>SET: 1,423.81 <span className="text-[#00f5d4]">+1.2%</span></span>
              <span>BTC: ฿2,450,192 <span className="text-[#FFD700]">-0.4%</span></span>
              <span>SIRI: 1.84 <span className="text-[#00f5d4]">+2.1%</span></span>
              <span>AOT: 68.50 <span className="text-[#00f5d4]">+0.5%</span></span>
              <span>PTT: 34.25 <span className="text-red-500">-1.1%</span></span>
              <span>ETH: ฿112,400 <span className="text-[#00f5d4]">+3.4%</span></span>
              <span>CPALL: 56.75 <span className="text-[#00f5d4]">+0.2%</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-40 pt-16 pb-6 px-8 flex justify-between items-center border-b border-white/5 max-w-7xl mx-auto">
        <div className="font-tech text-xl font-bold tracking-widest flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#00f5d4]" />
          DANTÈS<span className="text-[#00f5d4]">.SYS</span>
        </div>
        <div className="hidden md:flex gap-8 font-tech text-sm tracking-widest text-white/60">
          <a href="#" className="hover:text-[#00f5d4] transition-colors">INTELLIGENCE</a>
          <a href="#" className="hover:text-[#00f5d4] transition-colors">AGENTS</a>
          <a href="#" className="hover:text-[#00f5d4] transition-colors">NETWORK</a>
        </div>
        <button className="font-tech text-xs border border-[#00f5d4]/30 text-[#00f5d4] px-4 py-2 hover:bg-[#00f5d4]/10 transition-colors flex items-center gap-2">
          <Lock className="w-3 h-3" /> LOGIN
        </button>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center z-10 min-h-[80vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.05)_0%,transparent_50%)]" />
        
        <div className="inline-block border border-[#00f5d4]/30 px-4 py-1.5 mb-8 font-tech text-sm text-[#00f5d4] tracking-widest bg-black/50 backdrop-blur-sm">
          SYS.STATUS: <span className="text-[#00f5d4] glow-text-cyan">ONLINE</span>
        </div>
        
        <h1 className="font-tech text-7xl md:text-9xl font-bold tracking-tighter mb-4 text-white glow-text-cyan mix-blend-screen">
          DANTÈS
        </h1>
        
        <div className="font-rajdhani text-2xl md:text-4xl text-[#FFD700] tracking-[0.2em] mb-12 h-10 glow-text-gold font-semibold uppercase">
          {text}<span className="animate-blink">_</span>
        </div>
        
        <p className="font-rajdhani text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 tracking-wide font-light">
          The apex command platform for Bangkok's elite. Algorithmic precision meets unparalleled access. Your wealth, weaponized.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 font-tech tracking-widest">
          <button className="bg-[#00f5d4]/10 border border-[#00f5d4] text-[#00f5d4] px-8 py-4 glow-border-cyan hover:bg-[#00f5d4] hover:text-black transition-all flex items-center justify-center gap-3 group">
            <Terminal className="w-5 h-5 group-hover:animate-pulse" />
            ACCESS TERMINAL
          </button>
          <button className="border border-white/20 text-white/70 px-8 py-4 hover:border-white hover:text-white transition-colors flex items-center justify-center gap-3">
            <Activity className="w-5 h-5" />
            WATCH THE REEL
          </button>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-10 border-y border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            { label: "ASSETS TRACKED", value: "฿2.4B" },
            { label: "ACTIVE MEMBERS", value: "847" },
            { label: "SIGNAL ACCURACY", value: "99.7%" },
            { label: "SEATS REMAINING", value: "7 / 120", alert: true }
          ].map((stat, i) => (
            <div key={i} className="p-8 flex flex-col items-center md:items-start text-center md:text-left relative group">
              <div className="absolute inset-0 bg-[#00f5d4]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-2 font-tech text-sm text-white/40 tracking-widest">
                <div className={`w-2 h-2 rounded-full ${stat.alert ? 'bg-[#FFD700]' : 'bg-[#00f5d4]'} animate-pulse`} />
                {stat.label}
              </div>
              <div className={`font-rajdhani text-3xl font-bold tracking-wider ${stat.alert ? 'text-[#FFD700]' : 'text-white'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTS SECTION */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="font-tech text-[#00f5d4] text-sm tracking-widest mb-4 flex items-center gap-2">
            <CornerDownRight className="w-4 h-4" /> MODULE.01
          </div>
          <h2 className="font-rajdhani text-4xl md:text-5xl font-bold tracking-widest uppercase">GRAHAM <span className="text-[#FFD700]">AGENTS</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "ALPHA SCOUT",
              icon: <Zap className="w-8 h-8 text-[#00f5d4]" />,
              desc: "Autonomous market scanning across SET & crypto. Identifies asymmetrical opportunities before they trend.",
              status: "ACTIVE"
            },
            {
              title: "RISK SENTINEL",
              icon: <ShieldAlert className="w-8 h-8 text-[#FFD700]" />,
              desc: "24/7 portfolio protection. Executes dynamic hedging strategies when volatility spikes.",
              status: "ACTIVE"
            },
            {
              title: "PORTFOLIO ARCHITECT",
              icon: <Cpu className="w-8 h-8 text-[#00f5d4]" />,
              desc: "Deep-learning driven asset allocation tailored to your specific risk-return profile.",
              status: "TRAINING"
            }
          ].map((agent, i) => (
            <div key={i} className="bg-black/60 border border-white/10 p-8 hover:border-[#00f5d4]/50 transition-colors relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-tech text-[10px] tracking-widest text-white/30">
                SYS_ID: 00{i + 1}
              </div>
              <div className="mb-6 p-4 bg-white/5 inline-block rounded-sm group-hover:glow-border-cyan border border-transparent transition-all">
                {agent.icon}
              </div>
              <h3 className="font-rajdhani text-2xl font-semibold tracking-wider mb-4">{agent.title}</h3>
              <p className="font-tech text-sm text-white/50 leading-relaxed mb-8 h-20">
                {agent.desc}
              </p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 font-tech text-xs tracking-widest">
                <span className="text-white/40">STATUS:</span>
                <span className={agent.status === 'ACTIVE' ? 'text-[#00f5d4]' : 'text-[#FFD700]'}>{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-24 bg-black/80 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "It replaces a family office of five with one terminal. The Alpha Scout found a dislocation in Sathorn real estate trusts before my brokers even woke up.",
                author: "C. T., Silom",
                role: "PRIVATE EQUITY DIRECTOR"
              },
              {
                quote: "The interface is aggressive, but the logic is flawless. I've routed all my crypto staking and SET equities through Dantès. It's the only platform I trust now.",
                author: "K. W., Ploenchit",
                role: "TECH FOUNDER"
              }
            ].map((testimonial, i) => (
              <div key={i} className="relative p-[1px] bg-gradient-to-b from-white/20 to-transparent group">
                <div className="bg-[#090b0f] p-10 h-full">
                  <div className="font-tech text-4xl text-[#00f5d4]/20 mb-6">"</div>
                  <p className="font-rajdhani text-xl text-white/80 leading-relaxed mb-8 font-light">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center font-tech text-sm text-[#FFD700]">
                      {testimonial.author.split('')[0]}
                    </div>
                    <div>
                      <div className="font-tech text-sm tracking-widest text-white">{testimonial.author}</div>
                      <div className="font-tech text-xs tracking-widest text-[#00f5d4]/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative z-10 py-32 px-8 max-w-3xl mx-auto text-center">
        <div className="inline-block border border-[#FFD700]/30 px-4 py-1.5 mb-8 font-tech text-xs text-[#FFD700] tracking-widest bg-[#FFD700]/5">
          STRICTLY INVITE ONLY — 7 OF 120 SEATS REMAINING
        </div>
        <h2 className="font-rajdhani text-4xl md:text-6xl font-bold tracking-widest uppercase mb-8">
          INITIALIZE <span className="text-[#00f5d4]">SEQUENCE</span>
        </h2>
        
        <form className="flex flex-col md:flex-row gap-4 mb-8 font-tech">
          <input 
            type="email" 
            placeholder="ENTER ENCRYPTED COMMS (EMAIL)" 
            className="flex-1 bg-black border border-white/20 px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#00f5d4] transition-colors tracking-widest"
          />
          <button type="button" className="bg-[#00f5d4] text-black px-8 py-4 font-bold tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
            REQUEST ACCESS <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="font-tech text-xs text-white/40 tracking-widest">
          ACCESS IS SUBJECT TO BOARD APPROVAL. MINIMUM AUM REQUIREMENTS APPLY.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-8 font-tech text-xs text-white/30 tracking-widest text-center flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div>&copy; {new Date().getFullYear()} THE BLOOM SOCIETY. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">SECURE ENCLAVE</a>
          <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-white transition-colors">SYS.LOGS</a>
        </div>
      </footer>
    </div>
  );
}
