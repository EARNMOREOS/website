import { ArrowDown, ArrowUp, Users, Banknote, Activity, Target } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch real stats
  const totalUsers = await prisma.user.count({ where: { role: "USER" } });
  const tasksCompleted = await prisma.userTask.count();

  const pendingWithdrawalsAggregate = await prisma.withdrawal.aggregate({
    where: { status: "PENDING" },
    _sum: { amountCash: true }
  });

  const pendingAmount = pendingWithdrawalsAggregate._sum.amountCash || 0;

  const recentWithdrawals = await prisma.withdrawal.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true, name: true } }
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Users", value: totalUsers.toLocaleString(), change: "+New", up: true, icon: Users },
          { title: "Pending Payouts", value: `$${pendingAmount.toFixed(2)}`, change: "Review", up: false, icon: Banknote },
          { title: "Tasks Completed", value: tasksCompleted.toLocaleString(), change: "Active", up: true, icon: Target },
          { title: "Fraud Flags", value: "0", change: "Clean", up: true, icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.up
                  ? "bg-green-500/10 text-green-500"
                  : "bg-yellow-500/10 text-yellow-500"
                }`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Charts / Data Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Recent Withdrawals */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">Recent Withdrawal Requests</h3>
            <Link href="/admin/withdrawals" className="text-sm text-red-500 hover:text-red-400 font-medium">View All</Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="text-gray-400 border-b border-white/5 text-sm">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {recentWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-muted">No recent requests</td>
                  </tr>
                ) : (
                  <>
                    {recentWithdrawals.map((req: any, i: number) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{req.user.email || req.user.name}</td>
                        <td className="p-4 font-mono text-green-400">${req.amountCash.toFixed(2)}</td>
                        <td className="p-4 text-gray-300">{req.method}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                              req.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-400' :
                                req.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
                                  'bg-red-500/10 text-red-500'
                            }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-[#111111] border border-white/5 rounded-xl">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2">
              System Alerts
              <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30">OK</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-3 border-l-2 border-green-500 pl-3">
              <div>
                <p className="text-sm font-bold text-white mb-1">System Healthy</p>
                <p className="text-xs text-gray-400">All services are running normally.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
