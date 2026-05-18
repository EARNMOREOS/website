"use client";

import { useState } from "react";
import { ArrowUpRight, Wallet as WalletIcon, CheckCircle2 } from "lucide-react";

export function WithdrawalForm({ userCoins }: { userCoins: number }) {
  const [method, setMethod] = useState("PayPal");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const usdValue = (userCoins / 100).toFixed(2);
  const canWithdraw = userCoins >= 5000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWithdraw) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCoins: userCoins, // Withdraw all for simplicity
          method,
          details
        }),
      });

      if (res.ok) {
        setSuccess(true);
        // Page reload will happen automatically or user can refresh to see new balance
        setTimeout(() => window.location.reload(), 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to request withdrawal");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-card-dark to-background-dark border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <p className="text-text-muted font-medium mb-2">Available for Withdrawal</p>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-5xl font-extrabold text-white">{userCoins.toLocaleString()}</span>
            <span className="text-brand-gold font-bold text-xl mb-1">Coins</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-green-400">≈ ${usdValue} USD</span>
            <span className="text-text-muted">|</span>
            <span className={canWithdraw ? "text-green-400" : "text-red-400"}>
              Min. withdrawal: 5,000 Coins ($50)
            </span>
          </div>
        </div>
      </div>

      {/* Withdrawal Action */}
      <div className="bg-card-dark border border-white/5 rounded-3xl p-6">
        <h3 className="text-xl font-bold mb-4">Request Payout</h3>

        {success ? (
          <div className="p-8 text-center bg-green-500/10 border border-green-500/20 rounded-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-green-400 mb-2">Withdrawal Requested!</h4>
            <p className="text-green-400/80">Your request is pending admin approval. Reloading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Select Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "PayPal", name: "PayPal", icon: WalletIcon, min: "$50", active: true },
                  { id: "Crypto", name: "Crypto", icon: ArrowUpRight, min: "$20", active: false, badge: "Coming Soon" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!m.active}
                    onClick={() => setMethod(m.id)}
                    className={`p-5 text-left rounded-2xl border transition-all ${
                      !m.active ? 'bg-card-dark border-white/5 opacity-60 cursor-not-allowed' :
                      method === m.id ? 'bg-brand-purple/20 border-brand-purple' : 'bg-card-dark border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === m.id ? 'bg-brand-purple text-white' : 'bg-white/5 text-text-muted'}`}>
                        <m.icon className="w-5 h-5" />
                      </div>
                      {m.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-purple/20 text-brand-purple px-2 py-1 rounded-full">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-lg mb-1">{m.name}</h4>
                    <p className="text-xs text-text-muted">Min: {m.min}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Payment Details ({method === 'PayPal' ? 'Email Address' : 'Wallet Address'})
              </label>
              <input 
                type={method === 'PayPal' ? 'email' : 'text'}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                placeholder={method === 'PayPal' ? 'you@example.com' : '0x...'}
                className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !canWithdraw}
              className="w-full bg-brand-gold hover:bg-brand-gold-dark text-background-dark disabled:opacity-50 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
              {loading ? "Processing..." : canWithdraw ? "Withdraw All Funds" : "Insufficient Balance"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
