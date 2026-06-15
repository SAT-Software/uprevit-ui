"use client";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { useGetUsageEvents } from "@/hooks/platform-admin/useGetUsageEvents";
import { useRetryUsageEventSync } from "@/hooks/platform-admin/useRetryUsageEventSync";
import { Button } from "@uprevit/ui/components/ui/button";
import { getErrorMessage } from "@/lib/api-error";
import type { UsageEvent, UsageEventSource } from "@/types/billing";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";

const SOURCE_LABELS: Record<UsageEventSource, string> = {
  user_activation: "Seat activation",
  export_job: "Export",
  upload_commit: "Upload",
  platform_adjustment: "Adjustment",
};

function eventTypeLabel(event: UsageEvent): string {
  return SOURCE_LABELS[event.source] ?? event.metric.replace(/_/g, " ");
}

const RETRYABLE_SYNC_STATUSES = new Set([
  "pending",
  "failed",
  "pending_link",
]);

function deduplicationId(event: UsageEvent): string {
  return event.chargebeeSync?.deduplicationId ?? event.sourceId;
}

export function PlatformUsageEventsTable({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { data, isLoading, isError, error } = useGetUsageEvents(workspaceId);
  const { retryEvent } = useRetryUsageEventSync(workspaceId);

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-lg" />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Unable to load usage events.")}
      </p>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No usage events recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Occurred</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Chargebee sync</TableHead>
            <TableHead>Dedup ID</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="whitespace-nowrap text-sm">
                {formatToLocalDateTime(event.occurredAt)}
              </TableCell>
              <TableCell className="text-sm">{eventTypeLabel(event)}</TableCell>
              <TableCell>
                {event.chargebeeSync?.status ? (
                  <Badge variant="secondary" className="capitalize">
                    {event.chargebeeSync.status.replace(/_/g, " ")}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="max-w-[220px] truncate font-mono text-xs">
                {deduplicationId(event)}
              </TableCell>
              <TableCell>
                {event.chargebeeSync?.status &&
                RETRYABLE_SYNC_STATUSES.has(event.chargebeeSync.status) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => retryEvent.mutate(event.id)}
                    disabled={retryEvent.isPending}
                  >
                    Retry
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
