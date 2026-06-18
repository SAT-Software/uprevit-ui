"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { IconType } from "react-icons";
import { useEffect, useMemo } from "react";
import {
  PiClockDuotone,
  PiFingerprintDuotone,
  PiListChecksDuotone,
  PiPlugsConnectedDuotone,
} from "react-icons/pi";
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

const StaticHeader = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: IconType;
}) => (
  <div className="flex h-8 items-center gap-2">
    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
    <span className="whitespace-nowrap">{title}</span>
  </div>
);

export function PlatformUsageEventsTable({
  workspaceId,
}: {
  workspaceId: string;
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
        header: () => <StaticHeader title="Occurred" icon={PiClockDuotone} />,
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
        header: () => <StaticHeader title="Event" icon={PiListChecksDuotone} />,
        cell: ({ row }) => (
          <span className="text-sm">{eventTypeLabel(row.original)}</span>
        ),
        size: 140,
      },
      {
        id: "chargebeeSync",
        accessorFn: (row) => row.chargebeeSync?.status ?? "",
        header: () => (
          <StaticHeader title="Chargebee sync" icon={PiPlugsConnectedDuotone} />
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
          <StaticHeader title="Dedup ID" icon={PiFingerprintDuotone} />
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
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Unable to load usage events.")}
      </p>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => retryAll.mutate()}
          disabled={retryAll.isPending}
        >
          {retryAll.isPending ? "Retrying…" : "Retry failed syncs"}
        </Button>
      </div>

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
                  No usage events recorded yet
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
