"use client";

import type { ReactNode } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { CheckListIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
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
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { useGetUsageEvents } from "@/hooks/platform-admin/useGetUsageEvents";
import { useRetryUsageEventSync } from "@/hooks/platform-admin/useRetryUsageEventSync";
import { mapPlatformPagination } from "@/lib/platform-admin-list-query";
import {
  useWorkspaceListQuery,
  WORKSPACE_LIST_LIMIT,
} from "@/lib/workspace-list-query";
import { getErrorMessage } from "@/lib/api-error";
import type { UsageEvent, UsageEventSource } from "@/types/billing";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";

const USAGE_EVENTS_TOOLTIP =
  "Ledger entries from exports, uploads, and adjustments.";

const SOURCE_LABELS: Record<UsageEventSource, string> = {
  user_activation: "Seat activation",
  export_job: "Export",
  upload_commit: "Upload",
  platform_adjustment: "Adjustment",
};

const RETRYABLE_SYNC_STATUSES = new Set([
  "pending",
  "failed",
  "pending_link",
]);

const TABLE_COLUMN_COUNT = 5;

function eventTypeLabel(event: UsageEvent): string {
  return SOURCE_LABELS[event.source] ?? event.metric.replace(/_/g, " ");
}

function deduplicationId(event: UsageEvent): string {
  return event.chargebeeSync?.deduplicationId ?? event.sourceId;
}

export function PlatformUsageEventsTable({
  workspaceId,
  headerActions,
}: {
  workspaceId: string;
  headerActions?: ReactNode;
}) {
  const listState = useWorkspaceListQuery({
    defaultSort: "occurredAt",
    defaultOrder: "desc",
    allowedSortFields: ["occurredAt"],
    filterColumns: [],
  });

  const { data, isLoading, isError, error } = useGetUsageEvents(workspaceId, {
    page: listState.query.page,
    limit: WORKSPACE_LIST_LIMIT,
  });
  const { retryEvent, retryAll } = useRetryUsageEventSync(workspaceId);

  const paginationInfo = mapPlatformPagination(data?.pagination);

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

  const columns = useMemo<ColumnDef<UsageEvent>[]>(
    () => [
      {
        accessorKey: "occurredAt",
        header: () => (
          <span className="whitespace-nowrap text-muted-foreground/60">
            Occurred
          </span>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {formatToLocalDateTime(row.original.occurredAt)}
          </span>
        ),
        size: 180,
      },
      {
        id: "event",
        accessorFn: (row) => eventTypeLabel(row),
        header: () => (
          <span className="whitespace-nowrap text-muted-foreground/60">
            Event
          </span>
        ),
        cell: ({ row }) => (
          <span className="text-sm">{eventTypeLabel(row.original)}</span>
        ),
        size: 140,
      },
      {
        id: "chargebeeSync",
        accessorFn: (row) => row.chargebeeSync?.status ?? "",
        header: () => (
          <span className="whitespace-nowrap text-muted-foreground/60">
            Chargebee sync
          </span>
        ),
        cell: ({ row }) => {
          const status = row.original.chargebeeSync?.status;
          if (!status) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }
          return (
            <Badge variant="secondary" className="capitalize">
              {status.replace(/_/g, " ")}
            </Badge>
          );
        },
        size: 160,
      },
      {
        id: "dedupId",
        accessorFn: (row) => deduplicationId(row),
        header: () => (
          <span className="whitespace-nowrap text-muted-foreground/60">
            Dedup ID
          </span>
        ),
        cell: ({ row }) => (
          <span
            className="block truncate font-mono text-xs"
            title={deduplicationId(row.original)}
          >
            {deduplicationId(row.original)}
          </span>
        ),
        size: 280,
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
          const status = row.original.chargebeeSync?.status;
          if (!status || !RETRYABLE_SYNC_STATUSES.has(status)) return null;
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => retryEvent.mutate(row.original.id)}
              disabled={retryEvent.isPending}
            >
              Retry
            </Button>
          );
        },
        size: 100,
      },
    ],
    [retryEvent],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 1,
  });

  if (isError) {
    return (
      <div className="flex flex-col">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
          <div className="flex min-w-0 items-center gap-2">
            <p className="shrink-0 text-sm font-medium">Usage events</p>
            <InfoTooltip content={USAGE_EVENTS_TOOLTIP} />
          </div>
          {headerActions}
        </div>
        <p className="p-4 text-sm text-destructive">
          {getErrorMessage(error, "Unable to load usage events.")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="shrink-0 text-sm font-medium">Usage events</p>
          <InfoTooltip content={USAGE_EVENTS_TOOLTIP} />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => retryAll.mutate()}
            disabled={retryAll.isPending}
          >
            {retryAll.isPending ? "Retrying…" : "Retry failed syncs"}
          </Button>
          {headerActions}
        </div>
      </div>

      <div className="w-full overflow-hidden border-b border-border">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="h-10 hover:bg-transparent"
              >
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
                    <TableCell key={cell.id} className="py-3">
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
                      icon={CheckListIcon}
                      size={24}
                      strokeWidth={2}
                      className="text-muted-foreground/30"
                    />
                    <p className="text-sm">No usage events recorded yet</p>
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
