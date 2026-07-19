"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  Cancel01Icon,
  InformationCircleIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";

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
      <AppDialogContent
        title="Submit Product"
        description="Submit this product for review. This action is irreversible and will lock the product from further editing."
        variant="confirm"
        size="md"
        confirmContent={{
          heading: "Confirm Submission",
          message: (
            <>
              You are about to submit{" "}
              <span className="font-medium text-foreground">
                {productName || "this product"}
              </span>{" "}
              for review.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Yes, Submit Product",
          loadingLabel: "Submitting...",
          onClick: handleConfirm,
          loading: isSubmitting,
          disabled: isSubmitting,
          icon: SentIcon,
          className: "bg-emerald-600 hover:bg-emerald-700 text-white",
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
                Important: This action is irreversible
              </span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
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
      </AppDialogContent>
    </Dialog>
  );
}
