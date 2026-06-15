import { useState } from "react";
import { useListBudgets, useListCategories, useCreateBudget, useDeleteBudget, getListBudgetsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

function BudgetForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: categories } = useListCategories();
  const create = useCreateBudget({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListBudgetsQueryKey() }); onClose(); } },
  });
  const [form, setForm] = useState({ categoryId: "", amount: "", period: "monthly" as "monthly" | "yearly", startDate: new Date().toISOString().split("T")[0] });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ categoryId: parseInt(form.categoryId), amount: parseFloat(form.amount), period: form.period, startDate: form.startDate });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 space-y-4">
      <h3 className="text-base font-serif font-bold text-white">New Allocation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Category</label>
          <select required value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            <option value="">Select category</option>
            {categories?.filter(c => c.type === "expense").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Budget Amount</label>
          <input required type="number" step="0.01" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Period</label>
          <select value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value as "monthly" | "yearly" }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Start Date</label>
          <input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={create.isPending}
          className="px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50">
          {create.isPending ? "Creating..." : "Set Allocation"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary text-muted-foreground text-sm rounded-sm hover:text-white transition-colors">Cancel</button>
      </div>
    </form>
  );
}

export default function BudgetsPage() {
  const qc = useQueryClient();
  const { data: budgets, isLoading } = useListBudgets();
  const deleteBudget = useDeleteBudget({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListBudgetsQueryKey() }) } });
  const [showForm, setShowForm] = useState(false);

  const totalBudgeted = budgets?.reduce((sum, b) => sum + b.amount, 0) ?? 0;
  const totalSpent = budgets?.reduce((sum, b) => sum + (b.spent ?? 0), 0) ?? 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Allocations</h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">Monthly spend targets</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors">
            <Plus className="w-4 h-4" />
            New Allocation
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-5 rounded-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Budgeted</p>
            <p className="text-2xl font-mono font-bold text-white">${totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-card border border-border p-5 rounded-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Spent This Month</p>
            <p className="text-2xl font-mono font-bold text-red-400">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-card border border-border p-5 rounded-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Remaining</p>
            <p className={`text-2xl font-mono font-bold ${totalBudgeted - totalSpent >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${(totalBudgeted - totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {showForm && <BudgetForm onClose={() => setShowForm(false)} />}

        <div className="space-y-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : !budgets?.length ? (
            <div className="bg-card border border-border rounded-sm p-12 text-center">
              <p className="text-muted-foreground">No allocations yet. Set your first budget above.</p>
            </div>
          ) : budgets.map(budget => {
            const spent = budget.spent ?? 0;
            const pct = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
            const over = spent > budget.amount;
            return (
              <div key={budget.id} className="bg-card border border-border rounded-sm p-5 group hover:border-[#D4AF37]/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.categoryColor ?? "#D4AF37" }} />
                    <div>
                      <p className="text-sm font-semibold text-white">{budget.categoryName ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground font-mono capitalize">{budget.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-sm font-mono font-bold ${over ? "text-red-400" : "text-white"}`}>
                        ${spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="text-muted-foreground font-normal"> / ${budget.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{pct.toFixed(0)}% used</p>
                    </div>
                    <button onClick={() => deleteBudget.mutate({ id: budget.id })}
                      className="p-2 rounded-sm opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : budget.categoryColor ?? "#D4AF37" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
