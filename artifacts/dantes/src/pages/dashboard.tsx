import { useGetDashboardSummary, useGetMonthlyFlow, useGetRecentTransactions } from "@workspace/api-client-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Layout } from "@/components/layout";

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const divideColor = { borderColor: "rgba(168,85,247,0.12)" };

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: flow, isLoading: loadingFlow } = useGetMonthlyFlow();
  const { data: recent, isLoading: loadingRecent } = useGetRecentTransactions();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: "#1e1b4b" }}>Telemetry</h1>
          <p className="mt-1 font-mono text-sm" style={{ color: "#9898b8" }}>System status: OPERATIONAL</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6" style={card}>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Net Worth</h3>
            {loadingSummary ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-3xl sm:text-4xl font-mono font-bold" style={{ color: "#1e1b4b" }}>${summary?.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            )}
          </div>
          <div className="rounded-2xl p-6" style={card}>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>30D Inflow</h3>
            {loadingSummary ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-500 flex items-center gap-2">
                <ArrowUpRight className="w-6 h-6" />
                ${summary?.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
          <div className="rounded-2xl p-6" style={card}>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>30D Outflow</h3>
            {loadingSummary ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-3xl sm:text-4xl font-mono font-bold text-red-400 flex items-center gap-2">
                <ArrowDownRight className="w-6 h-6" />
                ${summary?.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-6" style={card}>
            <h3 className="text-base font-serif font-bold mb-6" style={{ color: "#1e1b4b" }}>Cash Flow Vector</h3>
            <div className="h-[300px] w-full">
              {loadingFlow ? <Skeleton className="w-full h-full" /> : flow && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Array.isArray(flow) ? flow : []}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#c4b5e0" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#c4b5e0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(168,85,247,0.25)', color: '#1e1b4b', borderRadius: 12 }}
                      itemStyle={{ color: '#a855f7' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#a855f7" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ec4899" fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={card}>
            <h3 className="text-base font-serif font-bold mb-6" style={{ color: "#1e1b4b" }}>Recent Ledger Entries</h3>
            <div className="space-y-4">
              {loadingRecent ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : recent && Array.isArray(recent) && recent.length > 0 ? (
                recent.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center pb-4 border-b last:border-0" style={divideColor}>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]" style={{ color: "#1e1b4b" }}>{tx.description}</p>
                      <p className="text-xs font-mono" style={{ color: "#9898b8" }}>{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-sm font-mono font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-center py-8" style={{ color: "#9898b8" }}>No recent entries</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
