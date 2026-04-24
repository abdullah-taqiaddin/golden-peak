"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type LocalMarketFallbackChartProps = {
  symbol: string;
  height?: number;
};

type MarketPoint = {
  time: string;
  price: number;
};

function getMarketProfile(symbol: string) {
  if (symbol.includes("XAG")) {
    return { base: 28.4, volatility: 0.12 };
  }

  return { base: 2335, volatility: 2.1 };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ar-JO", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function buildInitialSeries(symbol: string): MarketPoint[] {
  const { base, volatility } = getMarketProfile(symbol);
  let price = base;
  const now = Date.now();
  const points: MarketPoint[] = [];

  for (let i = 59; i >= 0; i -= 1) {
    const stamp = new Date(now - i * 60_000);
    const motion = Math.sin(i / 6) * volatility * 0.4 + (Math.random() - 0.5) * volatility;
    price = Math.max(0.01, price + motion);

    points.push({
      time: formatTime(stamp),
      price: Number(price.toFixed(2))
    });
  }

  return points;
}

export function LocalMarketFallbackChart({ symbol, height = 700 }: LocalMarketFallbackChartProps) {
  const [data, setData] = useState<MarketPoint[]>(() => buildInitialSeries(symbol));

  useEffect(() => {
    setData(buildInitialSeries(symbol));
  }, [symbol]);

  useEffect(() => {
    const { volatility } = getMarketProfile(symbol);

    const timer = window.setInterval(() => {
      setData((current) => {
        const nextPrice = Math.max(
          0.01,
          current[current.length - 1].price + (Math.random() - 0.5) * volatility
        );

        const next = [
          ...current.slice(-59),
          {
            time: formatTime(new Date()),
            price: Number(nextPrice.toFixed(2))
          }
        ];

        return next;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [symbol]);

  return (
    <div className="space-y-2" style={{ height }}>
      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
        بث TradingView المباشر غير متاح حالياً. يتم عرض مخطط احتياطي محلي.
      </div>
      <div className="h-[calc(100%-2.4rem)] min-h-[630px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`fallback-gradient-${symbol}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F2D168" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#F2D168" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(197,198,205,0.15)" strokeDasharray="4 4" />
            <XAxis dataKey="time" stroke="#C5C6CD" minTickGap={28} />
            <YAxis stroke="#C5C6CD" domain={["dataMin - 1", "dataMax + 1"]} />
            <Tooltip
              contentStyle={{
                background: "#0f1c30",
                border: "1px solid rgba(233,195,73,0.6)",
                borderRadius: "10px"
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#F2D168"
              strokeWidth={2}
              fill={`url(#fallback-gradient-${symbol})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
