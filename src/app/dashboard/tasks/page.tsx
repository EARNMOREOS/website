import { CheckCircle2, Star } from "lucide-react";
import TaskList from "./TaskList";

export default function TasksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Earn Coins</h1>
        <p className="text-text-muted">Complete tasks, watch videos, and install apps to earn rewards.</p>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-r from-brand-gold-dark/20 to-card-dark border border-brand-gold/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(251,191,36,0.1)] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-brand-gold/10 blur-[50px] rounded-full"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center shadow-lg">
            <Star className="w-8 h-8 text-background-dark fill-background-dark" />
          </div>
          <div>
            <div className="inline-block px-3 py-1 bg-brand-gold/20 text-brand-gold text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
              Daily Challenge
            </div>
            <h2 className="text-2xl font-bold text-white">Complete 5 Tasks Today</h2>
            <p className="text-text-muted mt-1">Earn a massive 500 Coin bonus!</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3 w-full md:w-auto relative z-10">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step <= 2 
                  ? 'bg-brand-gold text-background-dark' 
                  : 'bg-white/10 text-white/50 border border-white/20'
              }`}>
                {step <= 2 ? <CheckCircle2 className="w-5 h-5" /> : step}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-text-muted">2/5 Completed</span>
        </div>
      </div>

      {/* Task Categories Grid */}
      <TaskList />

    </div>
  );
}
