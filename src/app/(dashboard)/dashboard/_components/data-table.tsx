"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { Application } from "@/lib/database.types";
import { NewApplicationDialog } from "./new-application-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ApplicationsDataTable({
  columns,
  data,
}: DataTableProps<Application, unknown>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-5 p-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "#a1a1a6" }}
            />
            <Input
              placeholder="Filter companies..."
              value={
                (table.getColumn("company_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("company_name")?.setFilterValue(e.target.value)
              }
              className="apple-input h-10 pl-10 text-sm"
            />
          </div>
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="apple-input h-10 w-[160px] text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="apple-btn-primary"
        >
          <Plus className="h-4 w-4" />
          New Application
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  background: "#fafafa",
                }}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-5 py-3.5 text-[11px] font-semibold uppercase"
                    style={{
                      color: "#86868b",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="apple-row"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-10">
                  <div className="apple-empty mx-auto max-w-sm">
                    <p
                      className="apple-serif-italic text-base"
                      style={{ color: "#86868b" }}
                    >
                      Your next opportunity is out there. Fire off an application.
                    </p>
                    <button
                      onClick={() => setDialogOpen(true)}
                      className="apple-btn-primary mt-5"
                    >
                      <Plus className="h-4 w-4" />
                      Add your first application
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm" style={{ color: "#86868b" }}>
          {table.getFilteredRowModel().rows.length} application(s)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30"
            style={{
              background: "#f5f5f7",
              color: "#1d1d1f",
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span
            className="text-sm tabular-nums"
            style={{ color: "#6e6e73" }}
          >
            {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30"
            style={{
              background: "#f5f5f7",
              color: "#1d1d1f",
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <NewApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
