"use client";

import { useMemo, useState } from "react";
import type { Application } from "@/lib/database.types";

interface ActivityHeatmapProps {
  data: Application[];
}

const DAYS = 91; // ~13 weeks

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getIntensity(count: number): string {
  if (count === 0) return "rgba(255,255,255,0.04)";
  if (count === 1) return "rgba(0,212,255,0.25)";
  if (count === 2) return "rgba(0,212,255,0.45)";
  return "rgba(0,212,255,0.70)";
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const { grid, weeks } = useMemo(() => {
    const countMap: Record<string, number> = {};
    for (const app of data) {
      if (app.applied_date) {
        const key = app.applied_date;
        countMap[key] = (countMap[key] ?? 0) + 1;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: { date: string; count: number }[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = getDateKey(d);
      days.push({ date: key, count: countMap[key] ?? 0 });
    }

    // Pad so the grid starts on Sunday
    const firstDay = new Date(days[0].date);
    const startPad = firstDay.getDay();
    const paddedDays = [...Array(startPad).fill(null), ...days];

    const weeks: ({ date: string; count: number } | null)[][] = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return { grid: paddedDays, weeks };
  }, [data]);

  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="liquid-glass p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-white/40">
        Activity — Last 13 Weeks
      </p>
      <div className="relative mt-4">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) =>
                day === null ? (
                  <div key={di} className="h-3 w-3" />
                ) : (
                  <div
                    key={di}
                    className="h-3 w-3 cursor-default rounded-[2px] transition-opacity hover:opacity-80"
                    style={{ backgroundColor: getIntensity(day.count) }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ date: day.date, count: day.count, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1">
          {DAY_LABELS.map((l, i) => (
            <div key={i} className="w-3 text-center text-[9px] text-white/20">{l}</div>
          ))}
        </div>
        {tooltip && (
          <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded border border-white/[0.08] bg-black/90 px-2 py-1 text-xs text-white/70 backdrop-blur-xl"
            style={{ left: tooltip.x + 6, top: tooltip.y - 6 }}
          >
            {tooltip.date} &mdash; <span className="text-[var(--accent-aqua)]">{tooltip.count}</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-white/30">Less</span>
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: getIntensity(n) }} />
        ))}
        <span className="text-[10px] text-white/30">More</span>
      </div>
    </div>
  );
}
