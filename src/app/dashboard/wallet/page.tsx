import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, Wallet as WalletIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { WithdrawalForm } from "./WithdrawalForm";

export default async function WalletPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const usdValue = (user.coins / 100).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
        <p className="text-text-muted">Manage your earnings and withdraw to your favorite payment method.</p>
      </div>

      {/* Withdrawal Form */}
      <WithdrawalForm userCoins={user.coins} />

      {/* Transaction History */}
      <div className="bg-card-dark border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold">Transaction History</h3>
        </div>
        
        {user.transactions.length > 0 ? (
          <div className="divide-y divide-white/5">
            {user.transactions.map((txn, i) => {
              const isIn = txn.type === 'EARN_TASK' || txn.type === 'EARN_REFERRAL' || txn.type === 'BONUS';
              return (
                <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isIn ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white'}`}>
                      {isIn ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold">{txn.description || txn.type}</p>
                      <div className="flex items-center gap-2 text-xs mt-1 text-text-muted">
                        <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-mono">{txn.id.split('-')[0] || txn.id.substring(0,8)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pl-16 sm:pl-0">
                    <div className={`font-bold text-lg ${isIn ? 'text-green-400' : 'text-white'}`}>
                      {isIn ? '+' : '-'}{txn.amount}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${txn.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {txn.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {txn.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <WalletIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No transactions found.</p>
            <p className="text-sm mt-1">Complete tasks to start earning coins!</p>
          </div>
        )}
      </div>
    </div>
  );
}
