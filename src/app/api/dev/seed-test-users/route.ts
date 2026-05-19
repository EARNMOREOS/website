import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (process.env.NODE_ENV === "production" && !isLocalhost) {
    return NextResponse.json({ message: "Not allowed in production" }, { status: 404 });
  }

  const email = "example@gmail.com";
  const password = "password123";
  const referralCode = "EXAMPLE";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        referralCode,
      },
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: "Example Admin",
        email,
        password: hashedPassword,
        role: "ADMIN",
        referralCode,
      },
    });
  }

  return NextResponse.json({ message: "Test user seeded" }, { status: 200 });
}
