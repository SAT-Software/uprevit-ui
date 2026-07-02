"use client";

import {
  AddSquareIcon,
  Delete02Icon,
  PropertyEditIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@uprevit/ui/components/ui/collapsible";
import {
  Frame,
  FrameHeader,
  FramePanel,
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
import { ChevronRightIcon } from "lucide-react";
import { PiCircleNotchDuotone } from "react-icons/pi";

import { AuditLogV2, AuditLogV2Change } from "@/types/audit-log";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";

type ActivityLogsTimelineProps = {
  logs: AuditLogV2[];
  className?: string;
  isInitialLoading?: boolean;
  isRefreshing?: boolean;
  isFetchingNextPage?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

const formatChangeValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const hasChangeValue = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.length > 0;
  return true;
};

const formatChangePath = (path: string) =>
  path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(/[._]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

type ChangeValueVariant = "old" | "new" | "added" | "deleted";

const changeValueStyles: Record<
  ChangeValueVariant,
  { circle: string; text: string }
> = {
  old: {
    circle:
      "border-[var(--badge-warning-foreground)] bg-[var(--badge-warning-foreground)]/25",
    text: "text-[var(--badge-warning-foreground)]",
  },
  new: {
    circle: "border-success bg-success/25",
    text: "text-success",
  },
  added: {
    circle:
      "border-[var(--badge-info-foreground)] bg-[var(--badge-info-foreground)]/25",
    text: "text-[var(--badge-info-foreground)]",
  },
  deleted: {
    circle: "border-destructive bg-destructive/25",
    text: "text-destructive",
  },
};

function ChangeValueCircle({ variant }: { variant: ChangeValueVariant }) {
  return (
    <div
      className={cn(
        "size-2.5 shrink-0 rounded-full border-2",
        changeValueStyles[variant].circle,
      )}
    />
  );
}

function ChangeValueRow({
  variant,
  value,
}: {
  variant: ChangeValueVariant;
  value: unknown;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <ChangeValueCircle variant={variant} />
      <p
        className={cn(
          "min-w-0 flex-1 text-xs leading-snug break-all",
          changeValueStyles[variant].text,
        )}
      >
        {formatChangeValue(value)}
      </p>
    </div>
  );
}

function ActivityLogChangeItem({ change }: { change: AuditLogV2Change }) {
  const hasFrom = hasChangeValue(change.from);
  const hasTo = hasChangeValue(change.to);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground/80">
        {formatChangePath(change.path)}
      </p>
      {hasFrom && hasTo ? (
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2">
          <div className="flex items-center justify-center self-center">
            <ChangeValueCircle variant="old" />
          </div>
          <p
            className={cn(
              "flex min-h-2 min-w-0 items-center text-xs leading-snug break-all",
              changeValueStyles.old.text,
            )}
          >
            {formatChangeValue(change.from)}
          </p>

          <div className="flex justify-center">
            <div className="h-2 w-px bg-border" />
          </div>
          <div aria-hidden="true" />

          <div className="flex items-center justify-center self-center">
            <ChangeValueCircle variant="new" />
          </div>
          <p
            className={cn(
              "flex min-h-2 min-w-0 items-center text-xs leading-snug break-all",
              changeValueStyles.new.text,
            )}
          >
            {formatChangeValue(change.to)}
          </p>
        </div>
      ) : hasTo ? (
        <ChangeValueRow variant="added" value={change.to} />
      ) : hasFrom ? (
        <ChangeValueRow variant="deleted" value={change.from} />
      ) : null}
    </div>
  );
}

function ActionIcon({ action }: { action: AuditLogV2["action"] }) {
  if (action === "create") {
    return <HugeiconsIcon icon={AddSquareIcon} size={14} strokeWidth={2} />;
  }
  if (action === "update") {
    return <HugeiconsIcon icon={PropertyEditIcon} size={14} strokeWidth={2} />;
  }
  return <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} />;
}

function getActorInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function ActivityLogsTimeline({
  logs,
  className,
  isInitialLoading = false,
  isRefreshing = false,
  isFetchingNextPage = false,
  isError = false,
  errorMessage,
}: ActivityLogsTimelineProps) {
  if (isInitialLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground",
          className,
        )}
      >
        <Spinner className="size-5" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "flex h-28 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-4 text-center text-sm text-destructive",
          className,
        )}
      >
        {errorMessage || "Failed to load logs"}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div
        className={cn(
          "flex h-28 items-center justify-center rounded-xl border border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        No activity logs found
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      {isRefreshing ? (
        <div className=" mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <PiCircleNotchDuotone className="h-3.5 w-3.5 animate-spin" />
          Refreshing...
        </div>
      ) : null}
      <Timeline defaultValue={logs.length}>
        {logs.map((log) => {
          const changes = log.changes ?? [];
          const actorName = log.actor?.name || "Unknown";

          return (
            <TimelineItem key={log._id} className=" ms-10 pb-10">
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.5rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
                <div className="flex items-center gap-2">
                  <TimelineTitle className="text-sm font-medium">
                    {log.summary}
                  </TimelineTitle>
                </div>
                <TimelineIndicator
                  className={cn(
                    "bg-muted/80 text-muted-foreground group-data-completed/timeline-item:bg-muted group-data-completed/timeline-item:text-muted-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7 ring-border ring-2",
                  )}
                >
                  <ActionIcon action={log.action} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent className="mt-2">
                <Frame stacked dense spacing="sm">
                  <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger className="flex w-full">
                      <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-5">
                              {log.actor?.profileAvatar ? (
                                <AvatarImage
                                  src={log.actor.profileAvatar}
                                  alt={actorName}
                                />
                              ) : null}
                              <AvatarFallback className="text-[10px]">
                                {getActorInitials(actorName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground text-xs font-medium">
                              {actorName}
                            </span>
                          </div>

                          <span className="text-xs">
                            {formatToLocalDateTime(log.occurredAt)}
                          </span>
                        </div>
                        <ChevronRightIcon className="text-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </FrameHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <FramePanel>
                        {changes.length > 0 ? (
                          <div className="space-y-4">
                            {changes.map((change, index) => (
                              <ActivityLogChangeItem
                                key={`${log._id}-${change.path}-${index}`}
                                change={change}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground/60">
                            No changes found
                          </p>
                        )}
                      </FramePanel>
                    </CollapsibleContent>
                  </Collapsible>
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
