"use client";

import { Alert01Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";
import { useCancelWorkflow } from "@/hooks/workflow/useWorkflows";
import type { WorkflowDetail } from "@/types/workflow";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";

export function CancelWorkflowDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "numberLabel">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: cancel, isPending } = useCancelWorkflow(workflow._id);

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel Workflow"
      variant="confirm-destructive"
      heading={`Cancel ${workflow.numberLabel}?`}
      message="Pending approvals stop and the Products go back to Submitted. A cancelled workflow can't be restarted."
      icon={Alert01Icon}
      noteLabel="Reason"
      noteTooltip="Everyone on this workflow will see it."
      notePlaceholder="Explain why this workflow is cancelled"
      required
      submitLabel="Cancel Workflow"
      submitLoadingLabel="Cancelling…"
      submitIcon={CancelCircleIcon}
      submitVariant="destructive"
      isPending={isPending}
      onSubmit={(reason) =>
        cancel(reason, { onSuccess: () => onOpenChange(false) })
      }
    />
  );
}
