"use client";

import type { ReactNode } from "react";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

export function PlatformBillingConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  confirmLabel = "Confirm",
  isPending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  icon?: IconProps["icon"];
  confirmLabel?: string;
  isPending: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent
        title={title}
        description={typeof description === "string" ? description : title}
        variant="confirm"
        size="md"
        confirmContent={{
          heading: title,
          message: description,
          icon,
        }}
        primaryAction={{
          label: confirmLabel,
          loadingLabel: "Saving…",
          onClick: () => void onConfirm(),
          loading: isPending,
          disabled: isPending,
          icon: Tick02Icon,
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
