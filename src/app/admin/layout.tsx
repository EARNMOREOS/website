"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Banknote, ShieldAlert, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Withdrawals", href: "/admin/withdrawals", icon: Banknote },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Fraud Flags", href: "/admin/fraud", icon: ShieldAlert },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-[#111111] border-r border-white/5 sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            A
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block">Earn More Admin</span>
            <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Superuser</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  isActive
                    ? "bg-red-500/10 text-red-500"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-red-500" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full rounded-lg hover:bg-white/5 text-sm font-medium">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 bg-[#111111]/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Status: </span>
              <span className="text-green-500 font-bold flex items-center gap-2 inline-flex"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Systems Operational</span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
