import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListWishlistItems,
  useCreateWishlistItem,
  useDeleteWishlistItem,
  useUpdateWishlistItem,
  getListWishlistItemsQueryKey,
} from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { Plus, Trash2, Heart, Package, CheckCircle2, ShoppingCart } from "lucide-react";

const PLATFORMS = ["any", "shopee", "lazada", "tiktok"] as const;
const PLATFORM_LABELS: Record<string, string> = {
  any: "Any",
  shopee: "Shopee",
  lazada: "Lazada",
  tiktok: "TikTok Shop",
};
const STATUS_COLORS: Record<string, string> = {
  watching: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  matched: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  purchased: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  watching: <Heart className="w-3 h-3" />,
  matched: <CheckCircle2 className="w-3 h-3" />,
  purchased: <ShoppingCart className="w-3 h-3" />,
};

const CATEGORIES = ["Electronics", "Clothing", "Footwear", "Beauty", "Home", "Sports", "Books", "Food", "Other"];

interface FormState {
  name: string;
  category: string;
  budgetMin: string;
  budgetMax: string;
  platform: string;
  notes: string;
}

const emptyForm: FormState = { name: "", category: "Electronics", budgetMin: "", budgetMax: "", platform: "any", notes: "" };

export default function Wishlist() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: items, isLoading } = useListWishlistItems();
  const createMutation = useCreateWishlistItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWishlistItemsQueryKey() });
        setForm(emptyForm);
        setShowForm(false);
      },
    },
  });
  const deleteMutation = useDeleteWishlistItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWishlistItemsQueryKey() });
        setDeletingId(null);
      },
    },
  });
  const updateMutation = useUpdateWishlistItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWishlistItemsQueryKey() });
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.budgetMin || !form.budgetMax) return;
    createMutation.mutate({
      data: {
        name: form.name,
        category: form.category,
        budgetMin: parseFloat(form.budgetMin),
        budgetMax: parseFloat(form.budgetMax),
        platform: form.platform as "any" | "shopee" | "lazada" | "tiktok",
        notes: form.notes || undefined,
      },
    });
  }

  function handleDelete(id: number) {
    setDeletingId(id);
    deleteMutation.mutate({ id });
  }

  function handleMarkPurchased(id: number) {
    updateMutation.mutate({ id, data: { status: "purchased" } });
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            Items you're tracking — we'll match them to the best deals.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 font-semibold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="p-6 border-primary/30 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <h2 className="font-bold text-lg mb-4">Add to Wishlist</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Item Name *</label>
                <Input
                  placeholder="e.g. Samsung Galaxy S24"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Category</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Budget Min (฿) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={form.budgetMin}
                  onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Budget Max (฿) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 15000"
                  value={form.budgetMax}
                  onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Preferred Platform</label>
                <div className="flex gap-2 flex-wrap">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, platform: p })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        form.platform === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {PLATFORM_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Notes (optional)</label>
                <Input
                  placeholder="e.g. prefer black color"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={createMutation.isPending} className="font-semibold">
                {createMutation.isPending ? "Adding..." : "Add to Wishlist"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Wishlist items */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : !items?.length ? (
        <div className="text-center py-24">
          <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-semibold text-muted-foreground">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add items above and we'll find the best deals for you.</p>
          <Button className="mt-4 gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Add your first item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card
              key={item.id}
              className="p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-500 hover:border-primary/30 transition-colors"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base truncate">{item.name}</span>
                    <Badge className={`text-[10px] gap-1 border-none ${STATUS_COLORS[item.status]}`}>
                      {STATUS_ICONS[item.status]}
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-semibold text-foreground">
                      {formatPrice(item.budgetMin)} – {formatPrice(item.budgetMax)}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{PLATFORM_LABELS[item.platform] ?? item.platform}</span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5 italic">{item.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status !== "purchased" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 gap-1"
                    onClick={() => handleMarkPurchased(item.id)}
                    disabled={updateMutation.isPending}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Bought
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
