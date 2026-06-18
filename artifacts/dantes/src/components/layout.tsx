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
    <div className="flex flex-col h-full bg-[#040c1a] border-r border-[#0d1b35]">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[#0d1b35] shrink-0">
        <img src="/logo.png" alt="Dantès" className="w-7 h-7 object-contain mr-3 shrink-0" />
        <div className="flex flex-col leading-none">
          <span className="font-serif font-black text-white tracking-[0.15em] text-sm">DANTÈS</span>
          <span className="text-[8px] font-mono text-[#D4AF37]/40 tracking-[0.3em]">BLOOM SOCIETY</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        {sections.map(section => {
          const items = nav.filter(n => n.section === section);
          return (
            <div key={section} className="mb-6">
              <p className="text-[8px] font-mono text-[#2a3a50] tracking-[0.35em] px-2 mb-2">{section}</p>
              <div className="space-y-0.5">
                {items.map(({ name, path, icon: Icon }) => {
                  const active = location === path;
                  return (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 text-xs font-mono rounded-sm transition-all ${
                        active
                          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                          : "text-[#3a5570] hover:text-white hover:bg-[#0a1628]"
                      }`}
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
      <div className="p-3 border-t border-[#0d1b35] shrink-0 space-y-2">
        {user && (
          <div className="px-3 py-2 bg-[#0a1628] rounded-sm">
            <p className="text-[8px] font-mono text-[#D4AF37]/50 tracking-widest mb-0.5">OPERATOR</p>
            <p className="text-[10px] font-mono text-[#3a5570] truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 text-xs font-mono w-full rounded-sm text-[#3a5570] hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Terminate Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030810] flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-12 bg-[#040c1a] border-b border-[#0d1b35] shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Dantès" className="w-6 h-6 object-contain" />
          <span className="font-serif font-bold text-white text-sm tracking-widest">DANTÈS</span>
        </div>
        <button onClick={() => setMobileOpen(o => !o)} className="text-[#3a5570] hover:text-white transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full">{sidebar}</div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col h-screen sticky top-0">
        {sidebar}
      </aside>

      <main className="flex-1 overflow-auto bg-[#030810] p-5 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
