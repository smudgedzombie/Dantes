import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "rgba(251,146,60,0.1)", text: "#fb923c", border: "rgba(251,146,60,0.3)" },
  paid: { bg: "rgba(0,196,90,0.1)", text: "#00c45a", border: "rgba(0,196,90,0.3)" },
  overdue: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.3)" },
};

const P = {
  bg: "#f5f0ff", heading: "#1e1b4b", body: "#5a587a", muted: "#9898b8", purple: "#a855f7",
  card: "rgba(255,255,255,0.68)", cardBorder: "rgba(168,85,247,0.18)",
};

type Invoice = { id:number; period:string; amountUsd:string; currency:string; status:string; paidAt:string|null; notes:string|null; paymentLink:string|null; dueDate:string|null; createdAt:string };

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

  const navLinks = [
    {href:"/portal",l:"OVERVIEW"},{href:"/portal/tasks",l:"TASKS"},{href:"/portal/documents",l:"DOCUMENTS"},
    {href:"/portal/billing",l:`BILLING${totalDue>0?" (!)":""}`},{href:"/portal/club",l:"✦ CLUB ROOM"}
  ];

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 80% 0%,rgba(168,85,247,0.07),transparent),radial-gradient(ellipse 60% 60% at 20% 100%,rgba(34,211,238,0.06),transparent)" }} />

      <header className="relative z-10 border-b px-4 sm:px-6 py-4 flex items-center gap-4" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <Link href="/portal"><img src="/logo.png" alt="Dantès" className="w-9 h-9 object-contain" /></Link>
        <div>
          <p className="text-[9px] font-mono tracking-[0.3em]" style={{ color: P.purple }}>BLOOM SOCIETY PORTAL</p>
          <p className="font-serif font-bold text-sm" style={{ color: P.heading }}>Billing & Invoices</p>
        </div>
      </header>

      <nav className="relative z-10 border-b px-4 sm:px-6 flex gap-0 overflow-x-auto" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderColor: "rgba(168,85,247,0.12)" }}>
        {navLinks.map(i=>(
          <Link key={i.href} href={i.href}
            className="px-4 py-3 text-[10px] font-mono border-b-2 transition-all whitespace-nowrap"
            style={i.href==="/portal/billing" ? { color: P.purple, borderColor: P.purple } : { color: P.muted, borderColor: "transparent" }}>
            {i.l}
          </Link>
        ))}
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label:"TOTAL PAID", value:`$${totalPaid.toLocaleString()}`, color:"#00c45a" },
            { label:"BALANCE DUE", value:`$${totalDue.toLocaleString()}`, color: totalDue > 0 ? "#fb923c" : P.muted },
            { label:"INVOICES", value:invoices.length, color: P.purple },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
              <p className="text-[9px] font-mono tracking-widest mb-2" style={{ color: P.muted }}>{s.label}</p>
              <p className="font-mono font-bold text-2xl" style={{ color:s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><span className="font-mono text-xs animate-pulse" style={{ color: P.purple }}>LOADING...</span></div>
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
            <p className="font-mono text-2xl mb-3" style={{ color: P.purple }}>◉</p>
            <p className="font-semibold mb-2" style={{ color: P.heading }}>No invoices yet</p>
            <p className="text-sm" style={{ color: P.body }}>Your billing history will appear here once your first invoice is issued.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[9px] font-mono tracking-widest mb-3" style={{ color: P.muted }}>INVOICE HISTORY</p>
            {invoices.map(inv => {
              const sc = STATUS_COLORS[inv.status];
              return (
                <div key={inv.id} className="rounded-2xl p-5" style={{ background: P.card, border: `1px solid ${P.cardBorder}` }}>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-semibold" style={{ color: P.heading }}>{inv.period}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase"
                          style={{ background: sc?.bg, color: sc?.text, border: `1px solid ${sc?.border}` }}>
                          {inv.status}
                        </span>
                      </div>
                      {inv.dueDate && inv.status !== "paid" && (
                        <p className="text-[9px] font-mono mb-1" style={{ color: "#fb923c" }}>Due: {inv.dueDate}</p>
                      )}
                      {inv.notes && <p className="text-[10px] mb-1" style={{ color: P.body }}>{inv.notes}</p>}
                      <p className="text-[9px] font-mono" style={{ color: P.muted }}>Issued {new Date(inv.createdAt).toLocaleDateString()}{inv.paidAt ? ` · Paid ${new Date(inv.paidAt).toLocaleDateString()}` : ""}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-xl mb-1" style={{ color: P.heading }}>${parseFloat(inv.amountUsd).toLocaleString()}</p>
                      <p className="text-[9px] font-mono mb-2" style={{ color: P.muted }}>{inv.currency}</p>
                      {inv.paymentLink && inv.status !== "paid" && (
                        <a href={inv.paymentLink} target="_blank" rel="noreferrer"
                          className="inline-block px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold text-white transition-all tracking-widest"
                          style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
                          PAY NOW →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl p-5" style={{ background: P.card, border: `1px solid rgba(168,85,247,0.25)` }}>
          <p className="text-[9px] font-mono tracking-widest mb-2" style={{ color: P.purple }}>PAYMENT ENQUIRIES</p>
          <p className="text-xs leading-relaxed" style={{ color: P.body }}>For payment queries, invoice corrections, or to discuss your engagement terms, contact Dr. Steven Graham or Dr. Akshay Prabhakar directly. All financial terms are governed by your signed Bloom Society engagement agreement.</p>
        </div>
      </div>
    </div>
  );
}
