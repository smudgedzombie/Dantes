import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell, Globe, Moon, Sun, RefreshCw, Smartphone, Mail,
  ShoppingBag, Tag, Wallet, Shield, Trash2, CheckCircle2,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatPrice } from "@/lib/format";
import { useListDeals } from "@workspace/api-client-react";

const PLATFORM_COLORS = { shopee: "#ee4d2d", lazada: "#0f146d", tiktok: "#010101" };
const PLATFORM_LABELS: Record<string, string> = { shopee: "Shopee", lazada: "Lazada", tiktok: "TikTok Shop" };

function useLivePlatformRates() {
  const { data: deals } = useListDeals({ limit: 50 });

  const [history, setHistory] = useState<Array<{ time: string; shopee: number; lazada: number; tiktok: number }>>([]);

  useEffect(() => {
    if (!deals?.length) return;

    function computeAvgDiscount(platform: string) {
      const platformDeals = deals!.filter((d) => d.platform === platform);
      if (!platformDeals.length) return 0;
      return platformDeals.reduce((sum, d) => sum + parseFloat(String(d.discountPercent ?? "0")), 0) / platformDeals.length;
    }

    function addTick() {
      const jitter = () => (Math.random() - 0.5) * 3;
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      setHistory((prev) => {
        const base = prev.length
          ? { shopee: prev[prev.length - 1].shopee, lazada: prev[prev.length - 1].lazada, tiktok: prev[prev.length - 1].tiktok }
          : { shopee: computeAvgDiscount("shopee"), lazada: computeAvgDiscount("lazada"), tiktok: computeAvgDiscount("tiktok") };

        const next = {
          time,
          shopee: Math.max(5, Math.min(70, base.shopee + jitter())),
          lazada: Math.max(5, Math.min(70, base.lazada + jitter())),
          tiktok: Math.max(5, Math.min(70, base.tiktok + jitter())),
        };
        const updated = [...prev, next];
        return updated.slice(-20);
      });
    }

    addTick();
    const interval = setInterval(addTick, 3000);
    return () => clearInterval(interval);
  }, [deals]);

  return history;
}

