"use client";

import { useEffect, useRef, useState } from "react";

import { LocalMarketFallbackChart } from "@/components/LocalMarketFallbackChart";

type TradingViewWidgetProps = {
  title: string;
  symbol: string;
  height?: number;
};

export function TradingViewWidget({ title, symbol, height = 700 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "live" | "fallback">("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    setMode("loading");
    containerRef.current.innerHTML = "";

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    widgetHost.style.height = "100%";
    widgetHost.style.width = "100%";
    containerRef.current.appendChild(widgetHost);

    function checkLoaded() {
      const isLive = Boolean(widgetHost.querySelector("iframe"));
      if (isLive) {
        setMode("live");
      }
      return isLive;
    }

    const observer = new MutationObserver(() => {
      checkLoaded();
    });

    observer.observe(widgetHost, {
      childList: true,
      subtree: true
    });

    const watchdog = window.setTimeout(() => {
      if (!checkLoaded()) {
        setMode("fallback");
      }
    }, 8500);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.onerror = () => setMode("fallback");
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "ar",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);

    return () => {
      observer.disconnect();
      window.clearTimeout(watchdog);
    };
  }, [symbol, height, refreshKey]);

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-brand-silver/20 px-4 py-3">
        <h3 className="font-semibold text-brand-amber">{title}</h3>
      </div>
      <div className="p-2">
        {mode === "fallback" ? (
          <div className="space-y-2">
            <LocalMarketFallbackChart symbol={symbol} height={height} />
            <button
              type="button"
              className="button-ghost text-sm"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              إعادة محاولة تحميل البث المباشر
            </button>
          </div>
        ) : (
          <div
            className="tradingview-widget-container h-[700px] min-h-[700px] w-full"
            style={{ height }}
            ref={containerRef}
          />
        )}
      </div>
    </section>
  );
}
