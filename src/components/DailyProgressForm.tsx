"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ProgressPoint } from "@/components/ProgressChart";

type DailyProgressFormProps = {
  onUpdated: (progress: ProgressPoint[]) => void;
  editingEntry?: ProgressPoint | null;
  onCancelEdit?: () => void;
};

function getLocalISODate() {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

export function DailyProgressForm({
  onUpdated,
  editingEntry = null,
  onCancelEdit
}: DailyProgressFormProps) {
  const [entryDate, setEntryDate] = useState(getLocalISODate);
  const [revenue, setRevenue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(editingEntry);

  useEffect(() => {
    if (!editingEntry) return;

    setEntryDate(editingEntry.entryDate);
    setRevenue(editingEntry.revenue.toString());
  }, [editingEntry]);

  function resetFormState() {
    setEntryDate(getLocalISODate());
    setRevenue("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDate, revenue })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "تعذر تحديث التقدم.");
        return;
      }

      resetFormState();
      onCancelEdit?.();
      onUpdated(result.progress);
      toast.success(
        isEditing ? "تم تحديث سجل الأداء بنجاح." : "تم حفظ الأداء اليومي بنجاح."
      );
    } catch {
      toast.error("حدث خطأ غير متوقع في الشبكة.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel space-y-4 p-4" onSubmit={onSubmit}>
      <h3 className="font-semibold text-brand-amber">
        {isEditing ? "تعديل سجل الأداء" : "تحديث الأداء اليومي"}
      </h3>
      {isEditing && (
        <p className="text-sm text-slate-300">
          أنت تقوم بتعديل سجل يوم <span className="text-brand-amber">{editingEntry?.entryDate}</span>.
        </p>
      )}

      <label className="block space-y-1">
        <span className="text-sm text-slate-300">التاريخ</span>
        <input
          className="input"
          type="date"
          value={entryDate}
          onChange={(event) => setEntryDate(event.target.value)}
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-slate-300">النتيجة (دولار)</span>
        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="مثال: 350.50"
          value={revenue}
          onChange={(event) => setRevenue(event.target.value)}
          required
        />
      </label>

      <div className={`grid gap-2 ${isEditing ? "sm:grid-cols-2" : ""}`}>
        <button className="button-primary w-full" disabled={submitting} type="submit">
          {submitting ? "جاري الإرسال..." : isEditing ? "تحديث الأداء" : "إرسال الأداء"}
        </button>
        {isEditing && (
          <button
            className="button-ghost w-full"
            disabled={submitting}
            onClick={() => {
              onCancelEdit?.();
              resetFormState();
            }}
            type="button"
          >
            إلغاء التعديل
          </button>
        )}
      </div>
    </form>
  );
}
