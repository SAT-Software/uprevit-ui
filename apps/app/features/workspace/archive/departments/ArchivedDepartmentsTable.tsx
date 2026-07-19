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

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { WorkspaceListPaginationSkeleton } from "@/components/table/WorkspaceListPaginationSkeleton";
import { WorkspaceListToolbarSkeleton } from "@/components/table/WorkspaceListToolbarSkeleton";
import ShowOrHideTableColumnsDropdown from "@/features/workspace/common/ShowOrHideTableColumnsDropdown";
import {
  DashboardErrorState,
  DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT,
} from "@/features/workspace/dashboard/DashboardErrorState";
import { ListFilterColumn } from "@/lib/workspace-list-query";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import {
  ArchiveRestoreIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Loading03Icon,
  NewOfficeIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";

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

const columnHeaderMap = [
  { title: "Department Name", info: "Name of the archived department" },
  { title: "Users", info: "Number of users assigned to this department" },
  { title: "Archived By", info: "User who archived this department" },
  { title: "Archived On", info: "Date and time when this department was archived" },
];

const ARCHIVED_DEPARTMENT_TABLE_COLUMN_COUNT = 4;

const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  users: false,
};

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<DepartmentArchiveRow, unknown>;
  title: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-10 group data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center text-muted-foreground/60 group-hover:text-muted-foreground transition-colors delay-100 duration-200 ease-in-out">
              <span>{title}</span>
            </div>
            <div className="opacity-50 group-hover:opacity-100 transition-all delay-100 duration-200 ease-in-out">
              {column.getIsSorted() === "desc" ? (
                <Icon icon={ArrowDown01Icon} className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "asc" ? (
                <Icon icon={ArrowUp01Icon} className="ml-1 h-3 w-3" />
              ) : (
                <Icon icon={UnfoldMoreIcon} className="ml-1 h-3 w-3" />
              )}
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {columnHeaderMap.find((col) => col.title === title)?.info}
      </TooltipContent>
    </Tooltip>
  );
};

interface ArchivedDepartmentsTableProps {
  data: DepartmentArchiveRow[];
  onRestore: (item: DepartmentArchiveRow) => void;
  loadingRowId?: string | null;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  filters: Parameters<typeof WorkspaceListControls>[0]["filters"];
  filterColumns: ListFilterColumn[];
  onApplyFilters: Parameters<typeof WorkspaceListControls>[0]["onApplyFilters"];
  onClearFilters: Parameters<typeof WorkspaceListControls>[0]["onClearFilters"];
  isLoading?: boolean;
  isError?: boolean;
  hasItemsToList?: boolean;
  pagination?: Parameters<typeof WorkspaceListPagination>[0]["pagination"];
  onPageChange: (page: number) => void;
}

