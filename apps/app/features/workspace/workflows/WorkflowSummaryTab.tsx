"use client";

import { useState } from "react";
import {
  CancelCircleIcon,
  CheckmarkBadge01Icon,
  PencilEdit02Icon,
  StopCircleIcon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { cn } from "@uprevit/ui/lib/utils";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import type { WorkflowDetail } from "@/types/workflow";
import { WORKFLOW_COMPLETION_MODE_OPTIONS } from "@/utils/workflow/workflow-labels";
import { StartWorkflowDialog } from "./StartWorkflowDialog";
import { UpdateWorkflowDialog } from "./WorkflowDetailsDialog";
import { WorkflowStatusBadge } from "./WorkflowStatusBadge";
import { WorkflowReadinessChecklist } from "./WorkflowReadinessChecklist";

function DetailItem({
  label,
  info,
  children,
}: {
  label: string;
  info?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-0.5">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {label}
        {info ? <InfoTooltip content={info} /> : null}
      </p>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

const MILESTONES: { key: keyof WorkflowDetail["dates"]; label: string }[] = [
  { key: "createdAt", label: "Created" },
  { key: "startedAt", label: "Started" },
  { key: "readyToCompleteAt", label: "Ready to Complete" },
  { key: "completedAt", label: "Completed" },
  { key: "rejectedAt", label: "Rejected" },
  { key: "cancelledAt", label: "Cancelled" },
];

const BANNER_ICON_STYLES = {
  green:
    "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  red: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
};

function getOutcome(workflow: WorkflowDetail) {
  const { status, dates, endedBy, endReason } = workflow;
  if (status === "completed") {
    return {
      tone: "green" as const,
      icon: CheckmarkBadge01Icon,
      title: "Completed",
      date: dates.completedAt,
      note: "The Products are Released. This workflow is now a read-only record.",
    };
  }
  if (status === "ready_to_complete") {
    return {
      tone: "blue" as const,
      icon: TaskDone01Icon,
      title: "Everyone approved",
      date: dates.readyToCompleteAt,
      note: workflow.canComplete
        ? "Complete the workflow to release its Products."
        : "Waiting for the Initiator or an admin to complete it and release the Products.",
    };
  }
  if (status === "rejected" || status === "cancelled") {
    const rejected = status === "rejected";
    return {
      tone: "red" as const,
      icon: rejected ? CancelCircleIcon : StopCircleIcon,
      title: `${rejected ? "Rejected" : "Cancelled"}${endedBy ? ` by ${endedBy.name}` : ""}`,
      date: rejected ? dates.rejectedAt : dates.cancelledAt,
      reason: endReason,
      note: "The Products went back to Submitted. Create a new workflow to approve them.",
    };
  }
  return null;
}

function WorkflowOutcomeBanner({ workflow }: { workflow: WorkflowDetail }) {
  const outcome = getOutcome(workflow);
  if (!outcome) return null;

  return (
    <section className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          BANNER_ICON_STYLES[outcome.tone],
        )}
      >
        <Icon icon={outcome.icon} size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 space-y-1 pt-0.5">
        <p className="text-sm font-medium">
          {outcome.title}
          {outcome.date ? (
            <span className="font-normal text-muted-foreground">
              {" · "}
              {formatToLocalDateTime(outcome.date)}
            </span>
          ) : null}
        </p>
        {outcome.reason ? (
          <p className="whitespace-pre-wrap break-words text-sm text-foreground/80">
            {outcome.reason}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">{outcome.note}</p>
      </div>
    </section>
  );
}

export function WorkflowSummaryTab({ workflow }: { workflow: WorkflowDetail }) {
  const [editOpen, setEditOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const completionMode = WORKFLOW_COMPLETION_MODE_OPTIONS.find(
    (option) => option.value === workflow.completionMode,
  );

  return (
    <div className="flex flex-col gap-4">
      <WorkflowOutcomeBanner workflow={workflow} />

      <section className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex h-10 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
          <p className="text-sm font-medium">Details</p>
          {workflow.canEdit ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Icon icon={PencilEdit02Icon} size={16} />
              Edit
            </Button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 sm:grid-cols-3">
          <DetailItem label="Number">
            <span className="font-mono">{workflow.numberLabel}</span>
          </DetailItem>
          <DetailItem label="Name">
            <span className="block truncate" title={workflow.name}>
              {workflow.name}
            </span>
          </DetailItem>
          <DetailItem label="Status">
            <WorkflowStatusBadge status={workflow.status} />
          </DetailItem>
          <DetailItem label="Initiator">
            <span title={workflow.initiator.email}>
              {workflow.initiator.name}
            </span>
          </DetailItem>
          <DetailItem label="Completion" info={completionMode?.description}>
            {completionMode?.label}
          </DetailItem>
          {MILESTONES.map(({ key, label }) => {
            const date = workflow.dates[key];
            return date ? (
              <DetailItem key={key} label={label}>
                {formatToLocalDateTime(date)}
              </DetailItem>
            ) : null;
          })}
          {workflow.description ? (
            <div className="sm:col-span-3">
              <DetailItem label="Description">
                <p className="whitespace-pre-wrap font-normal">
                  {workflow.description}
                </p>
              </DetailItem>
            </div>
          ) : null}
        </div>
      </section>

      {workflow.status === "draft" ? (
        <WorkflowReadinessChecklist
          workflowId={workflow._id}
          onStart={workflow.canEdit ? () => setStartOpen(true) : undefined}
        />
      ) : null}

      {workflow.canEdit ? (
        <>
          <UpdateWorkflowDialog
            workflow={workflow}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <StartWorkflowDialog
            workflow={workflow}
            open={startOpen}
            onOpenChange={setStartOpen}
          />
        </>
      ) : null}
    </div>
  );
}
