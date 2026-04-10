"use client";

import { LayoutList, Columns3 } from "lucide-react";

interface ViewToggleProps {
  view: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="liquid-glass inline-flex items-center gap-0.5 p-0.5">
      <button
        onClick={() => onViewChange("table")}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
          view === "table"
            ? "bg-white/[0.07] text-white/90"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        <LayoutList className="h-3.5 w-3.5" />
        Table
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
          view === "kanban"
            ? "bg-white/[0.07] text-white/90"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        <Columns3 className="h-3.5 w-3.5" />
        Board
      </button>
    </div>
  );
}
