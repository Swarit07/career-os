"use client";

import { useMemo, useState } from "react";
import type { Application } from "@/lib/database.types";

interface ActivityHeatmapProps {
  data: Application[];
}

const DAYS = 91; // ~13 weeks
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getIntensity(count: number): string {
  if (count === 0) return "rgba(0,0,0,0.05)";
  if (count === 1) return "rgba(0,113,227,0.22)";
  if (count === 2) return "rgba(0,113,227,0.48)";
  return "rgba(0,113,227,0.78)";
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

  return (
    <div className="apple-card p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-[#86868b]">
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
                    onMouseMove={(e) => {
                      setTooltip({ date: day.date, count: day.count, x: e.clientX, y: e.clientY });
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
            <div key={i} className="w-3 text-center text-[9px] text-[#a1a1a6]">{l}</div>
          ))}
        </div>
        {tooltip && (
          <div className="pointer-events-none fixed z-50 -translate-x-1/2 rounded border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1 text-xs text-[#1d1d1f] shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y + 16 }}
          >
            {tooltip.date} &mdash; <span className="font-semibold text-[#0071e3]">{tooltip.count}</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-[#86868b]">Less</span>
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: getIntensity(n) }} />
        ))}
        <span className="text-[10px] text-[#86868b]">More</span>
      </div>
    </div>
  );
}
