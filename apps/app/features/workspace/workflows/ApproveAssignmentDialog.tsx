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
  const isAgain = assignment.decision === "approved";
  const { mutate: decide, isPending } = useDecideWorkflowAssignment(
    workflowId,
    { approveAgain: isAgain },
  );

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isAgain ? "Approve again" : "Approve"}
      variant="confirm"
      heading={
        isAgain
          ? `Approve the latest content for ${groupLabel}?`
          : `Approve for ${groupLabel}?`
      }
      message={
        isAgain
          ? "Your earlier approval still counts. This is optional and records a new approval on the latest content in the workflow history."
          : "Your approval is recorded in the workflow history with your name and the time."
      }
      icon={ThumbsUpIcon}
      noteLabel="Comment"
      noteTooltip="Visible to everyone on this workflow."
      notePlaceholder="Add a comment for the team"
      required={false}
      submitLabel={isAgain ? "Approve again" : "Approve"}
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
