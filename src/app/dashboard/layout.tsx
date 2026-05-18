import { Navigation } from "@/components/Navigation";
import { Bell, UserCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background-dark text-text-main">
      <Navigation />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-card-dark/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center font-bold text-background-dark text-xs">
              C
            </div>
            <span className="font-bold text-lg">Earn More</span>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold border border-brand-gold/20">
              <span className="text-xl leading-none">🪙</span> 1,250
            </div>
            <button className="text-text-muted hover:text-white transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-dark"></span>
            </button>
            <button className="text-text-muted hover:text-white transition-colors">
              <UserCircle className="w-7 h-7" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
