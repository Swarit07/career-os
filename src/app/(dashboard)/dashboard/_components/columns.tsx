"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
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
import type { Application, ApplicationStatus } from "@/lib/database.types";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  Applied: {
    label: "Applied",
    className:
      "border-white/10 text-white/50 bg-transparent",
  },
  Interviewing: {
    label: "Interviewing",
    className:
      "border-amber-500/20 text-amber-400/70 bg-transparent",
  },
  Offer: {
    label: "Offer",
    className:
      "border-emerald-500/20 text-emerald-400/70 bg-transparent",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-red-500/20 text-red-400/60 bg-transparent",
  },
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 text-white/40 hover:text-white/60"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-white/80">
        {row.getValue("company_name")}
      </div>
    ),
  },
  {
    accessorKey: "role_title",
    header: () => <span className="text-white/40">Role</span>,
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-white/50">
        {row.getValue("role_title")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="text-white/40">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as ApplicationStatus;
      const config = statusConfig[status];
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
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
    header: () => <span className="text-white/40">Location</span>,
    cell: ({ row }) => {
      const location = row.getValue("location") as string | null;
      return <div className="text-white/40">{location ?? "\u2014"}</div>;
    },
  },
  {
    accessorKey: "applied_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 text-white/40 hover:text-white/60"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Applied
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("applied_date") as string | null;
      if (!date) return <div className="text-white/30">{"\u2014"}</div>;
      return (
        <div className="stat-number text-sm text-white/50">
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
    header: () => <span className="text-white/40">Salary</span>,
    cell: ({ row }) => {
      const salary = row.getValue("salary_range") as string | null;
      return (
        <div className="stat-number text-sm text-white/50">
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

      async function handleDelete() {
        const { error } = await supabase
          .from("applications")
          .delete()
          .eq("id", application.id as never);
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
                className="h-8 w-8 p-0 text-white/30 hover:text-white/60"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-white/[0.08] bg-black/90 backdrop-blur-xl"
            >
              {application.job_url && (
                <>
                  <DropdownMenuItem asChild className="text-white/60 focus:bg-white/[0.04] focus:text-white/80">
                    <a
                      href={application.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Job URL
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                </>
              )}
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(application.company_name)
                }
                className="text-white/60 focus:bg-white/[0.04] focus:text-white/80"
              >
                Copy company name
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                className="text-red-400/70 focus:bg-red-500/10 focus:text-red-400"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent className="border-white/[0.08] bg-black/95 backdrop-blur-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete application?</AlertDialogTitle>
                <AlertDialogDescription>
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
        </>
      );
    },
  },
];
