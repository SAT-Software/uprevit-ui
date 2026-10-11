"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { useDeleteWorkflow } from "@/hooks/workflow/useWorkflows";
import type { WorkflowDetail } from "@/types/workflow";

export function DeleteWorkflowDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: Pick<WorkflowDetail, "_id" | "numberLabel" | "name">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { mutate: deleteWorkflow, isPending } = useDeleteWorkflow();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Delete Draft"
        description="Delete this workflow draft."
        variant="confirm-destructive"
        size="sm"
        confirmContent={{
          heading: `Delete ${workflow.numberLabel}?`,
          message: `"${workflow.name}" and its Products and approvers will be removed. The number ${workflow.numberLabel} will not be reused.`,
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Draft",
          loadingLabel: "Deleting…",
          onClick: () =>
            deleteWorkflow(workflow._id, {
              onSuccess: () => {
                onOpenChange(false);
                router.replace("/workflows");
              },
            }),
          loading: isPending,
          disabled: isPending,
          icon: Delete02Icon,
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
