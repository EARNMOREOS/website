"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seedPromiseRef = useRef<Promise<void> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const signupSuccess = searchParams.get("signupSuccess") === "1";

  async function seedTestUser() {
    setSeeding(true);
    const promise = (async () => {
      try {
        const res = await fetch("/api/dev/seed-test-users");
        if (res.ok) {
          setSeeded(true);
        }
      } catch (error) {
        // Ignore seeding failures on local test environments.
      } finally {
        setSeeding(false);
      }
    })();

    seedPromiseRef.current = promise;
    await promise;
  }

  useEffect(() => {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    if (!isLocalhost) {
      return;
    }

    seedTestUser();
  }, []);

  async function ensureSeeded() {
    if (seeded) {
      return;
    }

    if (seedPromiseRef.current) {
      await seedPromiseRef.current;
      return;
    }

    await seedTestUser();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!seeded) {
        await ensureSeeded();
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-dark text-text-main items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-card-dark p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center font-bold text-background-dark text-xl mb-4">
            C
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm">Log in to your account to continue earning.</p>
        </div>

        {signupSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-500 text-sm text-center">
            Registration successful. Please log in.
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-text-muted" htmlFor="password">Password</label>
              <Link href="#" className="text-xs text-brand-purple hover:text-brand-purple-dark transition-colors">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || seeding}
            className="w-full bg-brand-purple hover:bg-brand-purple-dark disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] mt-2"
          >
            {seeding ? "Preparing account..." : loading ? "Logging in..." : "Log In"}
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
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-background-dark text-text-main items-center justify-center p-4">
        <p className="text-text-muted">Loading...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
