import { useGetDashboardSummary, useGetMonthlyFlow, useGetRecentTransactions } from "@workspace/api-client-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Layout } from "@/components/layout";

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: flow, isLoading: loadingFlow } = useGetMonthlyFlow();
  const { data: recent, isLoading: loadingRecent } = useGetRecentTransactions();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-serif font-bold text-white">Telemetry</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">System status: OPERATIONAL</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-sm">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Net Worth</h3>
            {loadingSummary ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-4xl font-mono font-bold text-white">${summary?.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            )}
          </div>
          <div className="bg-card border border-border p-6 rounded-sm">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">30D Inflow</h3>
            {loadingSummary ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-4xl font-mono font-bold text-green-400 flex items-center gap-2">
                <ArrowUpRight className="w-6 h-6" />
                ${summary?.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
          <div className="bg-card border border-border p-6 rounded-sm">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">30D Outflow</h3>
            {loadingSummary ? <Skeleton className="h-10 w-32" /> : (
              <div className="text-4xl font-mono font-bold text-red-400 flex items-center gap-2">
                <ArrowDownRight className="w-6 h-6" />
                ${summary?.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border p-6 rounded-sm">
            <h3 className="text-base font-serif font-bold text-white mb-6">Cash Flow Vector</h3>
            <div className="h-[300px] w-full">
              {loadingFlow ? <Skeleton className="w-full h-full" /> : flow && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Array.isArray(flow) ? flow : []}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A1128', borderColor: '#1e293b', color: '#f8fafc' }}
                      itemStyle={{ color: '#D4AF37' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#4ade80" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f87171" fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-sm">
            <h3 className="text-base font-serif font-bold text-white mb-6">Recent Ledger Entries</h3>
            <div className="space-y-4">
              {loadingRecent ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : recent && Array.isArray(recent) && recent.length > 0 ? (
                recent.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center pb-4 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[150px]">{tx.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-sm font-mono font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No recent entries</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
