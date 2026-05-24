"use client";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  PiArrowCounterClockwiseDuotone,
  PiCalendarDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiCircleNotchDuotone,
  PiGitBranchDuotone,
  PiHashDuotone,
  PiKanbanDuotone,
  PiPackageDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";
import type { IconType } from "react-icons";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { cn } from "@uprevit/ui/lib/utils";

export type ProductArchiveRow = {
  _id: string;
  product_name?: string;
  auditLogs?: {
    actionBy: string;
    actionAt: string;
  }[];
  version?: string;
  product_plan_number?: string;
  department?: {
    _id: string;
    department_name: string;
  }[];
  project?: {
    _id: string;
    project_name: string;
  }[];
};

interface ArchivedProductsTableProps {
  data: ProductArchiveRow[];
  onRowClick?: (item: ProductArchiveRow) => void;
  onRestore: (item: ProductArchiveRow) => void;
  loadingRowId?: string | null;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}

// Helper component for sortable headers
const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: Column<ProductArchiveRow, unknown>;
  title: string;
  icon: IconType;
}) => {
  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-8 data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{title}</span>
        </div>
        {column.getIsSorted() === "desc" ? (
          <PiCaretDownDuotone className="ml-1 h-3 w-3" />
        ) : column.getIsSorted() === "asc" ? (
          <PiCaretUpDuotone className="ml-1 h-3 w-3" />
        ) : (
          <PiCaretUpDownDuotone className="ml-1 h-3 w-3 opacity-50" />
        )}
      </div>
    </button>
  );
};

export function ArchivedProductsTable({
  data,
  onRowClick,
  onRestore,
  loadingRowId,
  sorting,
  onSortingChange,
}: ArchivedProductsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<ProductArchiveRow>[] = useMemo(() => {
    return [
      {
        accessorKey: "product_plan_number",
        header: ({ column }) => (
          <SortableHeader column={column} title="PPN" icon={PiHashDuotone} />
        ),
        size: 120,
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            {row.getValue("product_plan_number")}
          </div>
        ),
      },
      {
        accessorKey: "product_name",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Product Name"
            icon={PiPackageDuotone}
          />
        ),
        size: 260,
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            {row.getValue("product_name")}
          </div>
        ),
      },
      {
        id: "actionBy",
        accessorFn: (row) => row.auditLogs?.[0]?.actionBy ?? "",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Archived By"
            icon={PiUserCircleDuotone}
          />
        ),
        size: 160,
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("actionBy")}</div>
        ),
      },
      {
        id: "actionAt",
        accessorFn: (row) => row.auditLogs?.[0]?.actionAt ?? "",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Archived On"
            icon={PiCalendarDuotone}
          />
        ),
        size: 140,
        cell: ({ row }) => {
          const actionAt = row.getValue("actionAt") as string | undefined;

          if (!actionAt) {
            return <div className="text-sm text-muted-foreground">-</div>;
          }

          const actionAtDate = new Date(actionAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const actionAtTime = new Date(actionAt).toLocaleTimeString();
          return (
            <div className="text-xs text-muted-foreground">
              {actionAtDate} {actionAtTime}
            </div>
          );
        },
      },
      {
        accessorKey: "version",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Version"
            icon={PiGitBranchDuotone}
          />
        ),
        size: 120,
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-mono text-sm">
            v{row.getValue("version")}
          </Badge>
        ),
      },
      {
        id: "restore",
        header: "Restore",
        size: 100,
        enableHiding: false,
        cell: ({ row }) => {
          const isLoading = loadingRowId === row.original._id;
          return (
            <div className="flex">
              <Button
                variant="secondary"
                size="sm"
                className="text-sm"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(row.original);
                }}
              >
                {isLoading ? (
                  <PiCircleNotchDuotone className="h-3 w-3 animate-spin" />
                ) : (
                  <PiArrowCounterClockwiseDuotone className="h-3 w-3" />
                )}
                {isLoading ? "Restoring..." : "Restore"}
              </Button>
            </div>
          );
        },
      },
    ];
  }, [onRestore, loadingRowId]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange,
    enableSortingRemoval: false,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      {/* Table */}
      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11 border-r border-border last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isRowLoading = loadingRowId === row.original._id;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 transition-opacity",
                      isRowLoading && "opacity-60 pointer-events-none",
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
