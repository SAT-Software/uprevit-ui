"use client";

import {
  AlertCircleIcon,
  CancelCircleIcon,
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  MessageDone01Icon,
  MessageEdit01Icon,
  PlayIcon,
  StopCircleIcon,
  TaskDone01Icon,
  WorkHistoryIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useWorkflowHistory } from "@/hooks/workflow/useWorkflows";
import type {
  WorkflowDetail,
  WorkflowEvent,
  WorkflowEventType,
} from "@/types/workflow";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";

const EVENT_STYLES: Record<
  WorkflowEventType,
  { icon: typeof PlayIcon; className: string; verb: string }
> = {
  started: {
    icon: PlayIcon,
    className: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    verb: "started the workflow",
  },
  approved: {
    icon: CheckmarkCircle02Icon,
    className: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
    verb: "approved",
  },
  changes_requested: {
    icon: MessageEdit01Icon,
    className:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
    verb: "requested changes",
  },
  change_request_addressed: {
    icon: MessageDone01Icon,
    className: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
    verb: "addressed a change request",
  },
  ready_to_complete: {
    icon: TaskDone01Icon,
    className: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    verb: "made the workflow ready to complete",
  },
  completed: {
    icon: CheckmarkBadge01Icon,
    className:
      "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    verb: "completed the workflow",
  },
  rejected: {
    icon: CancelCircleIcon,
    className: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    verb: "rejected the workflow",
  },
  cancelled: {
    icon: StopCircleIcon,
    className: "bg-muted text-muted-foreground",
    verb: "cancelled the workflow",
  },
};

const plural = (count: number, noun: string) =>
  `${count} ${count === 1 ? noun : `${noun}s`}`;

function eventContext(event: WorkflowEvent, workflow: WorkflowDetail) {
  const product = event.lineageId
    ? workflow.products.find((item) => item.lineageId === event.lineageId)
    : undefined;
  if (event.type === "changes_requested") {
    const scope = `on ${product ? product.name : "the whole workflow"}`;
    return `as ${event.data.functionLabel} · ${scope}${event.data.reopened ? " · back to In Review" : ""}`;
  }
  if (event.type === "change_request_addressed") {
    return `from ${event.data.requestedBy} · on ${product ? product.name : "the whole workflow"}`;
  }
  if (event.type === "ready_to_complete") return "with the final approval";
  if (event.type === "completed") {
    const released = `${plural(event.data.productCount ?? 0, "Product")} released`;
    return event.data.automatic
      ? `automatically with the final approval · ${released}`
      : released;
  }
  if (event.type === "started") {
    const { productCount = 0, assignmentCount = 0 } = event.data;
    return `${plural(productCount, "Product")}, ${plural(assignmentCount, "assignment")}`;
  }
  if (!event.data.functionLabel) return null;
  return `as ${event.data.functionLabel}${product ? ` · ${product.name}` : ""}`;
}

function HistoryItem({
  event,
  workflow,
  isLast,
}: {
  event: WorkflowEvent;
  workflow: WorkflowDetail;
  isLast: boolean;
}) {
  const style = EVENT_STYLES[event.type];
  const context = eventContext(event, workflow);
  const note = event.reason ?? event.comment;

  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast ? (
        <span
          className="absolute top-8 bottom-0 left-3.5 w-px bg-border"
          aria-hidden="true"
        />
      ) : null}
      <span
        className={cn(
          "relative flex size-7 shrink-0 items-center justify-center rounded-full",
          style.className,
        )}
      >
        <Icon icon={style.icon} size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 space-y-1 pt-1">
        <p className="text-sm leading-5">
          <span className="font-medium" title={event.actorSnapshot.email}>
            {event.actorSnapshot.name}
          </span>{" "}
          {style.verb}
          {context ? (
            <span className="text-muted-foreground"> {context}</span>
          ) : null}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatToLocalDateTime(event.createdAt)}
        </p>
        {note ? (
          <p className="whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground/80">
            {event.reason ? (
              <span className="font-medium text-foreground">Reason: </span>
            ) : null}
            {note}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function WorkflowHistoryTab({ workflow }: { workflow: WorkflowDetail }) {
  const isDraft = workflow.status === "draft";
  const { data, isPending, isError } = useWorkflowHistory(
    workflow._id,
    workflow.status,
  );
  const events = data?.events ?? [];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-4">
        <p className="text-sm font-medium">History</p>
        <InfoTooltip content="Every decision and status change, newest first. Names and emails are saved as they were at the time." />
      </div>
      {isDraft ? (
        <EmptyHistory text="History starts when the workflow is started." />
      ) : isPending ? (
        <div className="space-y-4 p-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1 space-y-1.5 pt-1">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Icon icon={AlertCircleIcon} size={16} />
          Failed to load history
        </div>
      ) : events.length === 0 ? (
        <EmptyHistory text="No events yet." />
      ) : (
        <ol className="p-4">
          {events.map((event, index) => (
            <HistoryItem
              key={event._id}
              event={event}
              workflow={workflow}
              isLast={index === events.length - 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function EmptyHistory({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
      <Icon icon={WorkHistoryIcon} size={16} />
      {text}
    </div>
  );
}
