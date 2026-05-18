import Link from "next/link";
import { ArrowRight, PlayCircle, Share2, Target, Trophy, Wallet } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Calculate today's earnings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysEarnings = user.transactions
    .filter(t => t.type === 'EARN_TASK' || t.type === 'EARN_REFERRAL' || t.type === 'BONUS')
    .filter(t => t.createdAt >= today)
    .reduce((sum, t) => sum + t.amount, 0);

  const usdValue = (user.coins / 100).toFixed(2); // Assuming 100 coins = $1

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Welcome & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-brand-purple/20 to-card-dark border border-brand-purple/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-purple rounded-full blur-[80px] opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user.name || 'User'}! 👋</h2>
            <p className="text-text-muted mb-6">Complete tasks daily to earn bonus multipliers!</p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-text-muted font-medium mb-1">Current Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{user.coins.toLocaleString()}</span>
                  <span className="text-brand-gold font-bold">Coins</span>
                </div>
                <p className="text-xs text-green-400 mt-1">≈ ${usdValue} USD</p>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div>
                <p className="text-sm text-text-muted font-medium mb-1">Today&apos;s Earnings</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">+{todaysEarnings}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <Link href="/dashboard/wallet" className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Withdraw
              </Link>
              <Link href="/dashboard/tasks" className="bg-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors border border-white/5">
                Earn More
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-card-dark border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Daily Goal</h3>
            </div>
            <p className="text-text-muted text-sm mb-4">Earn 500 coins today to unlock a mystery box.</p>
            
            <div className="space-y-2 mb-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{todaysEarnings} / 500 Coins</span>
                <span className="text-brand-gold">{Math.min(Math.round((todaysEarnings / 500) * 100), 100)}%</span>
              </div>
              <div className="w-full h-3 bg-background-dark rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-dark rounded-full relative" style={{ width: `${Math.min((todaysEarnings / 500) * 100, 100)}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-xl font-bold mt-8 mb-4">Ways to Earn</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Watch Videos", desc: "Up to 50 coins/video", icon: PlayCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
          { title: "Complete Surveys", desc: "High payouts", icon: Target, color: "text-brand-purple", bg: "bg-brand-purple/10" },
          { title: "Invite Friends", desc: "Earn 20% of their income", icon: Share2, color: "text-brand-gold", bg: "bg-brand-gold/10" },
          { title: "App Installs", desc: "Quick rewards", icon: ArrowRight, color: "text-green-400", bg: "bg-green-400/10" },
        ].map((action, i) => (
          <Link href="/dashboard/tasks" key={i} className="bg-card-dark border border-white/5 hover:border-white/20 rounded-2xl p-5 transition-all group hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold mb-1">{action.title}</h4>
            <p className="text-xs text-text-muted">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <h3 className="text-xl font-bold mt-8 mb-4">Recent Activity</h3>
      <div className="bg-card-dark border border-white/5 rounded-3xl overflow-hidden">
        {user.transactions.length > 0 ? (
          <div className="divide-y divide-white/5">
            {user.transactions.map((activity, i) => {
              const isEarn = activity.type === 'EARN_TASK' || activity.type === 'EARN_REFERRAL' || activity.type === 'BONUS';
              return (
                <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEarn ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {isEarn ? <Target className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base">{activity.description || activity.type}</p>
                      <p className="text-xs text-text-muted">{new Date(activity.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${isEarn ? 'text-green-400' : 'text-white'}`}>
                    {isEarn ? '+' : '-'}{activity.amount} <span className="text-xs font-normal text-text-muted">Coins</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-text-muted">
            No recent activity. Start completing tasks to earn coins!
          </div>
        )}
        <div className="p-4 border-t border-white/5 text-center">
          <Link href="/dashboard/wallet" className="text-sm text-brand-purple hover:text-brand-purple-dark font-medium">
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}
