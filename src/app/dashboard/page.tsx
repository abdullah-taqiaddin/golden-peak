import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/DashboardClient";
import { getServerSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { ExperienceLevelValue, EXPERIENCE_LEVELS } from "@/lib/experience-level";
import { listUserProgress } from "@/lib/firebase-store";

function toExperienceLevel(value: string | undefined): ExperienceLevelValue {
  if (value && EXPERIENCE_LEVELS.includes(value as ExperienceLevelValue)) {
    return value as ExperienceLevelValue;
  }

  return "BEGINNER";
}

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session || session.role !== "USER") {
    redirect("/login");
  }

  const firstName = session.firstName ?? "المتداول";
  const email = session.email ?? "";
  const experienceLevel = toExperienceLevel(session.experienceLevel);

  let progress: Array<{ entryDate: string; revenue: number }> = [];

  try {
    progress = await listUserProgress(session.userId);
  } catch {
    redirect("/login");
  }

  return (
    <DashboardClient
      firstName={firstName}
      email={email}
      experienceLevel={experienceLevel}
      initialProgress={progress}
      courseUrl={env.COURSE_IFRAME_URL}
    />
  );
}
