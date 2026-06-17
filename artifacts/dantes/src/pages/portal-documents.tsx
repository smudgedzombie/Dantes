import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const TYPE_ICONS: Record<string, string> = { report:"◈", contract:"◆", invoice:"◉", other:"◎" };
const TYPE_COLORS: Record<string, string> = { report:"#06b6d4", contract:"#D4AF37", invoice:"#00ff88", other:"#3a5570" };

type Doc = { id:number; name:string; type:string; description:string|null; uploadedBy:string; createdAt:string };

export default function PortalDocumentsPage() {
  const { getToken } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await fetch("/api/portal/documents", { headers: { Authorization:`Bearer ${token}` } });
      if (res.ok) setDocs(await res.json());
      setLoading(false);
    })();
  }, []);

  const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";
  const filtered = filter === "all" ? docs : docs.filter(d => d.type === filter);

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center gap-4">
        <Link href="/portal"><img src="/logo.jpg" alt="Dantès" className="w-9 h-9 object-contain rounded-sm" /></Link>
        <div>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em]">BLOOM SOCIETY PORTAL</p>
          <p className="text-white font-serif font-bold text-sm">Documents & Reports</p>
        </div>
      </header>

      <nav className="relative z-10 border-b border-[#0d1b35] px-6 flex gap-0">
        {[{href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},{href:"/portal/billing",l:"BILLING"}].map(i=>(
          <Link key={i.href} href={i.href} className={`px-4 py-3 text-[10px] font-mono border-b-2 transition-all ${i.href==="/portal/documents"?"text-[#D4AF37] border-[#D4AF37]":"text-[#3a5570] border-transparent hover:text-white hover:border-[#D4AF37]/40"}`}>{i.l}</Link>
        ))}
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          {["all","report","contract","invoice","other"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 text-[10px] font-mono rounded-sm border transition-colors capitalize ${filter===f?"bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]":"bg-[#040c1a] border-[#0d1b35] text-[#3a5570] hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING...</span></div>
        ) : filtered.length === 0 ? (
          <div className={`${panelCls} p-16 text-center`}>
            <p className="text-[#D4AF37] font-mono text-2xl mb-3">◈</p>
            <p className="text-white font-semibold mb-2">No documents yet</p>
            <p className="text-[#3a5570] text-sm">Your Graham will deposit reports, contracts, and files here as work progresses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(d => (
              <div key={d.id} className={`${panelCls} p-5 hover:border-[#D4AF37]/20 transition-colors`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-sm bg-[#030810] border border-[#0d1b35] flex items-center justify-center shrink-0 text-base"
                    style={{ color: TYPE_COLORS[d.type] ?? "#D4AF37" }}>
                    {TYPE_ICONS[d.type] ?? "◎"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-0.5 truncate">{d.name}</p>
                    <p className="text-[10px] font-mono capitalize mb-1" style={{ color: TYPE_COLORS[d.type] ?? "#D4AF37" }}>{d.type}</p>
                    {d.description && <p className="text-[10px] text-[#3a5570] leading-relaxed line-clamp-2">{d.description}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0d1b35]">
                  <p className="text-[9px] font-mono text-[#2a4060]">Deposited {new Date(d.createdAt).toLocaleDateString()}</p>
                  <p className="text-[9px] font-mono text-[#3a5570]">by {d.uploadedBy === "system" ? "Graham" : "Bloom Society"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
