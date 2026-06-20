"use client";

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { IconType } from "react-icons";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiClockDuotone,
  PiListChecksDuotone,
  PiNoteDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";
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
  icon: Icon,
}: {
  column: Column<PlatformAuditLogItem, unknown>;
  title: string;
  icon: IconType;
}) => (
  <button
    type="button"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-8 data-[state=open]:bg-accent hover:bg-muted/50 w-full flex justify-between items-center cursor-pointer"
  >
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="whitespace-nowrap">{title}</span>
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

const columns: ColumnDef<PlatformAuditLogItem>[] = [
  {
    accessorKey: "occurredAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="When" icon={PiClockDuotone} />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(row.getValue("occurredAt")).toLocaleString()}
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <SortableHeader column={column} title="Action" icon={PiListChecksDuotone} />
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
        <PiNoteDuotone className="h-4 w-4 text-muted-foreground" />
        <span>Summary</span>
      </div>
    ),
    cell: ({ row }) => <span className="text-sm">{row.getValue("summary")}</span>,
    size: 280,
  },
  {
    id: "actor",
    accessorFn: (row) => row.actor.name || row.actor.email || "—",
    enableSorting: false,
    header: () => (
      <div className="flex h-8 items-center gap-2">
        <PiUserCircleDuotone className="h-4 w-4 text-muted-foreground" />
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
      <SortableHeader column={column} title="Status" icon={PiListChecksDuotone} />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={
            status === "failed" ? "text-destructive text-sm" : "text-muted-foreground text-sm"
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
    <div className="space-y-2 w-full">
      {workspaceId && !hideWorkspaceFilter ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing audit events for workspace{" "}
            <span className="font-mono text-xs text-foreground">{workspaceId}</span>
          </p>
          {onClearWorkspaceFilter ? (
            <Button size="sm" variant="outline" onClick={onClearWorkspaceFilter}>
              Clear filter
            </Button>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link href="/platform-admin/audit-logs">Clear filter</Link>
            </Button>
          )}
        </div>
      ) : !workspaceId ? (
        <Input
          placeholder="Search audit logs…"
          value={listState.searchDraft}
          onChange={(event) => listState.setSearchDraft(event.target.value)}
          className="max-w-sm"
        />
      ) : null}

      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
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
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No audit events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <WorkspaceListPagination
        pagination={paginationInfo}
        onPageChange={listState.setPage}
      />
    </div>
  );
}
