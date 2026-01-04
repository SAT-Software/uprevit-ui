"use client";

import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useId, useMemo, useState } from "react";
import {
  PiArrowCounterClockwiseDuotone,
  PiBuildingsDuotone,
  PiCalendarDuotone,
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiCircleNotchDuotone,
  PiInfoDuotone,
  PiUserCircleDuotone,
  PiUserCircleGearDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DepartmentArchiveRow = {
  _id: string;
  department_name?: string;
  department_description?: string;
  manager?: string;
  users?: string[];
  auditLogs?: {
    actionBy: string;
    actionAt: string;
  }[];
};

interface ArchivedDepartmentsTableProps {
  data: DepartmentArchiveRow[];
  onRowClick?: (item: DepartmentArchiveRow) => void;
  onRestore: (item: DepartmentArchiveRow) => void;
  loadingRowId?: string | null;
}

// Helper component for sortable headers
const SortableHeader = ({
  column,
  title,
  icon: Icon,
}: {
  column: any;
  title: string;
  icon: any;
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

export function ArchivedDepartmentsTable({
  data,
  onRowClick,
  onRestore,
  loadingRowId,
}: ArchivedDepartmentsTableProps) {
  const id = useId();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const auth = useAuth();
  const isAdmin = auth.user?.profile?.userType === "admin";

  const handleRestore = (item: DepartmentArchiveRow) => {
    if (!isAdmin) {
      toast.error("Insufficient privileges, contact Admin");
      return;
    }
    onRestore(item);
  };

  const columns: ColumnDef<DepartmentArchiveRow>[] = useMemo(() => {
    return [
      {
        accessorKey: "department_name",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Department Name"
            icon={PiBuildingsDuotone}
          />
        ),
        size: 260,
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            {row.getValue("department_name")}
          </div>
        ),
      },
      {
        accessorKey: "department_description",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Description"
            icon={PiInfoDuotone}
          />
        ),
        size: 260,
        cell: ({ row }) => (
          <div className="text-sm font-medium truncate">
            {row.getValue("department_description")}
          </div>
        ),
      },
      {
        accessorKey: "manager",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Manager"
            icon={PiUserCircleGearDuotone}
          />
        ),
        size: 180,
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("manager")}</div>
        ),
      },
      {
        accessorKey: "users",
        header: ({ column }) => (
          <SortableHeader column={column} title="Users" icon={PiUsersDuotone} />
        ),
        size: 80,
        cell: ({ row }) => {
          const users = row.original.users?.length || 0;
          return <div className="text-sm font-medium">{users}</div>;
        },
      },
      {
        accessorKey: "actionBy",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Archived By"
            icon={PiUserCircleDuotone}
          />
        ),
        size: 160,
        cell: ({ row }) => {
          const actionBy = row.original.auditLogs?.[0]?.actionBy;
          return <div className="text-sm">{actionBy}</div>;
        },
      },
      {
        accessorKey: "actionAt",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Archived On"
            icon={PiCalendarDuotone}
          />
        ),
        size: 140,
        cell: ({ row }) => {
          const actionAt = row.original.auditLogs?.[0]?.actionAt;

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
            <div className="text-sm text-muted-foreground">
              {actionAtDate} {actionAtTime}
            </div>
          );
        },
      },
      {
        id: "restore",
        header: "Restore",
        size: 100,
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="space-y-4 w-full">
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
                            header.getContext()
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
                      isRowLoading && "opacity-60 pointer-events-none"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page (Deleted) */}

        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <PiCaretCircleDoubleLeftDuotone
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <PiCaretCircleLeftDuotone size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <PiCaretCircleRightDuotone size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <PiCaretCircleDoubleRightDuotone
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
