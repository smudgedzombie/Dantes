import React, { useEffect } from 'react';
import { ChevronRight, Brain, PieChart, Crown, ArrowRight } from 'lucide-react';

const GLASS_PANEL_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
};

const GLASS_CARD_HOVER_STYLE = `
  transition-all duration-500 ease-out
  hover:bg-white/5 hover:border-white/20
  hover:-translate-y-1 hover:shadow-2xl
`;

function AnimatedReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}

export function Glass() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.media = 'print';
    link.onload = function() {
      (this as HTMLLinkElement).media = 'all';
    };
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400&display=swap';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#E8E8E8] font-['Inter'] selection:bg-[#F5E6C8]/30 overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#1a2340] rounded-full blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] bg-[#F5E6C8] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#0a0e1a] rounded-full blur-[150px] opacity-80 pointer-events-none" />
      
      {/* 1. HERO */}
      <header className="relative h-screen flex flex-col items-center justify-center px-6 text-center z-10">
        <AnimatedReveal>
          <h1 className="font-['Cormorant_Garamond'] text-6xl md:text-8xl tracking-widest text-[#E8E8E8] font-light mb-6 uppercase">
            Dantès
          </h1>
        </AnimatedReveal>
        
        <AnimatedReveal delay={200}>
          <div className="w-12 h-px bg-white/20 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-white/60 font-light tracking-wide max-w-lg mb-12">
            Private Wealth Intelligence.<br/>
            Crafted for Bangkok's Elite.
          </p>
        </AnimatedReveal>
        
        <AnimatedReveal delay={400}>
          <button 
            style={GLASS_PANEL_STYLE}
            className="group px-8 py-4 rounded-full flex items-center gap-3 text-sm tracking-widest uppercase transition-all duration-500 hover:bg-white/10 hover:border-white/30"
          >
            <span>Apply for Access</span>
            <ChevronRight className="w-4 h-4 text-[#F5E6C8] transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-8 text-xs tracking-widest text-white/30 uppercase">
            By invitation or referral only
          </p>
        </AnimatedReveal>
      </header>

      {/* 2. GLASS CARDS ROW */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI Agents",
              desc: "Autonomous financial intelligence anticipating market movements before they happen."
            },
            {
              icon: PieChart,
              title: "Portfolio Command",
              desc: "Unified visualization of global assets, real estate, and private equity."
            },
            {
              icon: Crown,
              title: "Club Privileges",
              desc: "Exclusive access to private events across Sathorn, Ploenchit, and Langsuan."
            }
          ].map((feature, i) => (
            <div 
              key={i}
              style={GLASS_PANEL_STYLE}
              className={`p-10 rounded-2xl ${GLASS_CARD_HOVER_STYLE}`}
            >
              <feature.icon className="w-8 h-8 text-[#F5E6C8] mb-8 stroke-[1.5]" />
              <h3 className="font-['Cormorant_Garamond'] text-2xl mb-4 text-[#E8E8E8]">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIALS */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-32">
          {[
            {
              quote: "Dantès fundamentally shifted how I manage our family office. The interface is impossibly elegant, and the intelligence is razor-sharp.",
              author: "P. Sirivat",
              title: "Managing Director, Sathorn"
            },
            {
              quote: "Finally, a platform that understands the nuance of illiquid assets alongside modern markets. It feels less like software and more like a private banker.",
              author: "K. Ratanarak",
              title: "Principal, Langsuan Family Office"
            }
          ].map((testimonial, i) => (
            <div key={i} className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl md:text-5xl italic text-[#E8E8E8]/90 leading-tight mb-8">
                "{testimonial.quote}"
              </p>
              <div className="inline-block text-left">
                <p className="text-sm tracking-widest text-[#F5E6C8] uppercase mb-1">{testimonial.author}</p>
                <p className="text-xs tracking-widest text-white/40 uppercase">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TIER SECTION */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-xs tracking-[0.3em] text-white/40 uppercase mb-4">Membership Tiers</h2>
          <div className="w-8 h-px bg-[#F5E6C8]/30 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {[
            { name: "Analyst", price: "฿50K", desc: "Core intelligence and portfolio tracking." },
            { name: "Principal", price: "฿150K", desc: "Advanced agents, predictive modeling, and concierge.", featured: true },
            { name: "Operator", price: "฿500K", desc: "Full command center, private advisory, global execution." }
          ].map((tier, i) => (
            <div 
              key={i}
              style={{
                ...GLASS_PANEL_STYLE,
                ...(tier.featured ? { border: '1px solid rgba(245, 230, 200, 0.3)' } : {})
              }}
              className={`p-10 rounded-2xl relative ${tier.featured ? 'md:-translate-y-4 shadow-2xl shadow-[#F5E6C8]/5' : ''} ${GLASS_CARD_HOVER_STYLE}`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5E6C8] text-[#0a0e1a] text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}
              <h3 className="font-['Cormorant_Garamond'] text-2xl mb-2 text-[#E8E8E8]">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-3xl font-light">{tier.price}</span>
                <span className="text-xs text-white/40">/mo</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed font-light mb-8 h-10">
                {tier.desc}
              </p>
              <button className={`w-full py-3 rounded-lg text-sm tracking-widest uppercase transition-colors ${
                tier.featured 
                  ? 'bg-[#F5E6C8] text-[#0a0e1a] hover:bg-white' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}>
                Inquire
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONTACT / FOOTER */}
      <footer className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-[#E8E8E8] mb-8">
            Begin the Conversation
          </h2>
          
          <form className="flex flex-col sm:flex-row gap-4 mb-16" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={GLASS_PANEL_STYLE}
              className="flex-1 px-6 py-4 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button 
              style={GLASS_PANEL_STYLE}
              className="px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <span>Submit</span>
              <ArrowRight className="w-4 h-4 text-[#F5E6C8]" />
            </button>
          </form>
          
          <div className="space-y-4">
            <p className="text-xs tracking-widest text-white/30 uppercase">
              Strictly Confidential. Invite-only access.
            </p>
            <p className="text-[10px] tracking-widest text-white/20 uppercase">
              &copy; {new Date().getFullYear()} The Bloom Society. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
