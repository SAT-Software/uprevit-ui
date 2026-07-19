"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Undo02Icon,
} from "@hugeicons/core-free-icons";

interface ToggleTabCompletionDialogProps {
  children: React.ReactNode;
  tabName: string;
  isCompleted: boolean;
  onConfirm: () => Promise<void>;
  disabled?: boolean;
}

const TAB_DISPLAY_NAMES: Record<string, string> = {
  "product-information": "Product Information",
  "compliance-information": "Compliance Information",
  "label-components": "Label Components",
  "symbols-graphics": "Symbols & Graphics",
  "product-specifications": "Product Specifications",
  "operational-parameters": "Operational Parameters",
  "label-tags": "Label Tags",
};

export default function ToggleTabCompletionDialog({
  children,
  tabName,
  isCompleted,
  onConfirm,
  disabled = false,
}: ToggleTabCompletionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayTabName = TAB_DISPLAY_NAMES[tabName] || tabName;

  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Failed to toggle tab completion:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const dialogTitle = isCompleted
    ? "Mark Tab as Incomplete"
    : "Mark Tab as Complete";

  const confirmButtonText = isCompleted
    ? "Yes, Mark Incomplete"
    : "Yes, Mark Complete";

  const confirmingText = isCompleted
    ? "Marking Incomplete..."
    : "Marking Complete...";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <AppDialogContent
        title={dialogTitle}
        description={
          isCompleted
            ? "Mark this tab as incomplete to allow further editing."
            : "Mark this tab as complete to indicate work is finished."
        }
        variant={isCompleted ? "confirm-destructive" : "confirm"}
        size="md"
        confirmContent={{
          heading: isCompleted ? "Revert Completion" : "Confirm Completion",
          message: (
            <>
              You are about to mark{" "}
              <span className="font-medium text-foreground">
                {displayTabName}
              </span>{" "}
              as{" "}
              <span className="font-medium text-foreground">
                {isCompleted ? "incomplete" : "complete"}
              </span>
              .
            </>
          ),
          icon: isCompleted ? Undo02Icon : CheckmarkCircle02Icon,
        }}
        primaryAction={{
          label: confirmButtonText,
          loadingLabel: confirmingText,
          onClick: handleConfirm,
          loading: isSubmitting,
          disabled: isSubmitting,
          icon: isCompleted ? Undo02Icon : CheckmarkCircle02Icon,
          className: isCompleted
            ? "bg-amber-600 hover:bg-amber-700 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white",
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isSubmitting,
          icon: Cancel01Icon,
        }}
      >
        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon
                icon={InformationCircleIcon}
                size={16}
                className="text-muted-foreground"
              />
              <span className="font-medium text-muted-foreground">
                {isCompleted ? "What happens next:" : "What this means:"}
              </span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
              {isCompleted ? (
                <>
                  <li>
                    Tab will be marked as <strong>in-progress</strong>
                  </li>
                  <li>
                    Product completion percentage will be{" "}
                    <strong>decreased</strong>
                  </li>
                  <li>
                    You can continue <strong>editing</strong> this tab
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Tab will be marked as <strong>complete</strong>
                  </li>
                  <li>
                    Product completion percentage will be{" "}
                    <strong>increased</strong>
                  </li>
                  <li>
                    You can still <strong>edit</strong> this tab later
                  </li>
                  <li>
                    Mark as incomplete if you need to make{" "}
                    <strong>changes</strong>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
