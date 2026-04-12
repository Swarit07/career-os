"use client";

import { useState } from "react";
import type { Application } from "@/lib/database.types";
import { ApplicationsDataTable } from "./data-table";
import { columns } from "./columns";
import { KanbanBoard } from "./kanban-board";
import { ViewToggle } from "./view-toggle";

interface ApplicationsViewProps {
  data: Application[];
}

export function ApplicationsView({ data }: ApplicationsViewProps) {
  const [view, setView] = useState<"table" | "kanban">("table");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="apple-label-muted">Applications</p>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "table" ? (
        <div className="apple-card p-2">
          <ApplicationsDataTable columns={columns} data={data} />
        </div>
      ) : (
        <KanbanBoard data={data} />
      )}
    </div>
  );
}
