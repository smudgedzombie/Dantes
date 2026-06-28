import { useState } from "react";
import { useListBudgets, useListCategories, useCreateBudget, useDeleteBudget, getListBudgetsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: "#1e1b4b" };

function BudgetForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: categories } = useListCategories();
  const create = useCreateBudget({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListBudgetsQueryKey() }); onClose(); } },
  });
  const [form, setForm] = useState({ categoryId: "", amount: "", period: "monthly" as "monthly" | "yearly", startDate: new Date().toISOString().split("T")[0] });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ data: { categoryId: parseInt(form.categoryId), amount: parseFloat(form.amount), period: form.period, startDate: form.startDate } });
  }

  const inputCls = "w-full rounded-xl px-3 py-2 text-sm focus:outline-none";
  const labelCls = "block text-xs font-medium mb-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={card}>
      <h3 className="text-base font-serif font-bold" style={{ color: "#1e1b4b" }}>New Allocation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Category</label>
          <select required value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            className={inputCls} style={inputStyle}>
            <option value="">Select category</option>
            {categories?.filter(c => c.type === "expense").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Budget Amount</label>
          <input required type="number" step="0.01" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className={inputCls} style={inputStyle} placeholder="0.00" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Period</label>
          <select value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value as "monthly" | "yearly" }))}
            className={inputCls} style={inputStyle}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Start Date</label>
          <input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={create.isPending}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          {create.isPending ? "Creating..." : "Set Allocation"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ background: "rgba(168,85,247,0.08)", color: "#5a587a" }}>Cancel</button>
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
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: "#1e1b4b" }}>Allocations</h1>
            <p className="mt-1 font-mono text-sm" style={{ color: "#9898b8" }}>Monthly spend targets</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
            <Plus className="w-4 h-4" />
            New Allocation
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5" style={card}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Total Budgeted</p>
            <p className="text-2xl font-mono font-bold" style={{ color: "#1e1b4b" }}>${totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-2xl p-5" style={card}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Spent This Month</p>
            <p className="text-2xl font-mono font-bold text-red-400">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-2xl p-5" style={card}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9898b8" }}>Remaining</p>
            <p className={`text-2xl font-mono font-bold ${totalBudgeted - totalSpent >= 0 ? "text-emerald-500" : "text-red-400"}`}>
              ${(totalBudgeted - totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {showForm && <BudgetForm onClose={() => setShowForm(false)} />}

        <div className="space-y-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : !budgets?.length ? (
            <div className="rounded-2xl p-12 text-center" style={card}>
              <p style={{ color: "#9898b8" }}>No allocations yet. Set your first budget above.</p>
            </div>
          ) : budgets.map(budget => {
            const spent = budget.spent ?? 0;
            const pct = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
            const over = spent > budget.amount;
            return (
              <div key={budget.id} className="rounded-2xl p-5 group hover:shadow-md transition-all" style={card}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.categoryColor ?? "#a855f7" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1e1b4b" }}>{budget.categoryName ?? "Unknown"}</p>
                      <p className="text-xs font-mono capitalize" style={{ color: "#9898b8" }}>{budget.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-sm font-mono font-bold ${over ? "text-red-400" : ""}`} style={!over ? { color: "#1e1b4b" } : {}}>
                        ${spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span style={{ color: "#9898b8" }} className="font-normal"> / ${budget.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </p>
                      <p className="text-xs font-mono" style={{ color: "#9898b8" }}>{pct.toFixed(0)}% used</p>
                    </div>
                    <button onClick={() => deleteBudget.mutate({ id: budget.id })}
                      className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      style={{ color: "#9898b8" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(168,85,247,0.12)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : (budget.categoryColor ?? "#a855f7") }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
