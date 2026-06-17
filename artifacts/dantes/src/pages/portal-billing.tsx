import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
};

type Invoice = { id:number; period:string; amountUsd:string; currency:string; status:string; paidAt:string|null; notes:string|null; createdAt:string };

export default function PortalBillingPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await fetch("/api/portal/invoices", { headers: { Authorization:`Bearer ${token}` } });
      if (res.ok) setInvoices(await res.json());
      setLoading(false);
    })();
  }, []);

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + parseFloat(i.amountUsd), 0);
  const totalDue = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + parseFloat(i.amountUsd), 0);
  const panelCls = "bg-[#040c1a] border border-[#0d1b35] rounded-sm";

  return (
    <div className="min-h-screen bg-[#030810] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage:"linear-gradient(rgba(212,175,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      <header className="relative z-10 border-b border-[#0d1b35] px-6 py-4 flex items-center gap-4">
        <Link href="/portal"><img src="/logo.jpg" alt="Dantès" className="w-9 h-9 object-contain rounded-sm" /></Link>
        <div>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em]">BLOOM SOCIETY PORTAL</p>
          <p className="text-white font-serif font-bold text-sm">Billing & Invoices</p>
        </div>
      </header>

      <nav className="relative z-10 border-b border-[#0d1b35] px-6 flex gap-0">
        {[{href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},{href:"/portal/billing",l:"BILLING"}].map(i=>(
          <Link key={i.href} href={i.href} className={`px-4 py-3 text-[10px] font-mono border-b-2 transition-all ${i.href==="/portal/billing"?"text-[#D4AF37] border-[#D4AF37]":"text-[#3a5570] border-transparent hover:text-white hover:border-[#D4AF37]/40"}`}>{i.l}</Link>
        ))}
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label:"TOTAL PAID", value:`$${totalPaid.toLocaleString()}`, color:"#00ff88" },
            { label:"BALANCE DUE", value:`$${totalDue.toLocaleString()}`, color: totalDue > 0 ? "#f97316" : "#3a5570" },
            { label:"INVOICES", value:invoices.length, color:"#D4AF37" },
          ].map(s => (
            <div key={s.label} className={`${panelCls} p-4`}>
              <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-2">{s.label}</p>
              <p className="font-mono font-bold text-2xl" style={{ color:s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><span className="text-[#D4AF37] font-mono text-xs animate-pulse">LOADING...</span></div>
        ) : invoices.length === 0 ? (
          <div className={`${panelCls} p-16 text-center`}>
            <p className="text-[#D4AF37] font-mono text-2xl mb-3">◉</p>
            <p className="text-white font-semibold mb-2">No invoices yet</p>
            <p className="text-[#3a5570] text-sm">Your billing history will appear here once your first invoice is issued.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[9px] font-mono text-[#3a5570] tracking-widest mb-3">INVOICE HISTORY</p>
            {invoices.map(inv => (
              <div key={inv.id} className={`${panelCls} p-4 flex items-center gap-4`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white">{inv.period}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${STATUS_COLORS[inv.status] ?? ""}`}>{inv.status}</span>
                  </div>
                  {inv.notes && <p className="text-[10px] text-[#3a5570]">{inv.notes}</p>}
                  <p className="text-[9px] font-mono text-[#2a4060] mt-0.5">Issued {new Date(inv.createdAt).toLocaleDateString()}{inv.paidAt ? ` · Paid ${new Date(inv.paidAt).toLocaleDateString()}` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg text-white">${parseFloat(inv.amountUsd).toLocaleString()}</p>
                  <p className="text-[9px] font-mono text-[#3a5570]">{inv.currency}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`${panelCls} p-5 border-[#D4AF37]/15`}>
          <p className="text-[9px] font-mono text-[#D4AF37] tracking-widest mb-2">PAYMENT ENQUIRIES</p>
          <p className="text-xs text-[#3a5570] leading-relaxed">For payment queries, invoice corrections, or to discuss your engagement terms, contact Dr. Steven Graham or Dr. Akshay Prabhakar directly. All financial terms are governed by your signed Bloom Society engagement agreement.</p>
        </div>
      </div>
    </div>
  );
}
