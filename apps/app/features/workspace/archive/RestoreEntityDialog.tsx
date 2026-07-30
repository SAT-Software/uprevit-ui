"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  ArchiveRestoreIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

interface RestoreEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function RestoreEntityDialog({
  open,
  onOpenChange,
  entityName,
  onConfirm,
  isPending,
}: RestoreEntityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Restore"
        description={`Restore ${entityName} and make it active again.`}
        variant="confirm"
        size="md"
        confirmContent={{
          heading: `Restore ${entityName}?`,
          message: (
            <>
              This will restore <strong>{entityName}</strong> and make it active
              again.
            </>
          ),
          icon: ArchiveRestoreIcon,
        }}
        primaryAction={{
          label: "Restore",
          loadingLabel: "Restoring...",
          onClick: onConfirm,
          loading: isPending,
          disabled: isPending,
          icon: ArchiveRestoreIcon,
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
