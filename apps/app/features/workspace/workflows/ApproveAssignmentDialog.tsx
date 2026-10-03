"use client";

import {
  CheckmarkCircle02Icon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { useDecideWorkflowAssignment } from "@/hooks/workflow/useWorkflows";
import type { WorkflowAssignment } from "@/types/workflow";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";

export function ApproveAssignmentDialog({
  workflowId,
  assignment,
  groupLabel,
  open,
  onOpenChange,
}: {
  workflowId: string;
  assignment: WorkflowAssignment;
  groupLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: decide, isPending } = useDecideWorkflowAssignment(workflowId);

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Approve"
      variant="confirm"
      heading={`Approve for ${groupLabel}?`}
      message="Your approval is recorded in the workflow history with your name and the time."
      icon={ThumbsUpIcon}
      noteLabel="Comment"
      noteTooltip="Visible to everyone on this workflow."
      notePlaceholder="Add a comment for the team"
      required={false}
      submitLabel="Approve"
      submitLoadingLabel="Approving…"
      submitIcon={CheckmarkCircle02Icon}
      isPending={isPending}
      onSubmit={(comment) =>
        decide(
          {
            assignmentId: assignment._id,
            decision: "approve",
            ...(comment && { comment }),
          },
          { onSuccess: () => onOpenChange(false) },
        )
      }
    />
  );
}
