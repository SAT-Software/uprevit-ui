"use client";

import { useId, useState } from "react";
import { UserSwitchIcon } from "@hugeicons/core-free-icons";
import { Field } from "@uprevit/ui/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import ProductMemberCombobox from "@/features/workspace/products/ProductMemberCombobox";
import { ProductMemberAvatar } from "@/features/workspace/products/ProductMemberAvatar";
import { useReplaceWorkflowApprover } from "@/hooks/workflow/useWorkflows";
import type { ProductTeamMember } from "@/types/product";
import type { WorkflowAssignment, WorkflowDetail } from "@/types/workflow";
import { WORKFLOW_RELATIONSHIP_LABELS } from "@/utils/workflow/workflow-labels";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";

const isSameGroup = (a: WorkflowAssignment, b: WorkflowAssignment) =>
  a.functionType === b.functionType &&
  (a.functionType === "product_team"
    ? a.lineageId === b.lineageId
    : a.functionLabel.toLowerCase() === b.functionLabel.toLowerCase());

export function ReplaceApproverDialog({
  workflow,
  assignment,
  groupLabel,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "products" | "assignments">;
  assignment: WorkflowAssignment;
  groupLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const memberId = `replace-approver-member-${useId()}`;
  const { mutate: replace, isPending } = useReplaceWorkflowApprover(
    workflow._id,
  );
  const [member, setMember] = useState<ProductTeamMember | null>(null);
  const assignedIds = workflow.assignments
    .filter((item) => isSameGroup(item, assignment))
    .map((item) => item.userId);
  const team =
    assignment.functionType === "product_team"
      ? (workflow.products
          .find((product) => product.lineageId === assignment.lineageId)
          ?.team.filter((item) => !assignedIds.includes(item._id)) ?? [])
      : null;

  const selected =
    member &&
    (team
      ? team.some((item) => item._id === member._id)
      : !assignedIds.includes(member._id))
      ? member
      : null;

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Replace Approver"
      variant="confirm"
      heading={`Replace ${assignment.userSnapshot.name}?`}
      message={`The new approver decides for ${groupLabel} instead. Both are notified, and the replacement is recorded in the workflow history.`}
      icon={UserSwitchIcon}
      noteLabel="Reason"
      noteTooltip="Everyone on this workflow can see it in the history."
      notePlaceholder="Explain why this approver is replaced"
      required
      submitLabel="Replace"
      submitLoadingLabel="Replacing…"
      submitIcon={UserSwitchIcon}
      submitDisabled={!selected}
      isPending={isPending}
      onSubmit={(reason) => {
        if (!selected) return;
        replace(
          { assignmentId: assignment._id, userId: selected._id, reason },
          { onSuccess: () => onOpenChange(false) },
        );
      }}
    >
      <Field>
        <FormFieldLabel
          htmlFor={memberId}
          label="New approver"
          tooltip={
            team
              ? "Only this Product's owner and contributors can approve for its Product Team."
              : "Any active member of the workspace."
          }
        />
        {team ? (
          <Select
            value={selected?._id ?? ""}
            disabled={isPending || team.length === 0}
            onValueChange={(next) =>
              setMember(team.find((item) => item._id === next) ?? null)
            }
          >
            <SelectTrigger id={memberId} size="md" className="bg-background">
              <SelectValue
                placeholder={
                  team.length
                    ? "Pick a team member"
                    : "No one else on this Product Team"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {team.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  <span className="flex min-w-0 items-center gap-2">
                    <ProductMemberAvatar member={item} />
                    <span className="truncate">{item.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {WORKFLOW_RELATIONSHIP_LABELS[item.relationship]}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <ProductMemberCombobox
            id={memberId}
            value={selected}
            placeholder="Pick a member"
            excludeIds={assignedIds}
            disabled={isPending}
            onSelect={setMember}
          />
        )}
      </Field>
    </WorkflowNoteDialog>
  );
}
