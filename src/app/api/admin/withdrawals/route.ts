import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            coins: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(withdrawals);

  } catch (error) {
    console.error("Failed to fetch withdrawals:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
