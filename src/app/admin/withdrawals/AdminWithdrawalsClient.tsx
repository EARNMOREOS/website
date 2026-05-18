"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download } from "lucide-react";

type Withdrawal = {
  id: string;
  amountCoins: number;
  amountCash: number;
  method: string;
  details: string;
  status: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    coins: number;
  };
};

export function AdminWithdrawalsClient() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/admin/withdrawals");
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      } else {
        setError("Failed to fetch withdrawals");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      } else {
        const data = await res.json();
        alert(data.message || "Update failed");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-text-muted">Loading withdrawals...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Manage Withdrawals</h2>
          <p className="text-gray-400 text-sm">Review, approve, or reject user payout requests.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by email or transaction ID..." 
            className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 appearance-none min-w-[120px]">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Paid</option>
            <option>Rejected</option>
          </select>
          <button className="flex items-center justify-center w-11 h-11 bg-[#111111] border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#1a1a1a] text-gray-400 border-b border-white/5 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Request ID</th>
                <th className="p-4 font-bold">User Details</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Payout Method</th>
                <th className="p-4 font-bold">Date Requested</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">No withdrawals found.</td>
                </tr>
              ) : (
                withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono text-gray-400 text-xs">{req.id.split('-')[0]}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{req.user.email || req.user.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">Balance: {req.user.coins} Coins</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-green-400">${req.amountCash.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{req.amountCoins} Coins</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      <p>{req.method}</p>
                      <p className="text-[10px] text-text-muted">{req.details}</p>
                    </td>
                    <td className="p-4 text-gray-400">{new Date(req.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        req.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        req.status === 'PAID' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(req.id, "APPROVED")}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 rounded font-bold text-xs transition-all shadow-sm">
                            Approve
                          </button>
                          <button 
                            onClick={() => updateStatus(req.id, "REJECTED")}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded font-bold text-xs transition-all shadow-sm">
                            Reject
                          </button>
                        </div>
                      ) : req.status === 'APPROVED' ? (
                        <button 
                          onClick={() => updateStatus(req.id, "PAID")}
                          className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/30 rounded font-bold text-xs transition-all shadow-sm">
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-text-muted">Action taken</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
