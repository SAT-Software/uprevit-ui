"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

export function ConfirmWorkflowRemovalDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title={title}
        description={title}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Confirm removal",
          message,
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Remove",
          loadingLabel: "Removing…",
          onClick: onConfirm,
          loading: isPending,
          disabled: isPending,
          icon: Delete02Icon,
          variant: "destructive",
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
