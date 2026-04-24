"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export type ProgressPoint = {
  entryDate: string;
  revenue: number;
};

export function ProgressChart({ data }: { data: ProgressPoint[] }) {
  if (!data.length) {
    return (
      <div className="panel flex h-72 items-center justify-center text-slate-300">
        لا يوجد تقدم بعد. أضف أول سجل للأداء اليومي.
      </div>
    );
  }

  return (
    <div className="panel h-80 w-full p-4">
      <h3 className="mb-3 font-semibold text-brand-amber">اتجاه الأداء</h3>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(197,198,205,0.2)" strokeDasharray="4 4" />
          <XAxis dataKey="entryDate" stroke="#C5C6CD" />
          <YAxis stroke="#C5C6CD" />
          <Tooltip
            contentStyle={{
              background: "#0f1c30",
              border: "1px solid rgba(233,195,73,0.6)",
              borderRadius: "10px"
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#E9C349"
            strokeWidth={3}
            dot={{ r: 3, fill: "#F2D168" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
