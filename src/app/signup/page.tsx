"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCodeFromUrl = searchParams.get("ref");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (refCodeFromUrl) {
      setReferralCode(refCodeFromUrl);
    }
  }, [refCodeFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          referralCode: referralCode || undefined,
        }),
      });

      if (res.ok) {
        router.push("/login?signupSuccess=1");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card-dark p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10">
      <div className="text-center mb-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center font-bold text-background-dark text-xl mb-4">
          C
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
        <p className="text-text-muted text-sm">Join thousands of users earning daily rewards.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="referral">Referral Code (Optional)</label>
          <input 
            type="text" 
            id="referral"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
            placeholder="Enter code"
            disabled={loading}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-brand-gold hover:bg-brand-gold-dark disabled:opacity-50 text-background-dark font-bold py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] mt-4"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="h-px bg-white/10 flex-1"></div>
        <span className="text-xs text-text-muted uppercase tracking-wider">Or continue with</span>
        <div className="h-px bg-white/10 flex-1"></div>
      </div>

      <button className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Google
      </button>

      <p className="mt-8 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-purple hover:text-brand-purple-dark font-semibold transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-background-dark text-text-main items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      
      <Suspense fallback={<div className="w-full max-w-md bg-card-dark p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10 text-center text-white">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
