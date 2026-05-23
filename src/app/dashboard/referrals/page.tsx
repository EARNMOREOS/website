import { Gift, Share2, TrendingUp, Users } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CopyLinkButton } from "./CopyLinkButton";

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      referrals: {
        orderBy: { createdAt: 'desc' }
      },
      transactions: {
        where: { type: 'EARN_REFERRAL' }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Use the NEXT_PUBLIC_SITE_URL or fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const referralLink = `${baseUrl}/signup?ref=${user.referralCode}`;

  const totalEarnedFromReferrals = user.transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Invite Friends & Earn</h1>
        <p className="text-text-muted">Earn bonuses when your friends sign up and earn!</p>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-brand-purple/20 to-card-dark border border-brand-purple/20 rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Share2 className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Your Unique Referral Link</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-background-dark p-2 rounded-xl border border-white/10 mb-6">
            <div className="flex-1 px-4 py-2 text-white font-mono truncate w-full sm:w-auto">
              {referralLink}
            </div>
            <CopyLinkButton link={referralLink} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Total Invites", value: user.referrals.length.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
          { title: "Total Earned", value: `${totalEarnedFromReferrals.toLocaleString()} Coins`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
          { title: "Active Referrals", value: user.referrals.length.toString(), icon: Gift, color: "text-brand-gold", bg: "bg-brand-gold/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-card-dark border border-white/5 rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-text-muted text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Referral History */}
      <div className="bg-card-dark border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold">Your Referrals</h3>
        </div>
        
        {user.referrals.length > 0 ? (
          <div className="divide-y divide-white/5">
            {user.referrals.map((ref, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-white uppercase">
                    {(ref.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{ref.name || 'User'}</p>
                    <p className="text-xs text-text-muted">Joined {new Date(ref.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-text-muted">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>You haven&apos;t invited anyone yet.</p>
            <p className="text-sm mt-1">Share your link to start earning!</p>
          </div>
        )}
      </div>
    </div>
  );
}
