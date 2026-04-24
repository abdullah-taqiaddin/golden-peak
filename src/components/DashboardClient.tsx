"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DailyProgressForm } from "@/components/DailyProgressForm";
import { Ladder } from "@/components/Ladder";
import { MetalCharts } from "@/components/MetalCharts";
import { ProgressChart, ProgressPoint } from "@/components/ProgressChart";
import { ProgressHistory } from "@/components/ProgressHistory";
import { EXPERIENCE_LEVEL_LABELS, ExperienceLevelValue } from "@/lib/experience-level";

const tabs = [
  { id: "market", label: "السوق" },
  { id: "progress", label: "المتابعة" },
  { id: "course", label: "الدورة" }
] as const;
type TabName = (typeof tabs)[number]["id"];

type DashboardClientProps = {
  firstName: string;
  email: string;
  experienceLevel: ExperienceLevelValue;
  initialProgress: ProgressPoint[];
  courseUrl: string;
};

export function DashboardClient({
  firstName,
  email,
  experienceLevel,
  initialProgress,
  courseUrl
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabName>("progress");
  const [progress, setProgress] = useState<ProgressPoint[]>(initialProgress);
  const [editingEntry, setEditingEntry] = useState<ProgressPoint | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = progress.reduce((sum, point) => sum + point.revenue, 0);
    const latest = progress.at(-1)?.revenue ?? 0;

    return { totalRevenue, latest };
  }, [progress]);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleProgressUpdated(updatedProgress: ProgressPoint[]) {
    setProgress(updatedProgress);
    setEditingEntry(null);
  }

  return (
    <div className="space-y-5">
      <section className="panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h1 className="text-2xl font-semibold text-brand-amber">أهلاً بعودتك، {firstName}</h1>
          <p className="text-sm text-slate-300">البريد الإلكتروني: {email}</p>
          <p className="text-sm text-slate-300">
            مستوى الخبرة:{" "}
            <span className="font-medium text-brand-amber">
              {EXPERIENCE_LEVEL_LABELS[experienceLevel]}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-md border border-brand-silver/30 bg-brand-smoke/60 px-3 py-2 text-sm">
            آخر نتيجة: ${stats.latest.toFixed(2)}
          </div>
          <div className="rounded-md border border-brand-silver/30 bg-brand-smoke/60 px-3 py-2 text-sm">
            الإجمالي: ${stats.totalRevenue.toFixed(2)}
          </div>
          <button className="button-ghost" onClick={logout} disabled={loggingOut}>
            {loggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </section>

      <section className="panel p-2">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="أقسام لوحة المتابعة">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "tab-button-active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "progress") {
                  setEditingEntry(null);
                }
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`dashboard-panel-${tab.id}`}
              id={`dashboard-tab-${tab.id}`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "market" && (
        <section className="space-y-4" id="dashboard-panel-market" role="tabpanel" aria-labelledby="dashboard-tab-market">
          <p className="text-slate-300">
            عرض فوري لحركة الذهب والفضة لدعم تدريبك اليومي.
          </p>
          <MetalCharts />
        </section>
      )}

      {activeTab === "progress" && (
        <section
          className="grid gap-4 lg:grid-cols-[1.1fr_1fr]"
          id="dashboard-panel-progress"
          role="tabpanel"
          aria-labelledby="dashboard-tab-progress"
        >
          <div className="space-y-4">
            <DailyProgressForm
              onUpdated={handleProgressUpdated}
              editingEntry={editingEntry}
              onCancelEdit={() => setEditingEntry(null)}
            />
            <Ladder progress={progress} />
            <ProgressHistory progress={progress} onEdit={setEditingEntry} />
          </div>
          <ProgressChart data={progress} />
        </section>
      )}

      {activeTab === "course" && (
        <section
          className="panel space-y-4 p-4"
          id="dashboard-panel-course"
          role="tabpanel"
          aria-labelledby="dashboard-tab-course"
        >
          <h2 className="text-xl font-semibold text-brand-amber">الدورة الأساسية في التداول</h2>
          <p className="text-slate-300">
            يشمل هذا المنهج بنية السوق، إدارة المخاطر، وآلية التنفيذ جلسة بجلسة.
            أكمل كل وحدة وواصل تحديث مخطط تقدمك يومياً.
          </p>
          <div className="overflow-hidden rounded-lg border border-brand-silver/25">
            <iframe
              src={courseUrl}
              title="الدورة التدريبية - Golden Peak"
              className="h-[400px] w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </div>
  );
}
