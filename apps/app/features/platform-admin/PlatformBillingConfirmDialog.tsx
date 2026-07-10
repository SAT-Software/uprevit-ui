"use client";

import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@uprevit/ui/components/ui/alert-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { CancelCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";

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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
            <div className="flex items-center gap-2">
              {icon ? (
                <Icon
                  icon={icon}
                  size={16}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
              ) : null}
              <p>{title}</p>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              <Icon icon={CancelCircleIcon} size={18} strokeWidth={2} />
            </button>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="p-4">
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground">{description}</div>
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            <Icon icon={CancelCircleIcon} size={14} strokeWidth={2} />
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <Icon icon={Tick02Icon} size={14} strokeWidth={2} />
            )}
            {isPending ? "Saving…" : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
