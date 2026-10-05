"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import { EditApplicationDialog } from "./new-application-dialog";
import type { Application, ApplicationStatus } from "@/lib/database.types";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  Applied: {
    label: "Applied",
    bg: "#eff6ff",
    text: "#0071e3",
    border: "rgba(0,113,227,0.22)",
  },
  Interviewing: {
    label: "Interviewing",
    bg: "#fff7ed",
    text: "#d97706",
    border: "rgba(217,119,6,0.22)",
  },
  Offer: {
    label: "Offer",
    bg: "#f0fdf4",
    text: "#16a34a",
    border: "rgba(22,163,74,0.22)",
  },
  Rejected: {
    label: "Rejected",
    bg: "#fef2f2",
    text: "#dc2626",
    border: "rgba(220,38,38,0.22)",
  },
};

const headerBtnStyle: React.CSSProperties = { color: "#86868b", fontWeight: 600 };
const cellTextStyle: React.CSSProperties = { color: "#6e6e73" };

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 h-auto px-2 py-1"
        style={headerBtnStyle}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-semibold" style={{ color: "#1d1d1f" }}>
        {row.getValue("company_name")}
      </div>
    ),
  },
  {
    accessorKey: "role_title",
    header: () => <span style={headerBtnStyle}>Role</span>,
    cell: ({ row }) => (
      <div className="max-w-[220px] truncate" style={cellTextStyle}>
        {row.getValue("role_title")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span style={headerBtnStyle}>Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as ApplicationStatus;
      const config = statusConfig[status];
      return (
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: config.bg,
            color: config.text,
            border: `1px solid ${config.border}`,
          }}
        >
          {config.label}
        </span>
      );
    },
    filterFn: (row, id, value: string) => {
      return row.getValue<string>(id) === value;
    },
  },
  {
    accessorKey: "location",
    header: () => <span style={headerBtnStyle}>Location</span>,
    cell: ({ row }) => {
      const location = row.getValue("location") as string | null;
      return (
        <div style={cellTextStyle}>{location ?? "\u2014"}</div>
      );
    },
  },
  {
    accessorKey: "applied_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 h-auto px-2 py-1"
        style={headerBtnStyle}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Applied
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("applied_date") as string | null;
      if (!date) return <div style={{ color: "#a1a1a6" }}>{"\u2014"}</div>;
      return (
        <div className="text-sm tabular-nums" style={cellTextStyle}>
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "salary_range",
    header: () => <span style={headerBtnStyle}>Salary</span>,
    cell: ({ row }) => {
      const salary = row.getValue("salary_range") as string | null;
      return (
        <div className="text-sm tabular-nums" style={cellTextStyle}>
          {salary ?? "\u2014"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function ActionsCell({ row }) {
      const application = row.original;
      const router = useRouter();
      const supabase = createClient();
      const [confirmOpen, setConfirmOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      async function handleDelete() {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { error } = await supabase
          .from("applications")
          .delete()
          .eq("id", application.id as never)
          .eq("user_id", user.id as never);
        if (!error) {
          router.refresh();
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                style={{ color: "#86868b" }}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
            >
              {application.job_url && (
                <>
                  <DropdownMenuItem asChild>
                    <a
                      href={application.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      style={{ color: "#1d1d1f" }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Job URL
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator style={{ background: "rgba(0,0,0,0.06)" }} />
                </>
              )}
              <DropdownMenuItem
                onClick={() => setEditOpen(true)}
                style={{ color: "#1d1d1f" }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: "rgba(0,0,0,0.06)" }} />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(application.company_name)
                }
                style={{ color: "#1d1d1f" }}
              >
                Copy company name
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: "rgba(0,0,0,0.06)" }} />
              <DropdownMenuItem
                onClick={() => setConfirmOpen(true)}
                style={{ color: "#dc2626" }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle style={{ color: "#1d1d1f" }}>
                  Delete application?
                </AlertDialogTitle>
                <AlertDialogDescription style={{ color: "#6e6e73" }}>
                  This will permanently delete your {application.company_name} application. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <EditApplicationDialog
            application={application}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      );
    },
  },
];
