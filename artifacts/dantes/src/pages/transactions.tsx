import { useState } from "react";
import { useListTransactions, useListAccounts, useListCategories, useCreateTransaction, useDeleteTransaction, getListTransactionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from "lucide-react";

const TX_TYPES = ["income", "expense", "transfer"] as const;

function TransactionForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: accounts } = useListAccounts();
  const { data: categories } = useListCategories();
  const create = useCreateTransaction({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListTransactionsQueryKey() }); onClose(); } },
  });
  const [form, setForm] = useState({ description: "", amount: "", type: "expense" as typeof TX_TYPES[number], accountId: "", categoryId: "", date: new Date().toISOString().split("T")[0], notes: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ data: {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      accountId: parseInt(form.accountId),
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      date: form.date,
      notes: form.notes || undefined,
    } });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 space-y-4">
      <h3 className="text-base font-serif font-bold text-white">New Transaction</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Description</label>
          <input required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Whole Foods Market" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Amount</label>
          <input required type="number" step="0.01" min="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof TX_TYPES[number] }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            {TX_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Account</label>
          <select required value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            <option value="">Select account</option>
            {accounts?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Category</label>
          <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            <option value="">None</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Date</label>
          <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Notes (optional)</label>
          <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Optional notes..." />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={create.isPending}
          className="px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50">
          {create.isPending ? "Creating..." : "Add Transaction"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary text-muted-foreground text-sm rounded-sm hover:text-white transition-colors">Cancel</button>
      </div>
    </form>
  );
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  income: <ArrowUpRight className="w-4 h-4 text-green-400" />,
  expense: <ArrowDownRight className="w-4 h-4 text-red-400" />,
  transfer: <ArrowLeftRight className="w-4 h-4 text-blue-400" />,
};

export default function TransactionsPage() {
  const qc = useQueryClient();
  const [filterType, setFilterType] = useState<string>("");
  const { data: transactions, isLoading } = useListTransactions({ type: (filterType || undefined) as "income" | "expense" | "transfer" | undefined });
  const deleteTransaction = useDeleteTransaction({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListTransactionsQueryKey() }) } });
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Ledger</h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">Full transaction history</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors">
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </header>

        <div className="flex gap-2">
          {["", "income", "expense", "transfer"].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filterType === t ? "bg-[#D4AF37] text-[#0A1128]" : "bg-secondary text-muted-foreground hover:text-white"}`}>
              {t === "" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {showForm && <TransactionForm onClose={() => setShowForm(false)} />}

        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Type</span>
            <span>Description</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !transactions?.length ? (
            <div className="p-12 text-center text-muted-foreground text-sm">No transactions found.</div>
          ) : transactions.map(tx => (
            <div key={tx.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-4 border-b border-border/50 last:border-0 hover:bg-secondary/30 group transition-colors">
              <div className="w-8 h-8 rounded-sm bg-secondary flex items-center justify-center">
                {TYPE_ICON[tx.type]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {tx.accountName ?? "—"}
                  {tx.categoryName && <span> · <span style={{ color: tx.categoryColor ?? undefined }}>{tx.categoryName}</span></span>}
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">{new Date(tx.date + "T00:00:00").toLocaleDateString()}</p>
              <div className="flex items-center gap-3">
                <p className={`text-sm font-mono font-bold text-right ${tx.type === "income" ? "text-green-400" : tx.type === "expense" ? "text-red-400" : "text-blue-400"}`}>
                  {tx.type === "income" ? "+" : tx.type === "expense" ? "−" : ""}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <button onClick={() => deleteTransaction.mutate({ id: tx.id })}
                  className="p-1.5 rounded-sm opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
