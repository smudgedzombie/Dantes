import { useListAlerts, useGetAlertsSummary } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { BellRing, BellOff, TrendingDown, Wallet, Eye, CheckCircle2 } from "lucide-react";

const PLATFORM_LABELS: Record<string, string> = {
  shopee: "Shopee",
  lazada: "Lazada",
  tiktok: "TikTok Shop",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Alerts() {
  const { data: summary, isLoading: isLoadingSummary } = useGetAlertsSummary();
  const { data: alerts, isLoading: isLoadingAlerts } = useListAlerts();

  const triggered = alerts?.filter((a) => a.triggered) ?? [];
  const watching = alerts?.filter((a) => !a.triggered) ?? [];

  return (
    <div className="space-y-6 pb-10">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-black tracking-tight">Price Alerts</h1>
        <p className="text-muted-foreground mt-1">
          We watch prices 24/7 so you don't have to.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isLoadingSummary ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          <>
            <Card className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <BellRing className="w-3.5 h-3.5" /> Total Alerts
              </div>
              <p className="text-2xl font-black">{summary?.totalAlerts ?? 0}</p>
            </Card>
            <Card className="p-4 space-y-1 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider">
                <TrendingDown className="w-3.5 h-3.5" /> Triggered Today
              </div>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400">{summary?.triggeredToday ?? 0}</p>
            </Card>
            <Card className="p-4 space-y-1 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" /> Watching
              </div>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-400">{summary?.watchingCount ?? 0}</p>
            </Card>
            <Card className="p-4 space-y-1 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5" /> Total Saved
              </div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {formatPrice(summary?.totalSavings ?? 0)}
              </p>
            </Card>
          </>
        )}
      </div>

      {isLoadingAlerts ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : !alerts?.length ? (
        <div className="text-center py-24">
          <BellOff className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-semibold text-muted-foreground">No price alerts yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Add items to your wishlist and alerts will appear here when prices drop.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {triggered.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Price Dropped
              </h2>
              {triggered.map((alert, i) => (
                <Card
                  key={alert.id}
                  className="p-4 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold truncate">{alert.wishlistItemName}</span>
                          <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] dark:bg-emerald-900/50 dark:text-emerald-300">
                            Triggered
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {PLATFORM_LABELS[alert.platform] ?? alert.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground line-through">{formatPrice(alert.originalPrice)}</span>
                          <span className="text-xs font-bold text-emerald-600">→ {formatPrice(alert.currentPrice)}</span>
                          <span className="text-xs text-muted-foreground">
                            · {alert.triggeredAt ? timeAgo(alert.triggeredAt) : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">You save</p>
                      <p className="font-black text-emerald-600">
                        {formatPrice(alert.originalPrice - alert.alertPrice)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {watching.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" /> Currently Watching
              </h2>
              {watching.map((alert, i) => (
                <Card
                  key={alert.id}
                  className="p-4 animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <BellRing className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold truncate">{alert.wishlistItemName}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {PLATFORM_LABELS[alert.platform] ?? alert.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            Alert at {formatPrice(alert.alertPrice)} · Current {formatPrice(alert.currentPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">Potential save</p>
                      <p className="font-black text-primary">
                        {formatPrice(alert.originalPrice - alert.alertPrice)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
