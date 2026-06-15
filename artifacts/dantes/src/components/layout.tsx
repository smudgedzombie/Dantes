import { useClerk, useUser } from "@clerk/react";
import { Link, useLocation } from "wouter";
import { Activity, CreditCard, DollarSign, LogOut, Menu, PieChart } from "lucide-react";

const nav = [
  { name: "Terminal", path: "/dashboard", icon: Activity },
  { name: "Ledger", path: "/transactions", icon: CreditCard },
  { name: "Accounts", path: "/accounts", icon: DollarSign },
  { name: "Allocations", path: "/budgets", icon: PieChart },
  { name: "Taxonomy", path: "/categories", icon: Menu },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Dantès" className="h-6 w-6 mr-3" />
          <span className="font-serif font-bold text-white tracking-wide">Dantès</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {nav.map(({ name, path, icon: Icon }) => {
            const active = location === path;
            return (
              <Link
                key={path}
                href={path}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  active
                    ? "bg-secondary text-[#D4AF37] border-l-2 border-[#D4AF37]"
                    : "text-muted-foreground hover:text-white hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          {user && (
            <div className="px-3 py-2">
              <p className="text-xs font-mono text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium w-full rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
