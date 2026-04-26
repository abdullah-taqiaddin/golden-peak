import { TradingViewWidget } from "@/components/TradingViewWidget";

export function MetalCharts() {
  return (
    <div className="grid gap-6">
      <TradingViewWidget title="الذهب (Gold)" symbol="TVC:GOLD" />
    </div>
  );
}
