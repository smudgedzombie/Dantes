import { useState } from "react";
import { useListCategories, useCreateCategory, useDeleteCategory, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

const PRESET_COLORS = [
  "#a855f7", "#22c55e", "#22d3ee", "#8b5cf6",
  "#ef4444", "#fb923c", "#ec4899", "#14b8a6",
  "#64748b", "#10b981",
];

const card = { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(168,85,247,0.18)", backdropFilter: "blur(10px)" };
const inputStyle = { background: "rgba(255,255,255,0.85)", border: "1px solid rgba(168,85,247,0.25)", color: "#1e1b4b" };

function CategoryForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const create = useCreateCategory({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() }); onClose(); } },
  });
  const [form, setForm] = useState({ name: "", type: "expense" as "income" | "expense", color: "#a855f7", icon: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ data: { name: form.name, type: form.type, color: form.color, icon: form.icon || undefined } });
  }

  const inputCls = "w-full rounded-xl px-3 py-2 text-sm focus:outline-none";
  const labelCls = "block text-xs font-medium mb-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={card}>
      <h3 className="text-base font-serif font-bold" style={{ color: "#1e1b4b" }}>New Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Name</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={inputCls} style={inputStyle} placeholder="e.g. Dining Out" />
        </div>
        <div>
          <label className={labelCls} style={{ color: "#9898b8" }}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "income" | "expense" }))}
            className={inputCls} style={inputStyle}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: "#9898b8" }}>Color</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                className="w-7 h-7 rounded-lg transition-all"
                style={{ backgroundColor: c, border: form.color === c ? "3px solid #1e1b4b" : "3px solid transparent", boxShadow: form.color === c ? "0 0 8px " + c + "60" : "none" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={create.isPending}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
          {create.isPending ? "Creating..." : "Add Category"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ background: "rgba(168,85,247,0.08)", color: "#5a587a" }}>Cancel</button>
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { data: categories, isLoading } = useListCategories();
  const deleteCategory = useDeleteCategory({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() }) } });
  const [showForm, setShowForm] = useState(false);

  const income = categories?.filter(c => c.type === "income") ?? [];
  const expense = categories?.filter(c => c.type === "expense") ?? [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: "#1e1b4b" }}>Taxonomy</h1>
            <p className="mt-1 font-mono text-sm" style={{ color: "#9898b8" }}>Transaction classification system</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)" }}>
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </header>

        {showForm && <CategoryForm onClose={() => setShowForm(false)} />}

        {isLoading ? (
          <div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{ label: "Income", items: income }, { label: "Expense", items: expense }].map(({ label, items }) => (
              <div key={label}>
                <h2 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#9898b8" }}>{label} Categories</h2>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="rounded-2xl p-6 text-center text-sm" style={{ ...card, color: "#9898b8" }}>No {label.toLowerCase()} categories</div>
                  ) : items.map(cat => (
                    <div key={cat.id} className="rounded-2xl px-4 py-3 flex items-center gap-3 group hover:shadow-sm transition-all" style={card}>
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color ?? "#a855f7" }} />
                      <p className="text-sm font-medium flex-1" style={{ color: "#1e1b4b" }}>{cat.name}</p>
                      <button onClick={() => deleteCategory.mutate({ id: cat.id })}
                        className="p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                        style={{ color: "#9898b8" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
