import React, { useEffect, useState } from "react";
import { Terminal, ShieldAlert, Cpu, ChevronRight, Lock, Activity, Globe, Zap, ArrowRight, CornerDownRight } from "lucide-react";

export function CyberPhosphor() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap";
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
    <div className="min-h-screen bg-[#020d02] text-[#00FF41] overflow-hidden relative selection:bg-[#00FF41] selection:text-[#020d02]">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20" style={{ background: "linear-gradient(transparent 50%, rgba(0, 255, 65, 0.1) 50%), linear-gradient(90deg, rgba(0, 255, 65, 0.05), rgba(0, 255, 65, 0.02), rgba(0, 255, 65, 0.05))", backgroundSize: "100% 4px, 3px 100%" }} />
      
      {/* CSS overrides for fonts */}
      <style>{`
        .font-tech { font-family: 'Share Tech Mono', monospace; }
        .glow-text-green { text-shadow: 0 0 15px rgba(0, 255, 65, 0.6), 0 0 30px rgba(0, 255, 65, 0.4); }
        .glow-border-green { box-shadow: 0 0 15px rgba(0, 255, 65, 0.4), inset 0 0 10px rgba(0, 255, 65, 0.2); border-color: rgba(0, 255, 65, 0.8); }
        
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
      <div className="absolute top-0 left-0 w-full bg-[#020d02] border-b border-[#00FF41]/30 py-1.5 z-40 overflow-hidden font-tech text-xs tracking-wider text-[#00FF41]/70 flex">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <span>SET: 1,423.81 <span className="text-[#00FF41]">+1.2%</span></span>
              <span>BTC: ฿2,450,192 <span className="text-[#39D353]">-0.4%</span></span>
              <span>SIRI: 1.84 <span className="text-[#00FF41]">+2.1%</span></span>
              <span>AOT: 68.50 <span className="text-[#00FF41]">+0.5%</span></span>
              <span>PTT: 34.25 <span className="text-[#39D353]">-1.1%</span></span>
              <span>ETH: ฿112,400 <span className="text-[#00FF41]">+3.4%</span></span>
              <span>CPALL: 56.75 <span className="text-[#00FF41]">+0.2%</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-40 pt-16 pb-6 px-8 flex justify-between items-center border-b border-[#00FF41]/20 max-w-7xl mx-auto">
        <div className="font-tech text-xl font-bold tracking-widest flex items-center gap-2 glow-text-green">
          <Globe className="w-5 h-5 text-[#00FF41]" />
          DANTÈS<span className="text-[#00FF41]/70">.SYS</span>
        </div>
        <div className="hidden md:flex gap-8 font-tech text-sm tracking-widest text-[#00FF41]/70">
          <a href="#" className="hover:text-[#00FF41] transition-colors hover:glow-text-green">INTELLIGENCE</a>
          <a href="#" className="hover:text-[#00FF41] transition-colors hover:glow-text-green">AGENTS</a>
          <a href="#" className="hover:text-[#00FF41] transition-colors hover:glow-text-green">NETWORK</a>
        </div>
        <button className="font-tech text-xs border border-[#00FF41]/50 text-[#00FF41] px-4 py-2 hover:bg-[#00FF41]/20 transition-colors flex items-center gap-2 glow-border-green bg-[#020d02]">
          <Lock className="w-3 h-3" /> LOGIN
        </button>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center z-10 min-h-[80vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.08)_0%,transparent_60%)]" />
        
        <div className="inline-block border border-[#00FF41]/40 px-4 py-1.5 mb-8 font-tech text-sm text-[#00FF41] tracking-widest bg-[#00FF41]/5 backdrop-blur-sm">
          SYS.STATUS: <span className="text-[#00FF41] glow-text-green">ONLINE</span>
        </div>
        
        <h1 className="font-tech text-7xl md:text-9xl font-bold tracking-tighter mb-4 text-[#00FF41] glow-text-green mix-blend-screen">
          DANTÈS
        </h1>
        
        <div className="font-tech text-2xl md:text-4xl text-[#39D353] tracking-[0.2em] mb-12 h-10 glow-text-green font-bold uppercase">
          {text}<span className="animate-blink">_</span>
        </div>
        
        <p className="font-tech text-lg md:text-xl text-[rgba(0,255,65,0.7)] max-w-2xl mx-auto mb-12 tracking-wide">
          The apex command platform for Bangkok's elite. Algorithmic precision meets unparalleled access. Your wealth, weaponized.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 font-tech tracking-widest">
          <button className="bg-[#00FF41] text-[#020d02] border border-[#00FF41] px-8 py-4 glow-border-green hover:bg-[#39D353] hover:border-[#39D353] transition-all flex items-center justify-center gap-3 group font-bold">
            <Terminal className="w-5 h-5 group-hover:animate-pulse" />
            ACCESS TERMINAL
          </button>
          <button className="border border-[#00FF41]/40 text-[#00FF41]/80 px-8 py-4 hover:border-[#00FF41] hover:text-[#00FF41] hover:glow-border-green transition-colors flex items-center justify-center gap-3 bg-[#020d02]">
            <Activity className="w-5 h-5" />
            WATCH THE REEL
          </button>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-10 border-y border-[#00FF41]/20 bg-[#020d02]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#00FF41]/20">
          {[
            { label: "ASSETS TRACKED", value: "฿2.4B" },
            { label: "ACTIVE MEMBERS", value: "847" },
            { label: "SIGNAL ACCURACY", value: "99.7%" },
            { label: "SEATS REMAINING", value: "7 / 120", alert: true }
          ].map((stat, i) => (
            <div key={i} className="p-8 flex flex-col items-center md:items-start text-center md:text-left relative group">
              <div className="absolute inset-0 bg-[#00FF41]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-2 font-tech text-sm text-[rgba(0,255,65,0.5)] tracking-widest">
                <div className={`w-2 h-2 rounded-full ${stat.alert ? 'bg-[#39D353]' : 'bg-[#00FF41]'} animate-pulse`} />
                {stat.label}
              </div>
              <div className={`font-tech text-3xl font-bold tracking-wider ${stat.alert ? 'text-[#39D353] glow-text-green' : 'text-[#00FF41] glow-text-green'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTS SECTION */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="font-tech text-[#00FF41] text-sm tracking-widest mb-4 flex items-center gap-2">
            <CornerDownRight className="w-4 h-4" /> MODULE.01
          </div>
          <h2 className="font-tech text-4xl md:text-5xl font-bold tracking-widest uppercase glow-text-green">GRAHAM <span className="text-[#39D353]">AGENTS</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "ALPHA SCOUT",
              icon: <Zap className="w-8 h-8 text-[#00FF41]" />,
              desc: "Autonomous market scanning across SET & crypto. Identifies asymmetrical opportunities before they trend.",
              status: "ACTIVE"
            },
            {
              title: "RISK SENTINEL",
              icon: <ShieldAlert className="w-8 h-8 text-[#39D353]" />,
              desc: "24/7 portfolio protection. Executes dynamic hedging strategies when volatility spikes.",
              status: "ACTIVE"
            },
            {
              title: "PORTFOLIO ARCHITECT",
              icon: <Cpu className="w-8 h-8 text-[#00FF41]" />,
              desc: "Deep-learning driven asset allocation tailored to your specific risk-return profile.",
              status: "TRAINING"
            }
          ].map((agent, i) => (
            <div key={i} className="bg-[#020d02] border border-[#00FF41]/30 p-8 hover:glow-border-green transition-all relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-tech text-[10px] tracking-widest text-[#00FF41]/40">
                SYS_ID: 00{i + 1}
              </div>
              <div className="mb-6 p-4 bg-[#00FF41]/5 inline-block rounded-sm group-hover:bg-[#00FF41]/10 border border-[#00FF41]/20 transition-all glow-text-green">
                {agent.icon}
              </div>
              <h3 className="font-tech text-2xl font-bold tracking-wider mb-4 text-[#00FF41] glow-text-green">{agent.title}</h3>
              <p className="font-tech text-sm text-[rgba(0,255,65,0.7)] leading-relaxed mb-8 h-20">
                {agent.desc}
              </p>
              <div className="flex items-center justify-between border-t border-[#00FF41]/20 pt-4 font-tech text-xs tracking-widest">
                <span className="text-[rgba(0,255,65,0.5)]">STATUS:</span>
                <span className={agent.status === 'ACTIVE' ? 'text-[#00FF41] glow-text-green' : 'text-[#39D353] glow-text-green'}>{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-24 bg-[#020d02] border-y border-[#00FF41]/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsNjUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
        
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
              <div key={i} className="relative p-[1px] bg-gradient-to-b from-[#00FF41]/40 to-transparent group">
                <div className="bg-[#020d02] p-10 h-full border-t border-[#00FF41]/30">
                  <div className="font-tech text-4xl text-[#00FF41]/30 mb-6 glow-text-green">"</div>
                  <p className="font-tech text-lg text-[rgba(0,255,65,0.8)] leading-relaxed mb-8">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#00FF41]/10 border border-[#00FF41]/40 flex items-center justify-center font-tech text-sm text-[#00FF41] glow-text-green">
                      {testimonial.author.split('')[0]}
                    </div>
                    <div>
                      <div className="font-tech text-sm tracking-widest text-[#00FF41] font-bold">{testimonial.author}</div>
                      <div className="font-tech text-xs tracking-widest text-[rgba(0,255,65,0.6)]">{testimonial.role}</div>
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
        <div className="inline-block border border-[#39D353]/50 px-4 py-1.5 mb-8 font-tech text-xs text-[#39D353] tracking-widest bg-[#39D353]/10 glow-text-green">
          STRICTLY INVITE ONLY — 7 OF 120 SEATS REMAINING
        </div>
        <h2 className="font-tech text-4xl md:text-6xl font-bold tracking-widest uppercase mb-8 glow-text-green">
          INITIALIZE <span className="text-[#39D353]">SEQUENCE</span>
        </h2>
        
        <form className="flex flex-col md:flex-row gap-4 mb-8 font-tech">
          <input 
            type="email" 
            placeholder="ENTER ENCRYPTED COMMS (EMAIL)" 
            className="flex-1 bg-[#020d02] border border-[#00FF41]/40 px-6 py-4 text-[#00FF41] placeholder-[rgba(0,255,65,0.4)] focus:outline-none focus:border-[#00FF41] focus:glow-border-green transition-all tracking-widest"
          />
          <button type="button" className="bg-[#00FF41] text-[#020d02] px-8 py-4 font-bold tracking-widest hover:bg-[#39D353] transition-colors flex items-center justify-center gap-2 glow-border-green">
            REQUEST ACCESS <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="font-tech text-xs text-[rgba(0,255,65,0.4)] tracking-widest">
          ACCESS IS SUBJECT TO BOARD APPROVAL. MINIMUM AUM REQUIREMENTS APPLY.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#00FF41]/20 py-8 px-8 font-tech text-xs text-[rgba(0,255,65,0.4)] tracking-widest text-center flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div>&copy; {new Date().getFullYear()} THE BLOOM SOCIETY. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#00FF41] hover:glow-text-green transition-colors">SECURE ENCLAVE</a>
          <a href="#" className="hover:text-[#00FF41] hover:glow-text-green transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-[#00FF41] hover:glow-text-green transition-colors">SYS.LOGS</a>
        </div>
      </footer>
    </div>
  );
}
