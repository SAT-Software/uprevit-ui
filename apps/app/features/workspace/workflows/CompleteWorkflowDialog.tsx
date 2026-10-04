"use client";

import { Cancel01Icon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { useCompleteWorkflow } from "@/hooks/workflow/useWorkflows";
import type { WorkflowDetail } from "@/types/workflow";

export function CompleteWorkflowDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "numberLabel" | "products">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: complete, isPending } = useCompleteWorkflow(workflow._id);
  const productCount = workflow.products.length;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <AppDialogContent
        title="Complete Workflow"
        description={`Complete ${workflow.numberLabel}.`}
        variant="confirm"
        size="sm"
        confirmContent={{
          heading: `Complete ${workflow.numberLabel}?`,
          message: (
            <ul className="list-disc space-y-1 pl-4">
              <li>
                {productCount}{" "}
                {productCount === 1 ? "Product is" : "Products are"} Released.
              </li>
              <li>
                Each Product&apos;s previous release becomes Obsolete.
              </li>
              <li>The workflow becomes a read-only record.</li>
            </ul>
          ),
          icon: CheckmarkBadge01Icon,
        }}
        primaryAction={{
          label: "Complete Workflow",
          loadingLabel: "Completing…",
          onClick: () =>
            complete(undefined, { onSuccess: () => onOpenChange(false) }),
          loading: isPending,
          disabled: isPending,
          icon: CheckmarkBadge01Icon,
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
