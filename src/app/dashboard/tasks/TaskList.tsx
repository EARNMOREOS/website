"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, PlayCircle, Zap, Target } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  rewardCoins: number;
  type: string;
  isCompleted: boolean;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        setError("Failed to load tasks");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId: string) => {
    setCompletingId(taskId);
    setError("");

    // Simulate taking some time to complete the task (e.g., watching a video)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (res.ok) {
        // Update local state to mark as completed
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
        );
      } else {
        const data = await res.json();
        setError(data.message || "Failed to complete task");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-text-muted">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  const watchTasks = tasks.filter((t) => t.type === "WATCH_VIDEO");
  const otherTasks = tasks.filter((t) => t.type !== "WATCH_VIDEO");

  return (
    <div className="space-y-8">
      {/* Category 1: Other Tasks */}
      {otherTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" /> General Tasks
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCompleting={completingId === task.id}
                onComplete={() => handleComplete(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category 2: Watch Videos */}
      {watchTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 mt-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-400" /> Watch Videos
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {watchTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCompleting={completingId === task.id}
                onComplete={() => handleComplete(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  isCompleting,
  onComplete,
}: {
  task: Task;
  isCompleting: boolean;
  onComplete: () => void;
}) {
  const Icon = task.type === "WATCH_VIDEO" ? PlayCircle : Target;

  return (
    <div
      className={`bg-card-dark border border-white/5 rounded-2xl overflow-hidden transition-all group ${
        task.isCompleted ? "opacity-60 grayscale" : "hover:border-brand-purple/50"
      }`}
    >
      <div className="h-32 bg-gray-800 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
        <Icon className="w-12 h-12 text-white/80 group-hover:scale-110 transition-all relative z-10" />
      </div>
      <div className="p-4 flex flex-col justify-between h-32">
        <div>
          <h4 className="font-bold mb-1 line-clamp-1">{task.title}</h4>
          <p className="text-xs text-text-muted line-clamp-1">{task.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="font-bold text-brand-gold">+{task.rewardCoins} Coins</div>
          {task.isCompleted ? (
            <span className="flex items-center gap-1 text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded">
              <CheckCircle2 className="w-3 h-3" /> Done
            </span>
          ) : (
            <button
              onClick={onComplete}
              disabled={isCompleting}
              className="px-3 py-1 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
            >
              {isCompleting ? "Doing..." : "Start"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
