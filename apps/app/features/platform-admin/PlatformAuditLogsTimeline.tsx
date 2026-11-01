"use client";

import { EmptyState } from "@/components/common/EmptyState";
import {
  CheckListIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { ErrorState } from "@/components/common/ErrorState";
import {
  Avatar,
  AvatarFallback,
} from "@uprevit/ui/components/ui/avatar";
import {
  Frame,
  FrameHeader,
} from "@uprevit/ui/components/ui/frame";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@uprevit/ui/components/ui/timeline";
import { cn } from "@uprevit/ui/lib/utils";
import type { PlatformAuditLogItem } from "@/types/platform-admin";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { ActivityLogsTimelineSkeleton } from "@/features/workspace/logs/ActivityLogsTimelineSkeleton";

type PlatformAuditLogsTimelineProps = {
  logs: PlatformAuditLogItem[];
  className?: string;
  isInitialLoading?: boolean;
  isFetchingNextPage?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

function getActorInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function PlatformAuditLogsTimeline({
  logs,
  className,
  isInitialLoading = false,
  isFetchingNextPage = false,
  isError = false,
  onRetry,
}: PlatformAuditLogsTimelineProps) {
  if (isInitialLoading) {
    return <ActivityLogsTimelineSkeleton className={className} />;
  }

  if (isError) {
    return (
      <ErrorState
        variant="panel"
        embedded
        icon={Clock01Icon}
        title="Failed to load audit logs"
        onRetry={onRetry}
        className={cn("min-h-48", className)}
      />
    );
  }

  if (!logs.length) {
    return (
      <EmptyState
        embedded
        icon={Clock01Icon}
        title="No audit events found"
        className={cn("min-h-48", className)}
      />
    );
  }


  return (
    <div className={className}>
      <Timeline defaultValue={logs.length}>
        {logs.map((log) => {
          const actorName =
            log.actor.name || log.actor.email || "Unknown operator";

          return (
            <TimelineItem key={log.id} className="ms-10 pb-10">
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.5rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
                <div className="flex min-w-0 flex-col gap-1">
                  <TimelineTitle className="text-sm font-medium">
                    {log.summary}
                    {log.status === "failed" ? (
                      <span className="ml-1.5 text-xs font-normal text-destructive">
                        · Failed
                      </span>
                    ) : null}
                  </TimelineTitle>
                </div>
                <TimelineIndicator
                  className={cn(
                    "bg-muted/80 text-muted-foreground group-data-completed/timeline-item:bg-muted group-data-completed/timeline-item:text-muted-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7 ring-border ring-2",
                    log.status === "failed" && "text-destructive",
                  )}
                >
                  <Icon icon={CheckListIcon} size={14} strokeWidth={2} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent className="mt-2">
                <Frame stacked dense spacing="sm">
                  <FrameHeader className="flex flex-row items-center justify-between gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[10px]">
                            {getActorInitials(actorName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-xs font-medium text-muted-foreground">
                          {actorName}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatToLocalDateTime(log.occurredAt)}
                      </span>
                    </div>
                  </FrameHeader>
                </Frame>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
      {isFetchingNextPage ? (
        <div className="flex items-center justify-center py-4 text-muted-foreground">
          <Spinner className="size-4" />
        </div>
      ) : null}
    </div>
  );
}