export function ArchivedDepartmentsTable({
  data,
  onRestore,
  loadingRowId,
  sorting,
  onSortingChange,
  filters,
  filterColumns,
  onApplyFilters,
  onClearFilters,
  isLoading = false,
  isError = false,
  hasItemsToList = true,
  pagination,
  onPageChange,
}: ArchivedDepartmentsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_COLUMN_VISIBILITY,
  );

  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const handleRestore = (item: DepartmentArchiveRow) => {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    onRestore(item);
  };

  const columns: ColumnDef<DepartmentArchiveRow>[] = useMemo(() => {
    return [
      {
        accessorKey: "department_name",
        enableHiding: false,
        meta: { label: "Department Name" },
        header: ({ column }) => (
          <SortableHeader column={column} title="Department Name" />
        ),
        size: 260,
        cell: ({ row }) => (
          <div className="text-sm font-medium truncate">
            {row.getValue("department_name")}
          </div>
        ),
      },
      {
        id: "users",
        accessorFn: (row) => row.users?.length ?? 0,
        enableHiding: true,
        meta: { label: "Users" },
        header: ({ column }) => (
          <SortableHeader column={column} title="Users" />
        ),
        size: 80,
        cell: ({ row }) => (
          <div className="text-sm font-medium">{row.getValue("users")}</div>
        ),
      },
      {
        id: "actionBy",
        accessorFn: (row) => row.auditLogs?.[0]?.actionBy ?? "",
        enableHiding: true,
        meta: { label: "Archived By" },
        header: ({ column }) => (
          <SortableHeader column={column} title="Archived By" />
        ),
        size: 160,
        cell: ({ row }) => (
          <div className="text-sm font-medium truncate">
            {row.getValue("actionBy") || "—"}
          </div>
        ),
      },
      {
        id: "actionAt",
        accessorFn: (row) => row.auditLogs?.[0]?.actionAt ?? "",
        enableHiding: true,
        meta: { label: "Archived On" },
        header: ({ column }) => (
          <SortableHeader column={column} title="Archived On" />
        ),
        size: 160,
        cell: ({ row }) => {
          const formattedDate = formatToLocalDateTime(
            row.getValue("actionAt") as string,
          );

          return (
            <div className="text-sm text-muted-foreground/60 truncate">
              {formattedDate || "—"}
            </div>
          );
        },
      },
      {
        id: "restore",
        header: () => <span className="sr-only">Restore</span>,
        size: 110,
        enableHiding: false,
        cell: ({ row }) => {
          const isRowLoading = loadingRowId === row.original._id;
          return (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={isRowLoading}
                onClick={(event) => {
                  event.stopPropagation();
                  handleRestore(row.original);
                }}
              >
                {isRowLoading ? (
                  <Icon
                    icon={Loading03Icon}
                    size={14}
                    strokeWidth={2}
                    className="animate-spin"
                  />
                ) : (
                  <Icon icon={ArchiveRestoreIcon} size={14} strokeWidth={2} />
                )}
                {isRowLoading ? "Restoring..." : "Restore"}
              </Button>
            </div>
          );
        },
      },
    ];
  }, [loadingRowId, onRestore]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange,
    enableSortingRemoval: false,
    initialState: {
      columnVisibility: DEFAULT_COLUMN_VISIBILITY,
    },
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="px-2 pb-2">
      <div className="flex flex-col border rounded-2xl">
        <div className="flex h-10 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Departments</p>
            <InfoTooltip content="Archived departments in your workspace. Restore a department to make it active again." />
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <WorkspaceListToolbarSkeleton />
            ) : !isError ? (
              <>
                <ShowOrHideTableColumnsDropdown table={table} />
                <WorkspaceListControls
                  filters={filters}
                  filterColumns={filterColumns}
                  onApplyFilters={onApplyFilters}
                  onClearFilters={onClearFilters}
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="w-full">
          {isError ? (
            <DashboardErrorState
              variant="panel"
              embedded
              icon={NewOfficeIcon}
              title="Failed to load archived departments"
              className={DASHBOARD_TABLE_BODY_ERROR_MIN_HEIGHT}
            />
          ) : hasItemsToList ? (
            <div className="flex flex-col items-end">
              <div className="w-full border-y border-border overflow-hidden">
              <Table className="table-fixed w-full">
                <colgroup>
                  {table.getHeaderGroups()[0]?.headers.map((header) => (
                    <col
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    />
                  ))}
                </colgroup>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="border-r border-border last:border-r-0"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableBodySkeleton
                      columnCount={ARCHIVED_DEPARTMENT_TABLE_COLUMN_COUNT}
                    />
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      const isRowLoading = loadingRowId === row.original._id;
                      return (
                        <TableRow
                          key={row.id}
                          className={cn(
                            "hover:bg-muted/50 transition-opacity",
                            isRowLoading && "opacity-60 pointer-events-none",
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                cell.column.id === "restore" && "last:py-0",
                              )}
                            >
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
                        className="h-24 text-center text-sm text-muted-foreground"
                      >
                        No archived departments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
              <div className="flex h-10 w-full items-center">
                {isLoading ? (
                  <WorkspaceListPaginationSkeleton />
                ) : (
                  <WorkspaceListPagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                  />
                )}
              </div>
            </div>
          ) : (
            <ArchivedDepartmentsEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function ArchivedDepartmentsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-b-2xl border-t border-dashed border-border py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
        <Icon
          icon={NewOfficeIcon}
          size={28}
          strokeWidth={1.75}
          className="text-muted-foreground/70"
        />
      </div>
      <div>
        <p className="text-sm font-medium">No archived departments</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Archived departments will appear here.
        </p>
      </div>
    </div>
  );
}
