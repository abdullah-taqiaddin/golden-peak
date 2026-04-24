import { redirect } from "next/navigation";
import { UserStatus } from "@prisma/client";

import { DashboardClient } from "@/components/DashboardClient";
import { getServerSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { formatProgressRows } from "@/lib/progress";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const session = await getServerSession();

  if (!session || session.role !== "USER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      progressItems: {
        orderBy: { entryDate: "asc" },
        select: {
          entryDate: true,
          revenue: true
        }
      }
    }
  });

  if (!user || user.status !== UserStatus.APPROVED) {
    redirect("/login");
  }

  return (
    <DashboardClient
      firstName={user.firstName}
      email={user.email}
      experienceLevel={user.experienceLevel}
      initialProgress={formatProgressRows(user.progressItems)}
      courseUrl={env.COURSE_IFRAME_URL}
    />
  );
}
