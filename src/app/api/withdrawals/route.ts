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

    const { amountCoins, method, details } = await req.json();

    if (!amountCoins || amountCoins < 5000) {
      return NextResponse.json({ message: "Minimum withdrawal is 5000 coins" }, { status: 400 });
    }

    if (!method || !details) {
      return NextResponse.json({ message: "Method and payment details are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.coins < amountCoins) {
      return NextResponse.json({ message: "Insufficient coins" }, { status: 400 });
    }

    const amountCash = amountCoins / 100; // 100 coins = $1

    // Perform withdrawal in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Deduct coins
      await tx.user.update({
        where: { id: session.user.id },
        data: { coins: { decrement: amountCoins } }
      });

      // 2. Create Withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: session.user.id,
          amountCoins,
          amountCash,
          method,
          details,
          status: "PENDING"
        }
      });

      // 3. Create Transaction record
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          amount: amountCoins,
          type: "WITHDRAWAL",
          status: "PENDING",
          description: `Withdrawal to ${method}`
        }
      });
    });

    return NextResponse.json({ message: "Withdrawal requested successfully" }, { status: 200 });

  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
