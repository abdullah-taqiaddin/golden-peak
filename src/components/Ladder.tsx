"use client";

import { ProgressPoint } from "@/components/ProgressChart";

function calculateStreak(points: ProgressPoint[]) {
  const sorted = [...points].sort((a, b) => a.entryDate.localeCompare(b.entryDate));
  let streak = 0;

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const current = new Date(`${sorted[i].entryDate}T00:00:00Z`);
    const previous = sorted[i - 1] ? new Date(`${sorted[i - 1].entryDate}T00:00:00Z`) : null;

    if (!previous) {
      streak += 1;
      break;
    }

    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);

    if (diffDays === 1) {
      streak += 1;
      continue;
    }

    streak += 1;
    break;
  }

  return streak;
}

export function Ladder({ progress }: { progress: ProgressPoint[] }) {
  const streak = progress.length ? calculateStreak(progress) : 0;
  const steps = 7;

  return (
    <div className="panel p-4">
      <h3 className="mb-3 font-semibold text-brand-amber">سلم الالتزام</h3>
      <p className="mb-4 text-sm text-slate-300">الاستمرارية الحالية: {streak} يوم</p>
      <div className="space-y-2">
        {Array.from({ length: steps }).map((_, index) => {
          const level = index + 1;
          const reached = streak >= level;
          return (
            <div
              key={level}
              className={`rounded-md border px-3 py-2 text-sm ${
                reached
                  ? "border-brand-gold/80 bg-brand-gold/20 text-brand-amber"
                  : "border-brand-silver/25 bg-brand-smoke/65 text-slate-400"
              }`}
            >
              خطوة الالتزام {level}
            </div>
          );
        })}
      </div>
    </div>
  );
}
