"use client";

import dynamic from "next/dynamic";
import type { Application } from "@/lib/database.types";

const StatusDonutChart = dynamic(
  () => import("./status-donut-chart").then((m) => m.StatusDonutChart),
  { ssr: false }
);

const ActivityHeatmap = dynamic(
  () => import("./activity-heatmap").then((m) => m.ActivityHeatmap),
  { ssr: false }
);

interface ChartsRowProps {
  data: Application[];
}

export function ChartsRow({ data }: ChartsRowProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <StatusDonutChart data={data} />
      <ActivityHeatmap data={data} />
    </div>
  );
}
