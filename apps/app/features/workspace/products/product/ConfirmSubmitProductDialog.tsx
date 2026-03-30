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
  PiPaperPlaneRightDuotone,
  PiWarningDiamondDuotone,
  PiXCircleDuotone,
  PiInfoDuotone,
} from "react-icons/pi";

interface ConfirmSubmitProductDialogProps {
  children: React.ReactNode;
  productName?: string;
  onConfirm: () => Promise<void>;
  disabled?: boolean;
}

export default function ConfirmSubmitProductDialog({
  children,
  productName,
  onConfirm,
  disabled = false,
}: ConfirmSubmitProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Submit Product</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Submit this product for review. This action is irreversible and will
          lock the product from further editing.
        </DialogDescription>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <PiWarningDiamondDuotone size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Confirm Submission</h4>
              <p className="text-sm text-muted-foreground">
                You are about to submit{" "}
                <span className="font-medium text-foreground">
                  {productName || "this product"}
                </span>{" "}
                for review.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PiInfoDuotone className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Important: This action is irreversible
              </span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>
                Once submitted, you <strong>cannot edit</strong> this version
              </li>
              <li>
                To make changes, you will need to{" "}
                <strong>create a new version</strong>
              </li>
              <li>
                All tabs and data will be <strong>locked</strong> after
                submission
              </li>
              <li>
                The completion date will be set to <strong>today</strong>
              </li>
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? <Spinner /> : <PiPaperPlaneRightDuotone />}
            {isSubmitting ? "Submitting..." : "Yes, Submit Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