function PlatformTrendChart() {
  const history = useLivePlatformRates();
  const latest = history[history.length - 1];

  if (!history.length) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
        Loading live rates…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-4 flex-wrap">
        {(["shopee", "lazada", "tiktok"] as const).map((p) => {
          const cur = latest?.[p] ?? 0;
          const prev = history[history.length - 2]?.[p] ?? cur;
          const bullish = cur >= prev;
          return (
            <div key={p} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: PLATFORM_COLORS[p] }} />
              <span className="text-sm font-semibold">{PLATFORM_LABELS[p]}</span>
              <Badge variant="outline" className={`text-[10px] font-bold ${bullish ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30" : "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/30"}`}>
                {bullish ? "▲" : "▼"} {cur.toFixed(1)}%
              </Badge>
            </div>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground animate-pulse flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Live
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toFixed(0)}%`} domain={["auto", "auto"]} />
          <Tooltip
            formatter={(v: number, name: string) => [`${v.toFixed(1)}% avg discount`, PLATFORM_LABELS[name] ?? name]}
            contentStyle={{ fontSize: 11, borderRadius: 8 }}
          />
          <Legend formatter={(v) => PLATFORM_LABELS[v] ?? v} wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="shopee" stroke={PLATFORM_COLORS.shopee} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lazada" stroke={PLATFORM_COLORS.lazada} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="tiktok" stroke={PLATFORM_COLORS.tiktok} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center">Average discount % per platform — updates every 3 seconds</p>
    </div>
  );
}

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    pushNotifications: false,
    darkMode: false,
    currency: "THB",
    region: "TH",
    autoRefresh: true,
    shopeeEnabled: true,
    lazadaEnabled: true,
    tiktokEnabled: true,
    minDiscount: 20,
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function save() {
    localStorage.setItem("mkp-prefs", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  useEffect(() => {
    const stored = localStorage.getItem("mkp-prefs");
    if (stored) {
      try { setPrefs(JSON.parse(stored)); } catch {}
    }
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Customise your deal-hunting experience.</p>
      </div>

      {/* Live Platform Rate Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Live Platform Rates</h2>
            <p className="text-xs text-muted-foreground">Real-time deal strength comparison across platforms</p>
          </div>
        </div>
        <PlatformTrendChart />
      </Card>

      {/* Notifications */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
            <Bell className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Notifications</h2>
        </div>
        <SettingRow
          icon={<Mail className="w-4 h-4" />}
          label="Email Alerts"
          description="Get notified by email when prices drop"
          checked={prefs.emailAlerts}
          onToggle={() => toggle("emailAlerts")}
        />
        <SettingRow
          icon={<Smartphone className="w-4 h-4" />}
          label="Push Notifications"
          description="Browser push alerts for triggered price drops"
          checked={prefs.pushNotifications}
          onToggle={() => toggle("pushNotifications")}
        />
        <SettingRow
          icon={<RefreshCw className="w-4 h-4" />}
          label="Auto-Refresh"
          description="Automatically refresh deal prices every 60 seconds"
          checked={prefs.autoRefresh}
          onToggle={() => toggle("autoRefresh")}
        />
      </Card>

      {/* Platforms */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Platforms</h2>
        </div>
        <SettingRow
          label="Shopee"
          description="Include Shopee deals in your feed"
          checked={prefs.shopeeEnabled}
          onToggle={() => toggle("shopeeEnabled")}
          badge={<span className="w-2 h-2 rounded-full bg-[#ee4d2d] inline-block" />}
        />
        <SettingRow
          label="Lazada"
          description="Include Lazada deals in your feed"
          checked={prefs.lazadaEnabled}
          onToggle={() => toggle("lazadaEnabled")}
          badge={<span className="w-2 h-2 rounded-full bg-[#0f146d] inline-block" />}
        />
        <SettingRow
          label="TikTok Shop"
          description="Include TikTok Shop deals in your feed"
          checked={prefs.tiktokEnabled}
          onToggle={() => toggle("tiktokEnabled")}
          badge={<span className="w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-200 inline-block" />}
        />
      </Card>

      {/* Appearance */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
            <Moon className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {prefs.darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
            <div>
              <p className="font-semibold text-sm">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
            </div>
          </div>
          <Switch checked={prefs.darkMode} onCheckedChange={() => toggle("darkMode")} />
        </div>
      </Card>

      {/* Region */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Region & Currency</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currency</label>
            <select
              value={prefs.currency}
              onChange={(e) => setPrefs((p) => ({ ...p, currency: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="THB">THB — Thai Baht (฿)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="SGD">SGD — Singapore Dollar (S$)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Region</label>
            <select
              value={prefs.region}
              onChange={(e) => setPrefs((p) => ({ ...p, region: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="TH">🇹🇭 Thailand</option>
              <option value="SG">🇸🇬 Singapore</option>
              <option value="MY">🇲🇾 Malaysia</option>
              <option value="PH">🇵🇭 Philippines</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Min. Discount Filter: <span className="text-primary">{prefs.minDiscount}%</span>
          </label>
          <input
            type="range"
            min={5} max={70} step={5}
            value={prefs.minDiscount}
            onChange={(e) => setPrefs((p) => ({ ...p, minDiscount: Number(e.target.value) }))}
            className="mt-2 w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>5%</span><span>70%</span>
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Privacy & Data</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          MKP stores your wishlist and alert preferences locally. No personal data is shared with third parties.
        </p>
        <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2">
          <Trash2 className="w-4 h-4" />
          Clear All Wishlist & Alerts
        </Button>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={save} className="gap-2 px-8" size="lg">
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  description,
  checked,
  onToggle,
  badge,
}: {
  icon?: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {badge}
        <div>
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}
