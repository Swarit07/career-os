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
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              placeholder="Filter companies..."
              value={
                (table.getColumn("company_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("company_name")?.setFilterValue(e.target.value)
              }
              className="border-white/[0.06] bg-white/[0.02] pl-9 text-white/80 placeholder:text-white/20 focus-visible:border-white/20 focus-visible:ring-white/10"
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
            <SelectTrigger className="w-[150px] border-white/[0.06] bg-white/[0.02] text-white/60">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="border-white/[0.08] bg-black/95 backdrop-blur-xl">
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
          className="liquid-glass-strong inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 text-sm font-medium text-white/90 transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          New Application
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-white/[0.04]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-white/[0.04] hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs uppercase tracking-wider text-white/30"
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
                  className="border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-white/40">
                    <p className="font-serif italic">No applications yet</p>
                    <button
                      onClick={() => setDialogOpen(true)}
                      className="liquid-glass-strong inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-white/70 transition-transform duration-200 hover:scale-[1.02]"
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
        <p className="text-sm text-white/30">
          {table.getFilteredRowModel().rows.length} application(s)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-white/40 hover:text-white/60 disabled:text-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="stat-number text-sm text-white/40">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-white/40 hover:text-white/60 disabled:text-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* New Application Dialog */}
      <NewApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
