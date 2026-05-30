"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  PiCloudArrowUpDuotone,
  PiTrashDuotone,
  PiWarningDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

interface UnsavedWorkbookChangesDialogProps {
  open: boolean;
  tabLabel: string;
  onOpenChange: (open: boolean) => void;
  onSave: () => Promise<void>;
  onDiscard: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function UnsavedWorkbookChangesDialog({
  open,
  tabLabel,
  onOpenChange,
  onSave,
  onDiscard,
  onCancel,
  isSaving = false,
}: UnsavedWorkbookChangesDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBusy = isSaving || isSubmitting;

  async function handleSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Failed to save workbook:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDiscard(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onDiscard();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Unsaved Changes</p>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer"
                onClick={onCancel}
                disabled={isBusy}
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          You have unsaved changes in {tabLabel}. Save, discard, or cancel
          before leaving.
        </DialogDescription>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            >
              <PiWarningDuotone size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">You have unsaved changes</h4>
              <p className="text-sm text-muted-foreground">
                Your edits in <strong>{tabLabel}</strong> are not saved yet. Use
                <strong> Save</strong> in the toolbar, or choose an option below
                before you leave this page.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4 flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isBusy}
          >
            <PiXCircleDuotone />
            Stay on page
          </Button>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDiscard}
              disabled={isBusy}
            >
              <PiTrashDuotone />
              Discard &amp; Continue
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isBusy}>
              {isBusy ? <Spinner /> : <PiCloudArrowUpDuotone />}
              {isBusy ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
