import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function UsersPage() {
  const session = await getServerSession();

  if (!session || session.role !== "USER") {
    redirect("/login");
  }

  redirect("/dashboard");
}
