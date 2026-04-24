"use client";

import { useMemo, useState } from "react";

import { ProgressPoint } from "@/components/ProgressChart";

type ProgressHistoryProps = {
  progress: ProgressPoint[];
  onEdit: (entry: ProgressPoint) => void;
};

type TimeFilter = "week" | "month" | "all";

const usdFormatter = new Intl.NumberFormat("ar-JO", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function toLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getRangeStart(filter: TimeFilter) {
  const now = new Date();

  if (filter === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (filter === "week") {
    const start = new Date(now);
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  return null;
}

export function ProgressHistory({ progress, onEdit }: ProgressHistoryProps) {
  const [filter, setFilter] = useState<TimeFilter>("all");
  const rows = useMemo(
    () => [...progress].sort((a, b) => b.entryDate.localeCompare(a.entryDate)),
    [progress]
  );
  const filteredRows = useMemo(() => {
    const rangeStart = getRangeStart(filter);
    if (!rangeStart) return rows;

    return rows.filter((row) => toLocalDate(row.entryDate) >= rangeStart);
  }, [filter, rows]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-brand-silver/20 p-4">
        <h3 className="font-semibold text-brand-amber">سجل الأداء</h3>
        <span className="text-xs text-slate-300">
          {filteredRows.length} من {rows.length} سجل
        </span>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-brand-silver/20 p-4">
        {(["week", "month", "all"] as TimeFilter[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`tab-button px-3 py-1 text-xs ${filter === item ? "tab-button-active" : ""}`}
          >
            {item === "week" ? "هذا الأسبوع" : item === "month" ? "هذا الشهر" : "الكل"}
          </button>
        ))}
      </div>

      {filteredRows.length === 0 ? (
        <p className="p-4 text-sm text-slate-300">
          {rows.length === 0
            ? "لا توجد سجلات بعد. أضف أول تحديث للأداء من الأعلى."
            : "لا توجد سجلات ضمن هذا الفلتر."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>النتيجة</th>
                <th className="w-[110px]">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.entryDate}>
                  <td>{row.entryDate}</td>
                  <td>{usdFormatter.format(row.revenue)}</td>
                  <td>
                    <button
                      className="rounded-md border border-brand-silver/40 bg-brand-smoke/60 px-3 py-1 text-xs text-slate-100 hover:border-brand-gold/70 hover:text-brand-amber"
                      onClick={() => onEdit(row)}
                      type="button"
                    >
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
