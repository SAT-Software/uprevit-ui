"use client";

import { useId, useState } from "react";
import { MessageEdit01Icon } from "@hugeicons/core-free-icons";
import { Field } from "@uprevit/ui/components/ui/field";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { useDecideWorkflowAssignment } from "@/hooks/workflow/useWorkflows";
import type {
  WorkflowAssignment,
  WorkflowDetail,
  WorkflowDiscussionScope,
} from "@/types/workflow";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";
import { WorkflowScopeSelect } from "./WorkflowScope";

export function RequestChangesDialog({
  workflow,
  assignment,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "products">;
  assignment: WorkflowAssignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const scopeId = `request-changes-scope-${useId()}`;
  const { mutate: decide, isPending } = useDecideWorkflowAssignment(
    workflow._id,
  );
  const [scope, setScope] = useState<WorkflowDiscussionScope>(() =>
    assignment.lineageId
      ? { type: "product", lineageId: assignment.lineageId }
      : { type: "package" },
  );

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Request Changes"
      variant="confirm-destructive"
      heading="Request changes?"
      message={
        assignment.decision === "approved"
          ? "Your earlier approval stops counting but stays in the history. The workflow can't complete until your request is addressed and you decide again."
          : "Other approvers can keep deciding. The workflow can't complete until your request is addressed and you decide again."
      }
      icon={MessageEdit01Icon}
      noteLabel="Reason"
      noteTooltip="The Product Team and the Initiator are notified. Everyone on this workflow can see it."
      notePlaceholder="Describe what needs to change"
      required
      submitLabel="Request Changes"
      submitLoadingLabel="Requesting…"
      submitIcon={MessageEdit01Icon}
      isPending={isPending}
      attachmentsWorkflowId={workflow._id}
      onSubmit={(reason, attachments) =>
        decide(
          {
            assignmentId: assignment._id,
            decision: "request_changes",
            reason,
            scope,
            attachments,
          },
          { onSuccess: () => onOpenChange(false) },
        )
      }
    >
      <Field>
        <FormFieldLabel
          htmlFor={scopeId}
          label="Scope"
          tooltip="Raise separate Product issues as separate requests."
        />
        <WorkflowScopeSelect
          id={scopeId}
          size="md"
          products={workflow.products}
          value={scope}
          disabled={isPending}
          onValueChange={setScope}
        />
      </Field>
    </WorkflowNoteDialog>
  );
}
