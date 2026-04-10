"use client";

import { Download } from "lucide-react";
import type { Application } from "@/lib/database.types";

interface CsvExportButtonProps {
  data: Application[];
}

export function CsvExportButton({ data }: CsvExportButtonProps) {
  function handleExport() {
    const headers = ["Company", "Role", "Status", "Date Applied", "Location", "Salary Range", "Job URL"];
    const rows = data.map((a) => [
      a.company_name,
      a.role_title,
      a.status,
      a.applied_date ?? "",
      a.location ?? "",
      a.salary_range ?? "",
      a.job_url ?? "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `careeros-manifest-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="liquid-glass inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:text-white/90"
    >
      <Download className="h-3.5 w-3.5" />
      Download Manifest
    </button>
  );
}
