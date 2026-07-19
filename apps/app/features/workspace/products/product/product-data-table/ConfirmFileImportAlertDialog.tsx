"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Alert01Icon,
  Cancel01Icon,
  FileImportIcon,
} from "@hugeicons/core-free-icons";

interface ConfirmFileImportAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmFileImportAlertDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmFileImportAlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Replace existing data?"
        description="Your current data will be replaced with the imported file. This action cannot be undone."
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Replace existing data?",
          message:
            "Your current data will be replaced with the imported file. This action cannot be undone.",
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Continue",
          onClick: onConfirm,
          icon: FileImportIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onCancel,
          icon: Cancel01Icon,
        }}
      />
    </Dialog>
  );
}
