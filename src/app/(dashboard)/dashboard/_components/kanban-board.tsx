"use client";

import type { Application, ApplicationStatus } from "@/lib/database.types";

interface KanbanBoardProps {
  data: Application[];
}

const COLUMNS: { status: ApplicationStatus; label: string; accent: string; dim: string }[] = [
  { status: "Applied", label: "Applied", accent: "#00d4ff", dim: "rgba(0,212,255,0.12)" },
  { status: "Interviewing", label: "Interviewing", accent: "#f59e0b", dim: "rgba(245,158,11,0.12)" },
  { status: "Offer", label: "Offer", accent: "#10b981", dim: "rgba(16,185,129,0.12)" },
  { status: "Rejected", label: "Rejected", accent: "#f43f5e", dim: "rgba(244,63,94,0.12)" },
];

function KanbanCard({ app }: { app: Application }) {
  return (
    <div className="liquid-glass rounded-lg p-3 transition-opacity hover:opacity-90">
      <p className="text-sm font-medium text-white/85">{app.company_name}</p>
      <p className="mt-0.5 text-xs text-white/45">{app.role_title}</p>
      {app.applied_date && (
        <p className="mt-2 font-mono text-[10px] text-white/25">{app.applied_date}</p>
      )}
    </div>
  );
}

export function KanbanBoard({ data }: KanbanBoardProps) {
  return (
    <div className="grid min-h-[400px] grid-cols-2 gap-3 lg:grid-cols-4">
      {COLUMNS.map(({ status, label, accent, dim }) => {
        const cards = data.filter((a) => a.status === status);
        return (
          <div key={status} className="liquid-glass flex flex-col overflow-hidden rounded-xl">
            <div
              className="h-0.5 w-full"
              style={{ backgroundColor: accent }}
            />
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: accent }}>
                {label}
              </span>
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: dim, color: accent }}
              >
                {cards.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
              {cards.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-xs text-white/20">No applications</p>
                </div>
              ) : (
                cards.map((app) => <KanbanCard key={app.id} app={app} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
