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
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  PiCheckCircleDuotone,
  PiArrowCounterClockwiseDuotone,
  PiXCircleDuotone,
  PiInfoDuotone,
} from "react-icons/pi";

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
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>{dialogTitle}</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {isCompleted
            ? "Mark this tab as incomplete to allow further editing."
            : "Mark this tab as complete to indicate work is finished."}
        </DialogDescription>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                isCompleted
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
              }`}
              aria-hidden="true"
            >
              {isCompleted ? (
                <PiArrowCounterClockwiseDuotone size={20} />
              ) : (
                <PiCheckCircleDuotone size={20} />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">
                {isCompleted ? "Revert Completion" : "Confirm Completion"}
              </h4>
              <p className="text-sm text-muted-foreground">
                You are about to mark{" "}
                <span className="font-medium text-foreground">
                  {displayTabName}
                </span>{" "}
                as{" "}
                <span className="font-medium text-foreground">
                  {isCompleted ? "incomplete" : "complete"}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PiInfoDuotone className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                {isCompleted ? "What happens next:" : "What this means:"}
              </span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
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
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={
              isCompleted
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          >
            {isSubmitting ? (
              <Spinner />
            ) : isCompleted ? (
              <PiArrowCounterClockwiseDuotone />
            ) : (
              <PiCheckCircleDuotone />
            )}
            {isSubmitting ? confirmingText : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
