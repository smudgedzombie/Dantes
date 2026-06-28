import { useClerk, useUser } from "@clerk/react";
import { Link, useLocation } from "wouter";
import { Activity, CreditCard, DollarSign, LogOut, Users, Bot, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { name: "Command", path: "/command", icon: LayoutDashboard, section: "DANTÈS PLATFORM" },
  { name: "Grahams", path: "/grahams", icon: Bot, section: "DANTÈS PLATFORM" },
  { name: "Clients", path: "/clients", icon: Users, section: "DANTÈS PLATFORM" },
  { name: "Terminal", path: "/dashboard", icon: Activity, section: "FINANCIAL MODULE" },
  { name: "Ledger", path: "/transactions", icon: CreditCard, section: "FINANCIAL MODULE" },
  { name: "Accounts", path: "/accounts", icon: DollarSign, section: "FINANCIAL MODULE" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = ["DANTÈS PLATFORM", "FINANCIAL MODULE"];

  const sidebar = (
    <div className="flex flex-col h-full border-r" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", borderColor: "rgba(168,85,247,0.15)" }}>
      {/* Logo */}
      <div className="h-14 flex items-center px-5 shrink-0 border-b" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
        <img src="/logo.png" alt="Dantès" className="w-7 h-7 object-contain mr-3 shrink-0" />
        <div className="flex flex-col leading-none">
          <span className="font-serif font-black tracking-[0.15em] text-sm" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DANTÈS</span>
          <span className="text-[8px] font-mono tracking-[0.3em]" style={{ color: "#9898b8" }}>BLOOM SOCIETY</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        {sections.map(section => {
          const items = nav.filter(n => n.section === section);
          return (
            <div key={section} className="mb-6">
              <p className="text-[8px] font-mono tracking-[0.35em] px-2 mb-2" style={{ color: "#c4b5e0" }}>{section}</p>
              <div className="space-y-0.5">
                {items.map(({ name, path, icon: Icon }) => {
                  const active = location === path;
                  return (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-mono rounded-lg transition-all"
                      style={active ? {
                        background: "rgba(168,85,247,0.12)",
                        color: "#a855f7",
                        borderLeft: "2px solid #a855f7",
                      } : {
                        color: "#5a587a",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 shrink-0 space-y-2 border-t" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
        {user && (
          <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(168,85,247,0.06)" }}>
            <p className="text-[8px] font-mono tracking-widest mb-0.5" style={{ color: "#a855f7" }}>OPERATOR</p>
            <p className="text-[10px] font-mono truncate" style={{ color: "#5a587a" }}>{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 text-xs font-mono w-full rounded-lg transition-all hover:bg-red-50"
          style={{ color: "#9898b8" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Terminate Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "#f5f0ff" }}>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-12 shrink-0 border-b" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(168,85,247,0.15)" }}>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Dantès" className="w-6 h-6 object-contain" />
          <span className="font-serif font-bold text-sm tracking-widest" style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DANTÈS</span>
        </div>
        <button onClick={() => setMobileOpen(o => !o)} style={{ color: "#5a587a" }} className="hover:text-[#a855f7] transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full">{sidebar}</div>
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col h-screen sticky top-0">
        {sidebar}
      </aside>

      <main className="flex-1 overflow-auto p-5 md:p-8 min-h-screen" style={{ background: "#f5f0ff" }}>
        {children}
      </main>
    </div>
  );
}
