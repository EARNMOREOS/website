import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminWithdrawalsClient } from "./AdminWithdrawalsClient";

export default async function AdminWithdrawals() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminWithdrawalsClient />
    </div>
  );
}
