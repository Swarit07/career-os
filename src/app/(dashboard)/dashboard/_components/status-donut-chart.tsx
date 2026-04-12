"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Application, ApplicationStatus } from "@/lib/database.types";

interface StatusDonutChartProps {
  data: Application[];
}

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string }> = {
  Applied: { color: "#0071e3", label: "Applied" },
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
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <span style={{ color: item.color }} className="font-semibold">{name}</span>
      <span className="ml-2" style={{ color: "#1d1d1f" }}>{value}</span>
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
  const emptyData = [{ name: "Empty", value: 1, color: "#f5f5f7" }];

  return (
    <div className="apple-card p-7">
      <p className="apple-label-muted">Status Breakdown</p>
      <div className="relative mt-5 flex items-center gap-7">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={isEmpty ? emptyData : chartData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={64}
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
            <span
              className="text-3xl font-semibold tabular-nums"
              style={{ color: "#1d1d1f", letterSpacing: "-0.03em" }}
            >
              {total}
            </span>
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ color: "#86868b", letterSpacing: "0.15em" }}
            >
              total
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {STATUSES.map((status) => {
            const count = data.filter((a) => a.status === status).length;
            const { color, label } = STATUS_CONFIG[status];
            return (
              <div key={status} className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm" style={{ color: "#6e6e73" }}>
                  {label}
                </span>
                <span
                  className="ml-auto pl-5 text-sm font-semibold tabular-nums"
                  style={{ color: "#1d1d1f" }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
