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
  checking: "#a855f7",
  savings: "#22d3ee",
  investment: "#22c55e",
  credit: "#ef4444",
  cash: "#ec4899",
};

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: "#1e1b4b" };

function AccountForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const createAccount = useCreateAccount({
    mutation: {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListAccountsQueryKey() }); onClose(); },
    },
  });
  const [form, setForm] = useState({ name: "", type: "checking" as typeof ACCOUNT_TYPES[number], balance: "", currency: "USD", color: "#a855f7" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createAccount.mutate({ data: { name: form.name, type: form.type, balance: parseFloat(form.balance) || 0, currency: form.currency, color: form.color } });
  }

  const inputCls = "w-full rounded-xl px-3 py-2 text-sm focus:outline-none font-mono";
  const labelCls = "block text-xs font-medium mb-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={card}>
      <h3 className="text-base font-serif font-bold" style={{ color: "#1e1b4b" }}>New Account</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Account Name</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={inputCls} style={inputStyle} placeholder="e.g. Dantès Reserve" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof ACCOUNT_TYPES[number] }))}
            className={inputCls} style={inputStyle}>
            {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Balance</label>
          <input required type="number" step="0.01" min="0" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))}
            className={inputCls} style={inputStyle} placeholder="0.00" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Currency</label>
          <input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={createAccount.isPending}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          {createAccount.isPending ? "Creating..." : "Create Account"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ background: "rgba(168,85,247,0.08)", color: "#5a587a" }}>Cancel</button>
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
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: "#1e1b4b" }}>Accounts</h1>
            <p className="mt-1 font-mono text-sm" style={{ color: "#9898b8" }}>Capital positions overview</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5" style={card}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Total Assets</p>
            <p className="text-2xl font-mono font-bold text-emerald-500">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-2xl p-5" style={card}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Total Liabilities</p>
            <p className="text-2xl font-mono font-bold text-red-400">${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-2xl p-5" style={card}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Net Worth</p>
            <p className="text-2xl font-mono font-bold" style={{ color: "#a855f7" }}>${(totalAssets - totalLiabilities).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {showForm && <AccountForm onClose={() => setShowForm(false)} />}

        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : accounts?.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={card}>
              <p style={{ color: "#9898b8" }}>No accounts yet. Add your first account above.</p>
            </div>
          ) : accounts?.map(account => (
            <div key={account.id} className="rounded-2xl p-5 flex items-center gap-4 group hover:shadow-md transition-all" style={card}>
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (TYPE_COLORS[account.type] ?? "#a855f7") + "18", color: TYPE_COLORS[account.type] ?? "#a855f7" }}>
                {TYPE_ICONS[account.type] ?? <Wallet className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "#1e1b4b" }}>{account.name}</p>
                <p className="text-xs font-mono uppercase" style={{ color: "#9898b8" }}>{account.type} · {account.currency}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-mono font-bold ${account.type === "credit" ? "text-red-400" : ""}`} style={account.type !== "credit" ? { color: "#1e1b4b" } : {}}>
                  ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button
                onClick={() => deleteAccount.mutate({ id: account.id })}
                className="ml-2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                style={{ color: "#9898b8" }}
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
