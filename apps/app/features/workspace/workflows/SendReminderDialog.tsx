"use client";

import { useState } from "react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import { Field } from "@uprevit/ui/components/ui/field";
import { useSendWorkflowReminder } from "@/hooks/workflow/useWorkflows";
import type { WorkflowAssignment, WorkflowDetail } from "@/types/workflow";
import { WorkflowDecisionBadge } from "./WorkflowDecisionBadge";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";

const isUndecided = (assignment: WorkflowAssignment) =>
  assignment.decision === "pending" ||
  assignment.decision === "changes_requested";

export function SendReminderDialog({
  workflow,
  currentUserId,
  open,
  onOpenChange,
}: {
  workflow: Pick<
    WorkflowDetail,
    "_id" | "numberLabel" | "products" | "assignments"
  >;
  currentUserId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: send, isPending } = useSendWorkflowReminder(workflow._id);
  const assignments = workflow.assignments.filter(
    (assignment) => assignment.userId !== currentUserId,
  );
  const [selected, setSelected] = useState(
    () =>
      new Set(
        assignments
          .filter(
            (assignment) =>
              isUndecided(assignment) && !assignment.needsReplacement,
          )
          .map((assignment) => assignment._id),
      ),
  );

  const toggle = (assignmentId: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(assignmentId);
      else next.delete(assignmentId);
      return next;
    });

  const groupLabel = (assignment: WorkflowAssignment) =>
    assignment.functionType === "product_team"
      ? `Product Team · ${workflow.products.find((product) => product.lineageId === assignment.lineageId)?.name ?? "Product"}`
      : assignment.functionLabel;

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Send Reminder"
      variant="confirm"
      heading={`Remind approvers of ${workflow.numberLabel}?`}
      message="The approvers you pick get an in-app and email reminder. Pending approvers are selected."
      icon={Notification01Icon}
      noteLabel="Message"
      noteTooltip="Included in the reminder and saved in the workflow history."
      notePlaceholder="Add a message for the approvers"
      required={false}
      submitLabel="Send Reminder"
      submitLoadingLabel="Sending…"
      submitIcon={Notification01Icon}
      submitDisabled={selected.size === 0}
      isPending={isPending}
      onSubmit={(message) =>
        send(
          {
            assignmentIds: [...selected],
            ...(message && { message }),
          },
          { onSuccess: () => onOpenChange(false) },
        )
      }
    >
      <Field>
        <p className="text-sm font-medium leading-snug">Approvers</p>
        {assignments.length ? (
          <ul
            aria-label="Approvers"
            className="max-h-64 divide-y divide-border overflow-y-auto rounded-lg border border-border"
          >
            {assignments.map((assignment) => {
              const checkboxId = `reminder-${assignment._id}`;
              return (
                <li key={assignment._id}>
                  <label
                    htmlFor={checkboxId}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-muted/40 has-[button:disabled]:cursor-not-allowed has-[button:disabled]:opacity-60"
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={selected.has(assignment._id)}
                      disabled={isPending || !!assignment.needsReplacement}
                      onCheckedChange={(checked) =>
                        toggle(assignment._id, checked === true)
                      }
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">
                        {assignment.userSnapshot.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {groupLabel(assignment)}
                      </span>
                    </span>
                    {assignment.needsReplacement ? (
                      <Badge variant="yellow" className="font-normal">
                        Needs replacement
                      </Badge>
                    ) : (
                      <WorkflowDecisionBadge decision={assignment.decision} />
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            There are no other approvers to remind.
          </p>
        )}
      </Field>
    </WorkflowNoteDialog>
  );
}
