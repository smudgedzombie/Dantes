import { useState } from "react";
import { useListCategories, useCreateCategory, useDeleteCategory, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

const PRESET_COLORS = [
  "#D4AF37", "#22c55e", "#06b6d4", "#8b5cf6",
  "#ef4444", "#f97316", "#ec4899", "#14b8a6",
  "#64748b", "#10b981",
];

function CategoryForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const create = useCreateCategory({
    mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() }); onClose(); } },
  });
  const [form, setForm] = useState({ name: "", type: "expense" as "income" | "expense", color: "#D4AF37", icon: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ data: { name: form.name, type: form.type, color: form.color, icon: form.icon || undefined } });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 space-y-4">
      <h3 className="text-base font-serif font-bold text-white">New Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Name</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Dining Out" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "income" | "expense" }))}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Color</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                className="w-7 h-7 rounded-sm transition-all border-2"
                style={{ backgroundColor: c, borderColor: form.color === c ? "white" : "transparent" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={create.isPending}
          className="px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors disabled:opacity-50">
          {create.isPending ? "Creating..." : "Add Category"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary text-muted-foreground text-sm rounded-sm hover:text-white transition-colors">Cancel</button>
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
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Taxonomy</h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">Transaction classification system</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A1128] text-sm font-bold rounded-sm hover:bg-[#b8952b] transition-colors">
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
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{label} Categories</h2>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="bg-card border border-border rounded-sm p-6 text-center text-muted-foreground text-sm">No {label.toLowerCase()} categories</div>
                  ) : items.map(cat => (
                    <div key={cat.id} className="bg-card border border-border rounded-sm px-4 py-3 flex items-center gap-3 group hover:border-[#D4AF37]/30 transition-colors">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color ?? "#D4AF37" }} />
                      <p className="text-sm font-medium text-white flex-1">{cat.name}</p>
                      <button onClick={() => deleteCategory.mutate({ id: cat.id })}
                        className="p-1.5 rounded-sm opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
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
