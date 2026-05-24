"use client";

import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
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
  PiHashDuotone,
  PiKanbanDuotone,
  PiUserCircleDuotone,
  PiUsersDuotone,
} from "react-icons/pi";
import type { IconType } from "react-icons";

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

export type ProjectArchiveRow = {
  _id: string;
  project_name?: string;
  project_number?: string;
  project_description?: string;
  users?: string[];
  project_manager?: string;
  auditLogs?: {
    actionBy: string;
    actionAt: string;
  }[];
  products?: number;
};

interface ArchivedProjectsTableProps {
  data: ProjectArchiveRow[];
  onRowClick?: (item: ProjectArchiveRow) => void;
  onRestore: (item: ProjectArchiveRow) => void;
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
  column: Column<ProjectArchiveRow, unknown>;
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

export function ArchivedProjectsTable({
  data,
  onRowClick,
  onRestore,
  loadingRowId,
  sorting,
  onSortingChange,
}: ArchivedProjectsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const handleRestore = (item: ProjectArchiveRow) => {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    onRestore(item);
  };

  const columns: ColumnDef<ProjectArchiveRow>[] = useMemo(() => {
    return [
      {
        accessorKey: "project_number",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Project No."
            icon={PiHashDuotone}
          />
        ),
        size: 160,
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            {row.getValue("project_number")}
          </div>
        ),
      },
      {
        accessorKey: "project_name",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Project Name"
            icon={PiKanbanDuotone}
          />
        ),
        size: 200,
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            {row.getValue("project_name")}
          </div>
        ),
      },
      {
        id: "users",
        accessorFn: (row) => row.users?.length ?? 0,
        header: ({ column }) => (
          <SortableHeader column={column} title="Users" icon={PiUsersDuotone} />
        ),
        size: 80,
        cell: ({ row }) => (
          <div className="text-sm font-medium">{row.getValue("users")}</div>
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
                  handleRestore(row.original);
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
