import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if tasks exist, if not, seed some defaults (development convenience)
    const taskCount = await prisma.task.count();
    if (taskCount === 0) {
      await prisma.task.createMany({
        data: [
          { title: "Watch Short Ad 1", description: "Watch a 30s video to earn coins", rewardCoins: 25, type: "WATCH_VIDEO" },
          { title: "Watch Short Ad 2", description: "Watch a 30s video to earn coins", rewardCoins: 25, type: "WATCH_VIDEO" },
          { title: "Visit Sponsor Site", description: "Visit and browse for 1 minute", rewardCoins: 15, type: "VISIT_SITE" },
          { title: "Daily Check-in", description: "Claim your daily reward", rewardCoins: 50, type: "DAILY_CHECKIN" },
        ]
      });
    }

    // Fetch all active tasks
    const activeTasks = await prisma.task.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    // Fetch user's completed tasks
    const completedTasks = await prisma.userTask.findMany({
      where: { userId: session.user.id },
      select: { taskId: true }
    });

    const completedTaskIds = completedTasks.map(t => t.taskId);

    // Combine data to indicate which are completed
    const tasksWithStatus = activeTasks.map(task => ({
      ...task,
      isCompleted: completedTaskIds.includes(task.id)
    }));

    return NextResponse.json(tasksWithStatus);

  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
