import { NextResponse } from "next-auth/next";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const withdrawalId = id;
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED", "PAID"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId }
    });

    if (!withdrawal) {
      return NextResponse.json({ message: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "PENDING" && status === "REJECTED") {
        return NextResponse.json({ message: "Only PENDING withdrawals can be rejected" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update Withdrawal status
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status }
      });

      // 2. Find the associated transaction (based on time and amount, or better, we could have linked them. Let's find the most recent pending withdrawal transaction for this user)
      const transaction = await tx.transaction.findFirst({
        where: {
          userId: withdrawal.userId,
          type: "WITHDRAWAL",
          status: "PENDING",
          amount: withdrawal.amountCoins
        },
        orderBy: { createdAt: 'desc' }
      });

      if (status === "REJECTED") {
        // Refund coins
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: { coins: { increment: withdrawal.amountCoins } }
        });

        if (transaction) {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: { status: "FAILED" }
          });
        }
      } else if (status === "PAID" || status === "APPROVED") {
        if (transaction && status === "PAID") {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: { status: "COMPLETED" }
          });
        }
      }
    });

    return NextResponse.json({ message: `Withdrawal marked as ${status}` }, { status: 200 });

  } catch (error) {
    console.error("Failed to update withdrawal:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
