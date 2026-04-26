"use client";

import { useEffect, useRef, useState } from "react";

type HeroStat = {
  label: string;
  target: number;
  suffix: string;
};

const stats: HeroStat[] = [
  { label: "طالب نشط", target: 200, suffix: "+" },
  { label: "نسبة الرضا", target: 92, suffix: "%" },
  { label: "سنوات خبرة", target: 10, suffix: "+" }
];

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function HeroStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || started) {
          return;
        }

        started = true;
        const startTime = performance.now();
        const durationMs = 1600;

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const next = Math.min(1, elapsed / durationMs);
          setProgress(easeOutCubic(next));

          if (next < 1) {
            frame = window.requestAnimationFrame(tick);
          }
        };

        frame = window.requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-8 border-t border-white/10 pt-8">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="text-2xl font-bold text-white">
            {Math.round(stat.target * progress)}
            {stat.suffix}
          </div>
          <div className="text-xs text-[#c5c6cd]">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
