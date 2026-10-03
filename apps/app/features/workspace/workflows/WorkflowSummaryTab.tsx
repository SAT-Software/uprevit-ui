"use client";

import { useState } from "react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import type { WorkflowDetail } from "@/types/workflow";
import { WORKFLOW_COMPLETION_MODE_OPTIONS } from "@/utils/workflow/workflow-labels";
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

export function WorkflowSummaryTab({ workflow }: { workflow: WorkflowDetail }) {
  const [editOpen, setEditOpen] = useState(false);
  const completionMode = WORKFLOW_COMPLETION_MODE_OPTIONS.find(
    (option) => option.value === workflow.completionMode,
  );

  return (
    <div className="flex flex-col gap-4">
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
          <DetailItem label="Created">
            {formatToLocalDateTime(workflow.dates.createdAt)}
          </DetailItem>
          <DetailItem label="Completion" info={completionMode?.description}>
            {completionMode?.label}
          </DetailItem>
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
        <WorkflowReadinessChecklist workflowId={workflow._id} />
      ) : null}

      {workflow.canEdit ? (
        <UpdateWorkflowDialog
          workflow={workflow}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </div>
  );
}
