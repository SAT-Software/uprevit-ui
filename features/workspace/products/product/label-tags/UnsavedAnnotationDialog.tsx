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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  PiCloudArrowUpDuotone,
  PiInfoDuotone,
  PiTrashDuotone,
  PiWarningDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

interface UnsavedAnnotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => Promise<void>;
  onDiscard: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function UnsavedAnnotationDialog({
  open,
  onOpenChange,
  onSave,
  onDiscard,
  onCancel,
  isSaving = false,
}: UnsavedAnnotationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSaving || isSubmitting;

  async function handleSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Failed to save annotation:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDiscard(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onDiscard();
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Unsaved Changes</p>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          You have unsaved annotation changes. Choose whether to save, discard,
          or cancel.
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
                Your annotation changes will be lost if you leave without
                saving. What would you like to do?
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PiInfoDuotone className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                If you save
              </span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>
                It will <strong>replace</strong> any previous tagged image
              </li>
              <li>
                The original label image will remain <strong>unchanged</strong>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4 flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isBusy}
            className="order-3 sm:order-1"
          >
            Cancel
          </Button>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDiscard}
              disabled={isBusy}
            >
              <PiTrashDuotone />
              Discard & Continue
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isBusy}
            >
              {isBusy ? <Spinner /> : <PiCloudArrowUpDuotone />}
              {isBusy ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
