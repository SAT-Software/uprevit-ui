"use client";

import { Cancel01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { useStartWorkflow } from "@/hooks/workflow/useWorkflows";
import type { WorkflowDetail } from "@/types/workflow";

export function StartWorkflowDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "numberLabel" | "products" | "assignments">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: start, isPending } = useStartWorkflow(workflow._id);
  const approverCount = new Set(
    workflow.assignments.map((assignment) => assignment.userId),
  ).size;
  const productCount = workflow.products.length;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <AppDialogContent
        title="Start Workflow"
        description={`Start ${workflow.numberLabel}.`}
        variant="confirm"
        size="sm"
        confirmContent={{
          heading: `Start ${workflow.numberLabel}?`,
          message: (
            <ul className="list-disc space-y-1 pl-4">
              <li>
                {productCount} {productCount === 1 ? "Product moves" : "Products move"}{" "}
                to In Review and can&apos;t be edited until the workflow ends.
              </li>
              <li>
                Products and approvers are locked. They can&apos;t be changed
                after the start.
              </li>
              <li>
                {approverCount} {approverCount === 1 ? "approver is" : "approvers are"}{" "}
                notified.
              </li>
            </ul>
          ),
          icon: PlayIcon,
        }}
        primaryAction={{
          label: "Start Workflow",
          loadingLabel: "Starting…",
          onClick: () => start(undefined, { onSuccess: () => onOpenChange(false) }),
          loading: isPending,
          disabled: isPending,
          icon: PlayIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      />
    </Dialog>
  );
}
