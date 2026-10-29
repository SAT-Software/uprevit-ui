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
        title="Replace this workbook?"
        description="All sheets will be replaced by the imported workbook. This action cannot be undone."
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Replace this workbook?",
          message:
            "All sheets will be replaced by the imported workbook. This action cannot be undone.",
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Replace workbook",
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
