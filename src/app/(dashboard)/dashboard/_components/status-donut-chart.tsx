"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Application, ApplicationStatus } from "@/lib/database.types";

interface StatusDonutChartProps {
  data: Application[];
}

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string }> = {
  Applied: { color: "#00d4ff", label: "Applied" },
  Interviewing: { color: "#f59e0b", label: "Interviewing" },
  Offer: { color: "#10b981", label: "Offer" },
  Rejected: { color: "#f43f5e", label: "Rejected" },
};

const STATUSES: ApplicationStatus[] = ["Applied", "Interviewing", "Offer", "Rejected"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: item } = payload[0];
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/90 px-3 py-2 text-xs backdrop-blur-xl">
      <span style={{ color: item.color }} className="font-medium">{name}</span>
      <span className="ml-2 text-white/60">{value}</span>
    </div>
  );
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const chartData = STATUSES.map((status) => ({
    name: STATUS_CONFIG[status].label,
    value: data.filter((a) => a.status === status).length,
    color: STATUS_CONFIG[status].color,
  })).filter((d) => d.value > 0);

  const total = data.length;
  const isEmpty = total === 0;
  const emptyData = [{ name: "Empty", value: 1, color: "rgba(255,255,255,0.05)" }];

  return (
    <div className="liquid-glass p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-white/40">
        Status Breakdown
      </p>
      <div className="relative mt-4 flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={isEmpty ? emptyData : chartData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={isEmpty ? 0 : 2}
                dataKey="value"
                strokeWidth={0}
              >
                {(isEmpty ? emptyData : chartData).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              {!isEmpty && <Tooltip content={<CustomTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="stat-number text-2xl text-white/90">{total}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/30">total</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {STATUSES.map((status) => {
            const count = data.filter((a) => a.status === status).length;
            const { color, label } = STATUS_CONFIG[status];
            return (
              <div key={status} className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-white/50">{label}</span>
                <span className="ml-auto pl-4 font-mono text-xs text-white/70">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
