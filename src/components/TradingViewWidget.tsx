"use client";

import { useEffect, useRef, useState } from "react";

type TradingViewWidgetProps = {
  title: string;
  symbol: string;
  height?: number;
};

export function TradingViewWidget({ title, symbol, height = 700 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef(0);
  const [mode, setMode] = useState<"loading" | "live" | "error">("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerEl = container;

    const cycle = cycleRef.current + 1;
    cycleRef.current = cycle;
    let disposed = false;

    const setModeSafely = (nextMode: "loading" | "live" | "error") => {
      if (!disposed && cycleRef.current === cycle) {
        setMode(nextMode);
      }
    };

    setModeSafely("loading");
    containerEl.innerHTML = "";
    containerEl.style.setProperty("height", `${height}px`, "important");
    containerEl.style.setProperty("min-height", `${height}px`, "important");
    containerEl.style.setProperty("width", "100%", "important");

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    widgetHost.style.height = "100%";
    widgetHost.style.minHeight = `${height}px`;
    widgetHost.style.width = "100%";
    containerEl.appendChild(widgetHost);

    function findAndFixIframeSize() {
      const iframe = containerEl.querySelector("iframe");
      if (!iframe) {
        return false;
      }

      iframe.style.setProperty("height", `${height}px`, "important");
      iframe.style.setProperty("min-height", `${height}px`, "important");
      iframe.style.setProperty("width", "100%", "important");

      const iframeContainer = iframe.parentElement;
      if (iframeContainer) {
        iframeContainer.style.setProperty("height", `${height}px`, "important");
        iframeContainer.style.setProperty("min-height", `${height}px`, "important");
        iframeContainer.style.setProperty("width", "100%", "important");
      }

      return true;
    }

    function checkLoaded() {
      const isLive = findAndFixIframeSize();
      if (isLive) {
        setModeSafely("live");
      }
      return isLive;
    }

    const observer = new MutationObserver(() => {
      checkLoaded();
    });

    observer.observe(containerEl, {
      childList: true,
      subtree: true
    });

    const watchdog = window.setTimeout(() => {
      if (!checkLoaded()) {
        setModeSafely("error");
      }
    }, 12000);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      setModeSafely("live");
      window.setTimeout(() => {
        checkLoaded();
      }, 600);
    };
    script.onerror = () => setModeSafely("error");
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "ar",
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    containerEl.appendChild(script);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(watchdog);
      script.remove();
      containerEl.innerHTML = "";
      containerEl.style.removeProperty("height");
      containerEl.style.removeProperty("min-height");
      containerEl.style.removeProperty("width");
    };
  }, [symbol, height, refreshKey]);

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-brand-silver/20 px-4 py-3">
        <h3 className="font-semibold text-brand-amber">{title}</h3>
      </div>
      <div className="relative p-2">
        <div
          className="tradingview-widget-container w-full"
          style={{ height: `${height}px`, minHeight: `${height}px` }}
          ref={containerRef}
        />

        {mode === "loading" && (
          <div className="pointer-events-none absolute inset-2 grid place-items-center rounded-lg border border-brand-silver/20 bg-brand-navy/35 text-sm text-slate-200">
            جاري تحميل الرسم البياني المباشر...
          </div>
        )}

        {mode === "error" && (
          <div className="absolute inset-2 flex flex-col items-center justify-center gap-3 rounded-lg border border-amber-500/35 bg-brand-navy/70 px-4 text-center">
            <p className="text-sm text-amber-100">تعذر تحميل الرسم المباشر حالياً.</p>
            <button
              type="button"
              className="button-ghost text-sm"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
