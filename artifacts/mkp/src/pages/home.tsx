import { useGetTrendingDeals, useGetMatchedDeals, useGetAlertsSummary } from "@workspace/api-client-react";
import { DealCard } from "@/components/DealCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { BellRing, Flame, Sparkles, ArrowRight, Wallet, TrendingDown } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useGetAlertsSummary();
  const { data: trendingDeals, isLoading: isLoadingTrending } = useGetTrendingDeals();
  const { data: matchedDeals, isLoading: isLoadingMatched } = useGetMatchedDeals();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Ready to hunt some deals?
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          We've scouted the best prices across platforms for you.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground border-none p-5 shadow-lg shadow-primary/20 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-primary-foreground/80 font-medium text-sm">Potential Savings</p>
              {isLoadingSummary ? (
                <div className="h-8 w-24 bg-white/20 rounded animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-black">{formatPrice(summary?.totalSavings ?? 0)}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-secondary text-secondary-foreground border-none p-5 shadow-lg shadow-secondary/20 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-secondary-foreground/80 font-medium text-sm">Price Drops Today</p>
              {isLoadingSummary ? (
                <div className="h-8 w-16 bg-white/20 rounded animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-black">{summary?.triggeredToday ?? 0} alerts</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-xl text-accent-foreground">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium text-sm">Wishlist Matches</p>
              {isLoadingSummary ? (
                <div className="h-8 w-16 bg-muted rounded animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-black text-foreground">{summary?.matchedCount ?? 0} deals</p>
              )}
            </div>
          </div>
          <Link href="/wishlist" className="p-2 hover:bg-accent/10 rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Card>
      </div>

      {/* Trending Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-lg">
              <Flame className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Trending Right Now</h2>
          </div>
          <Link href="/deals" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingTrending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : !trendingDeals?.length ? (
          <p className="text-muted-foreground text-sm">No trending deals at the moment. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDeals.slice(0, 4).map((deal, i) => (
              <DealCard key={deal.id} deal={deal} staggerIndex={i} />
            ))}
          </div>
        )}
      </section>

      {/* Matched Deals Section */}
      {!isLoadingMatched && matchedDeals && matchedDeals.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Matches Your Wishlist</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {matchedDeals.map((match, i) => (
              <DealCard key={match.deal.id} deal={match.deal} staggerIndex={i} />
            ))}
          </div>
        </section>
      )}

      {/* Watchlist summary */}
      {!isLoadingSummary && summary && (
        <section className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-lg">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">{summary.watchingCount} items being watched</p>
                <p className="text-sm text-muted-foreground">{summary.totalAlerts} price alerts active</p>
              </div>
            </div>
            <Link href="/alerts" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View alerts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
