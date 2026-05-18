import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-text-main relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center font-bold text-background-dark">
            C
          </div>
          <span className="font-bold text-xl tracking-tight">Earn More</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-brand-gold transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-brand-purple hover:bg-brand-purple-dark text-white px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-semibold tracking-wide">
          ✨ The Ultimate Rewards Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Earn Rewards <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-gold-dark">
            Every Single Day
          </span>
        </h1>
        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl">
          Complete tasks, watch videos, and invite friends to earn coins. Withdraw your earnings easily through multiple payment methods.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="flex-1 sm:flex-none text-center bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-brand-gold-dark hover:to-brand-gold text-background-dark font-bold text-lg px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-105"
          >
            Start Earning Now
          </Link>
          <Link
            href="/#how-it-works"
            className="flex-1 sm:flex-none text-center bg-card-dark hover:bg-card-dark/80 border border-white/5 font-semibold text-lg px-8 py-4 rounded-full transition-all hover:scale-105"
          >
            How it Works
          </Link>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-white/10 pt-10">
          {[
            { label: "Active Users", value: "50K+" },
            { label: "Tasks Completed", value: "1M+" },
            { label: "Total Paid Out", value: "$250K" },
            { label: "Supported Methods", value: "10+" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-sm text-text-muted font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
