"use client";

import { Alert01Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";
import { useDecideWorkflowAssignment } from "@/hooks/workflow/useWorkflows";
import type { WorkflowAssignment, WorkflowDetail } from "@/types/workflow";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";

export function RejectWorkflowDialog({
  workflow,
  assignment,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "numberLabel">;
  assignment: WorkflowAssignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: decide, isPending } = useDecideWorkflowAssignment(
    workflow._id,
  );

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reject"
      variant="confirm-destructive"
      heading={`Reject ${workflow.numberLabel}?`}
      message="This ends the whole workflow for everyone. Its Products go back to Submitted, and a new workflow is needed to approve them."
      icon={Alert01Icon}
      noteLabel="Reason"
      noteTooltip="Tell the team why. Everyone on this workflow will see it."
      notePlaceholder="Explain what needs to change"
      required
      submitLabel="Reject Workflow"
      submitLoadingLabel="Rejecting…"
      submitIcon={CancelCircleIcon}
      submitVariant="destructive"
      isPending={isPending}
      onSubmit={(reason) =>
        decide(
          { assignmentId: assignment._id, decision: "reject", reason },
          { onSuccess: () => onOpenChange(false) },
        )
      }
    />
  );
}
