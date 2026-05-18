"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, CheckSquare, Users, LogOut, Gift } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Referrals", href: "/dashboard/referrals", icon: Users },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-card-dark border-r border-white/5 sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center font-bold text-background-dark">
            C
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Earn More</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-brand-purple/10 text-brand-purple"
                    : "text-text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-brand-purple" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-gradient-to-r from-brand-purple/20 to-brand-purple/5 border border-brand-purple/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-brand-gold mb-2">
              <Gift className="w-5 h-5" />
              <span className="font-bold text-sm">Daily Bonus</span>
            </div>
            <p className="text-xs text-text-muted mb-3">Claim your daily 50 coins!</p>
            <button className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-bold py-2 rounded-lg transition-all">
              Claim Now
            </button>
          </div>
          
          <button className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-red-400 transition-colors w-full rounded-xl hover:bg-white/5">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card-dark/95 backdrop-blur-md border-t border-white/5 z-50 px-6 py-3 flex justify-between items-center pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-brand-purple" : "text-text-muted"
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? "bg-brand-purple/10" : ""}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
