import { useState } from "react";
import { useListDeals } from "@workspace/api-client-react";
import { DealCard } from "@/components/DealCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const PLATFORMS = ["all", "shopee", "lazada", "tiktok"] as const;
const PLATFORM_LABELS: Record<string, string> = {
  all: "All Platforms",
  shopee: "Shopee",
  lazada: "Lazada",
  tiktok: "TikTok Shop",
};

const CATEGORIES = [
  "All Categories",
  "Smartphones",
  "Earphones",
  "Headphones",
  "Tablets",
  "Peripherals",
  "Accessories",
  "Footwear",
  "Clothing",
  "Beauty",
  "Smart Home",
  "Smartwatches",
  "E-readers",
];

export default function Deals() {
  const [platform, setPlatform] = useState<string>("all");
  const [category, setCategory] = useState<string>("All Categories");

  const { data: deals, isLoading } = useListDeals({
    platform: platform === "all" ? undefined : platform as "shopee" | "lazada" | "tiktok",
    category: category === "All Categories" ? undefined : category,
    limit: 50,
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-black tracking-tight">Browse Deals</h1>
        <p className="text-muted-foreground mt-1">
          The best prices across Shopee, Lazada, and TikTok Shop — updated daily.
        </p>
      </div>

      {/* Platform filter */}
      <div className="flex gap-2 flex-wrap">
        {PLATFORMS.map((p) => (
          <Button
            key={p}
            variant={platform === p ? "default" : "outline"}
            size="sm"
            onClick={() => setPlatform(p)}
            className="font-semibold"
          >
            {PLATFORM_LABELS[p]}
          </Button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : !deals?.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-semibold">No deals found</p>
          <p className="text-sm mt-1">Try a different platform or category.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground font-medium">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map((deal, i) => (
              <DealCard key={deal.id} deal={deal} staggerIndex={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
