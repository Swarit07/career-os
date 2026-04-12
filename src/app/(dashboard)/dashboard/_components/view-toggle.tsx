"use client";

import { LayoutList, Columns3 } from "lucide-react";

interface ViewToggleProps {
  view: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex items-center gap-0.5 p-0.5"
      style={{
        background: "#f5f5f7",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 10,
      }}
    >
      <button
        onClick={() => onViewChange("table")}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        style={{
          background: view === "table" ? "#ffffff" : "transparent",
          color: view === "table" ? "#1d1d1f" : "#6e6e73",
          boxShadow: view === "table" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <LayoutList className="h-3.5 w-3.5" />
        Table
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        style={{
          background: view === "kanban" ? "#ffffff" : "transparent",
          color: view === "kanban" ? "#1d1d1f" : "#6e6e73",
          boxShadow: view === "kanban" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <Columns3 className="h-3.5 w-3.5" />
        Board
      </button>
    </div>
  );
}
