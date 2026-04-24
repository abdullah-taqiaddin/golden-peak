import { TradingViewWidget } from "@/components/TradingViewWidget";

export function MetalCharts() {
  return (
    <div className="grid gap-6">
      <TradingViewWidget title="الذهب (XAU/USD)" symbol="OANDA:XAUUSD" />
      <TradingViewWidget title="الفضة (XAG/USD)" symbol="OANDA:XAGUSD" />
    </div>
  );
}
