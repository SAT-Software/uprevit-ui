"use client";

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  CheckListIcon,
  Clock01Icon,
  NoteIcon,
  ProfileIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Input } from "@uprevit/ui/components/ui/input";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import {
  usePlatformAdminListQuery,
  mapPlatformPagination,
} from "@/lib/platform-admin-list-query";
import { useGetPlatformAuditLogs } from "@/hooks/platform-admin/useGetPlatformAuditLogs";
import type { PlatformAuditLogItem } from "@/types/platform-admin";

const AUDIT_SORT_FIELDS = ["occurredAt", "action", "status"];

const AUDIT_FILTER_COLUMNS = [
  { name: "occurredAt", label: "When", type: "date" as const },
  { name: "action", label: "Action", type: "text" as const },
  { name: "status", label: "Status", type: "text" as const },
];

const TABLE_COLUMN_COUNT = 5;

const SortableHeader = ({
  column,
  title,
  icon,
}: {
  column: Column<PlatformAuditLogItem, unknown>;
  title: string;
  icon: IconProps["icon"];
}) => (
  <button
    type="button"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="flex h-8 w-full cursor-pointer items-center justify-between hover:bg-muted/50 data-[state=open]:bg-accent"
  >
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          icon={icon}
          size={14}
          strokeWidth={2}
          className="shrink-0 text-muted-foreground"
        />
        <span className="whitespace-nowrap">{title}</span>
      </div>
      <Icon
        icon={
          column.getIsSorted() === "desc"
            ? ArrowDown01Icon
            : column.getIsSorted() === "asc"
              ? ArrowUp01Icon
              : ArrowUpDownIcon
        }
        size={12}
        strokeWidth={2}
        className={column.getIsSorted() ? "ml-1" : "ml-1 opacity-50"}
      />
    </div>
  </button>
);

const columns: ColumnDef<PlatformAuditLogItem>[] = [
  {
    accessorKey: "occurredAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="When" icon={Clock01Icon} />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {new Date(row.getValue("occurredAt")).toLocaleString()}
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <SortableHeader column={column} title="Action" icon={CheckListIcon} />
    ),
    cell: ({ row }) => (
      <span className="text-xs">{row.getValue("action")}</span>
    ),
    size: 220,
  },
  {
    accessorKey: "summary",
    enableSorting: false,
    header: () => (
      <div className="flex h-8 items-center gap-2">
        <Icon
          icon={NoteIcon}
          size={14}
          strokeWidth={2}
          className="text-muted-foreground"
        />
        <span>Summary</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("summary")}</span>
    ),
    size: 280,
  },
  {
    id: "actor",
    accessorFn: (row) => row.actor.name || row.actor.email || "—",
    enableSorting: false,
    header: () => (
      <div className="flex h-8 items-center gap-2">
        <Icon
          icon={UserCircleIcon}
          size={14}
          strokeWidth={2}
          className="text-muted-foreground"
        />
        <span>Actor</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.actor.name || row.original.actor.email || "—"}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column} title="Status" icon={CheckListIcon} />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={
            status === "failed"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {status}
        </span>
      );
    },
    size: 100,
  },
];

export function PlatformAuditLogsTable({
  workspaceId,
  onClearWorkspaceFilter,
  hideWorkspaceFilter,
}: {
  workspaceId?: string;
  onClearWorkspaceFilter?: () => void;
  /** Hide workspace filter banner when embedded on workspace detail */
  hideWorkspaceFilter?: boolean;
}) {
  const listState = usePlatformAdminListQuery({
    defaultSort: "occurredAt",
    defaultOrder: "desc",
    allowedSortFields: AUDIT_SORT_FIELDS,
    filterColumns: AUDIT_FILTER_COLUMNS,
  });

  const { data, isLoading } = useGetPlatformAuditLogs({
    page: listState.query.page,
    limit: listState.query.limit,
    sort: listState.query.sort,
    order: listState.query.order,
    search: workspaceId ? undefined : listState.query.search,
    workspaceId,
  });

  const paginationInfo = mapPlatformPagination(data?.pagination);

  const sorting = useMemo<SortingState>(
    () => [
      { id: listState.query.sort, desc: listState.query.order === "desc" },
    ],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (!paginationInfo) return;
    if (paginationInfo.totalPages === 0) {
      if (listState.query.page !== 1) listState.setPage(1);
      return;
    }
    if (listState.query.page > paginationInfo.totalPages) {
      listState.setPage(1);
    }
  }, [listState.query.page, listState.setPage, paginationInfo]);

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 1,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const next = nextSorting[0];
      if (!next) return;
      listState.setSort(next.id, next.desc ? "desc" : "asc");
    },
    enableSortingRemoval: false,
    state: { sorting },
  });

  return (
    <div className="w-full space-y-2">
      {workspaceId && !hideWorkspaceFilter ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing audit events for workspace{" "}
            <span className="font-mono text-xs text-foreground">
              {workspaceId}
            </span>
          </p>
          {onClearWorkspaceFilter ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onClearWorkspaceFilter}
            >
              Clear filter
            </Button>
          ) : null}
        </div>
      ) : !workspaceId ? (
        <Input
          placeholder="Search audit logs…"
          value={listState.searchDraft}
          onChange={(event) => listState.setSearchDraft(event.target.value)}
          className="max-w-sm"
        />
      ) : null}

      <div className="overflow-hidden border-b border-border bg-background">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-10 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0"
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
              <TableBodySkeleton columnCount={TABLE_COLUMN_COUNT} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={TABLE_COLUMN_COUNT}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icon
                      icon={ProfileIcon}
                      size={24}
                      strokeWidth={2}
                      className="text-muted-foreground/30"
                    />
                    <p className="text-sm">No audit events found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex h-10 w-full items-center">
        <WorkspaceListPagination
          pagination={paginationInfo}
          onPageChange={listState.setPage}
        />
      </div>
    </div>
  );
}
