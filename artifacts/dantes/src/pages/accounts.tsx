import { useState } from "react";
import { useListAccounts, useCreateAccount, useDeleteAccount } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListAccountsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Building2, PiggyBank, TrendingUp, CreditCard, Wallet } from "lucide-react";

const ACCOUNT_TYPES = ["checking", "savings", "investment", "credit", "cash"] as const;
const TYPE_ICONS: Record<string, React.ReactNode> = {
  checking: <Building2 className="w-5 h-5" />,
  savings: <PiggyBank className="w-5 h-5" />,
  investment: <TrendingUp className="w-5 h-5" />,
  credit: <CreditCard className="w-5 h-5" />,
  cash: <Wallet className="w-5 h-5" />,
};
const TYPE_COLORS: Record<string, string> = {
  checking: "#D4AF37",
  savings: "#06b6d4",
  investment: "#22c55e",
  credit: "#ef4444",
  cash: "#8b5cf6",
};

function AccountForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const createAccount = useCreateAccount({
    mutation: {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListAccountsQueryKey() }); onClose(); },
    },
  });
  const [form, setForm] = useState({ name: "", type: "checking" as typeof ACCOUNT_TYPES[number], balance: "", currency: "USD", color: "#D4AF37" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createAccount.mutate({ data: { name: form.name, type: form.type, balance: parseFloat(form.balance) || 0, currency: form.currency, color: form.color } });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 space-y-4">
      <h3 className="text-base font-serif font-bold text-white">New Account</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Account Name</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Dantès Reserve" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof ACCOUNT_TYPES[number] }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Balance</label>
          <input required type="number" step="0.01" min="0" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Currency</label>
          <input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={createAccount.isPending}
          className="px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50">
          {createAccount.isPending ? "Creating..." : "Create Account"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary text-muted-foreground text-sm rounded-sm hover:text-white transition-colors">Cancel</button>
      </div>
    </form>
  );
}

export default function AccountsPage() {
  const { data: accounts, isLoading } = useListAccounts();
  const qc = useQueryClient();
  const deleteAccount = useDeleteAccount({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListAccountsQueryKey() }) } });
  const [showForm, setShowForm] = useState(false);

  const totalAssets = accounts?.filter(a => a.type !== "credit").reduce((sum, a) => sum + a.balance, 0) ?? 0;
  const totalLiabilities = accounts?.filter(a => a.type === "credit").reduce((sum, a) => sum + a.balance, 0) ?? 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Accounts</h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">Capital positions overview</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors">
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-5 rounded-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Assets</p>
            <p className="text-2xl font-mono font-bold text-green-400">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-card border border-border p-5 rounded-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Liabilities</p>
            <p className="text-2xl font-mono font-bold text-red-400">${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-card border border-border p-5 rounded-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Net Worth</p>
            <p className="text-2xl font-mono font-bold text-[#D4AF37]">${(totalAssets - totalLiabilities).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {showForm && <AccountForm onClose={() => setShowForm(false)} />}

        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : accounts?.length === 0 ? (
            <div className="bg-card border border-border rounded-sm p-12 text-center">
              <p className="text-muted-foreground">No accounts yet. Add your first account above.</p>
            </div>
          ) : accounts?.map(account => (
            <div key={account.id} className="bg-card border border-border rounded-sm p-5 flex items-center gap-4 group hover:border-[#D4AF37]/30 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: (TYPE_COLORS[account.type] ?? "#D4AF37") + "20", color: TYPE_COLORS[account.type] ?? "#D4AF37" }}>
                {TYPE_ICONS[account.type] ?? <Wallet className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{account.name}</p>
                <p className="text-xs text-muted-foreground font-mono uppercase">{account.type} · {account.currency}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-mono font-bold ${account.type === "credit" ? "text-red-400" : "text-white"}`}>
                  ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button
                onClick={() => deleteAccount.mutate({ id: account.id })}
                className="ml-2 p-2 rounded-sm opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
