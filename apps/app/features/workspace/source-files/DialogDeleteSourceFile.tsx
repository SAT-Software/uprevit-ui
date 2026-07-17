"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

interface DialogDeleteSourceFileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  fileName?: string;
}

export default function DialogDeleteSourceFile({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  fileName,
}: DialogDeleteSourceFileProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Delete File"
        description={
          fileName
            ? `Delete the file ${fileName}. This action cannot be undone.`
            : "Delete this file. This action cannot be undone."
        }
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Delete file",
          message: (
            <>
              Are you sure you want to delete{" "}
              {fileName ? (
                <>
                  the file <strong>{fileName}</strong>
                </>
              ) : (
                "this file"
              )}
              ? This action cannot be undone. The file will be permanently
              deleted.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete File",
          loadingLabel: "Deleting...",
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
