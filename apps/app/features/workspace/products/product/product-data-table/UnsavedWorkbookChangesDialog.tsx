"use client";

import { useState } from "react";
import { Dialog, DialogClose } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  Cancel01Icon,
  CloudUploadIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

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
      <AppDialogContent
        title="Unsaved Changes"
        description={`You have unsaved changes in ${tabLabel}. Save, discard, or cancel before leaving.`}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "You have unsaved changes",
          message: (
            <>
              Your edits in <strong>{tabLabel}</strong> are not saved yet. Use
              <strong> Save</strong> in the toolbar, or choose an option below
              before you leave this page.
            </>
          ),
          icon: Alert01Icon,
        }}
        footer={
          <>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onCancel}
                disabled={isBusy}
              >
                <Icon icon={Cancel01Icon} size={16} strokeWidth={2} />
                Stay on page
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDiscard}
              disabled={isBusy}
            >
              <Icon icon={Delete02Icon} size={16} strokeWidth={2} />
              Discard &amp; Continue
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isBusy}
              aria-busy={isBusy}
            >
              {isBusy ? (
                <Spinner />
              ) : (
                <Icon icon={CloudUploadIcon} size={16} strokeWidth={2} />
              )}
              {isBusy ? "Saving..." : "Save & Continue"}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}
