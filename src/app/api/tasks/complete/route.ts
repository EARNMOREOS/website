import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }

    // Check if task exists and is active
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task || !task.isActive) {
      return NextResponse.json({ message: "Task not found or inactive" }, { status: 404 });
    }

    // Check if user already completed it
    const existingCompletion = await prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: session.user.id,
          taskId: task.id
        }
      }
    });

    if (existingCompletion) {
      return NextResponse.json({ message: "Task already completed" }, { status: 400 });
    }

    // Perform completion in a transaction
    await prisma.$transaction([
      // 1. Record task completion
      prisma.userTask.create({
        data: {
          userId: session.user.id,
          taskId: task.id
        }
      }),
      // 2. Add coins to user
      prisma.user.update({
        where: { id: session.user.id },
        data: { coins: { increment: task.rewardCoins } }
      }),
      // 3. Create transaction record
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount: task.rewardCoins,
          type: "EARN_TASK",
          status: "COMPLETED",
          description: `Completed task: ${task.title}`
        }
      })
    ]);

    return NextResponse.json({ 
      message: "Task completed successfully", 
      rewardCoins: task.rewardCoins 
    }, { status: 200 });

  } catch (error) {
    console.error("Task completion error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
