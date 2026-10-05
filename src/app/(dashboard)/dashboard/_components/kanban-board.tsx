"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { Application, ApplicationStatus } from "@/lib/database.types";

interface KanbanBoardProps {
  data: Application[];
}

const COLUMNS: { status: ApplicationStatus; label: string; accent: string; bg: string }[] = [
  { status: "Applied", label: "Applied", accent: "#0071e3", bg: "#eff6ff" },
  { status: "Interviewing", label: "Interviewing", accent: "#d97706", bg: "#fff7ed" },
  { status: "Offer", label: "Offer", accent: "#16a34a", bg: "#f0fdf4" },
  { status: "Rejected", label: "Rejected", accent: "#dc2626", bg: "#fef2f2" },
];

function KanbanCard({ app }: { app: Application }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(newStatus: ApplicationStatus) {
    setUpdating(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUpdating(false);
      return;
    }
    await supabase
      .from("applications")
      .update({ status: newStatus } as never)
      .eq("id", app.id as never)
      .eq("user_id", user.id as never);
    router.refresh();
    setUpdating(false);
  }

  const otherStatuses = COLUMNS.map((c) => c.status).filter((s) => s !== app.status);

  return (
    <div
      className="group rounded-xl p-3.5 transition-all"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={{ color: "#1d1d1f" }}>
            {app.company_name}
          </p>
          <p className="mt-0.5 truncate text-xs" style={{ color: "#6e6e73" }}>
            {app.role_title}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: "#86868b" }}
            >
              {updating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <MoreHorizontal className="h-3.5 w-3.5" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            }}
          >
            <DropdownMenuLabel className="text-xs" style={{ color: "#86868b" }}>
              Move to
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "rgba(0,0,0,0.06)" }} />
            {otherStatuses.map((status) => {
              const col = COLUMNS.find((c) => c.status === status)!;
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="gap-2"
                  style={{ color: "#1d1d1f" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: col.accent }}
                  />
                  {status}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {app.applied_date && (
        <p
          className="mt-2 text-[11px] tabular-nums"
          style={{ color: "#86868b" }}
        >
          {app.applied_date}
        </p>
      )}
      {app.location && (
        <p className="mt-1 truncate text-[11px]" style={{ color: "#a1a1a6" }}>
          {app.location}
        </p>
      )}
    </div>
  );
}

export function KanbanBoard({ data }: KanbanBoardProps) {
  return (
    <div className="grid min-h-[400px] grid-cols-2 gap-4 lg:grid-cols-4">
      {COLUMNS.map(({ status, label, accent, bg }) => {
        const cards = data.filter((a) => a.status === status);
        return (
          <div
            key={status}
            className="flex flex-col overflow-hidden rounded-2xl"
            style={{
              background: "#fafafa",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div className="h-1 w-full" style={{ backgroundColor: accent }} />
            <div className="flex items-center gap-2 px-4 py-3">
              <span
                className="text-[11px] font-semibold uppercase"
                style={{ color: accent, letterSpacing: "0.12em" }}
              >
                {label}
              </span>
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: bg, color: accent }}
              >
                {cards.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
              {cards.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-xs" style={{ color: "#a1a1a6" }}>
                    No applications
                  </p>
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
