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
import type { IconType } from "react-icons";
import { PiChecksDuotone, PiXCircleDuotone } from "react-icons/pi";

export function PlatformBillingConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  confirmLabel = "Confirm",
  isPending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  icon?: IconType;
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
              {Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
              <p>{title}</p>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              <PiXCircleDuotone size={18} />
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
            <PiXCircleDuotone />
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onConfirm} disabled={isPending}>
            {isPending ? <Spinner /> : <PiChecksDuotone />}
            {isPending ? "Saving…" : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
