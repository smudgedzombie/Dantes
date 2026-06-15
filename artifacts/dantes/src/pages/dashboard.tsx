import { useGetDashboardSummary, useGetMonthlyFlow, useGetRecentTransactions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useClerk } from "@clerk/react";
import { Activity, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign, LogOut, Menu, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Dantès" className="h-6 w-6 mr-3" />
          <span className="font-serif font-bold text-white tracking-wide">Dantès</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {[
            { name: "Terminal", path: "/dashboard", icon: <Activity className="w-4 h-4" /> },
            { name: "Ledger", path: "/transactions", icon: <CreditCard className="w-4 h-4" /> },
            { name: "Accounts", path: "/accounts", icon: <DollarSign className="w-4 h-4" /> },
            { name: "Allocations", path: "/budgets", icon: <PieChart className="w-4 h-4" /> },
            { name: "Taxonomy", path: "/categories", icon: <Menu className="w-4 h-4" /> },
          ].map((item) => (
            <Link key={item.path} href={item.path} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm text-muted-foreground hover:text-white hover:bg-secondary transition-colors">
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2 text-sm font-medium w-full rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}

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
