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
  title: string;
  workflowsEnabled: boolean;
  onConfirm: () => Promise<void>;
  disabled?: boolean;
}

export default function ConfirmSubmitProductDialog({
  children,
  productName,
  title,
  workflowsEnabled,
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
        title={title}
        description={
          workflowsEnabled
            ? "Mark this version as ready for an approval workflow."
            : "Release this version now. Released versions are locked from further editing."
        }
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
              {workflowsEnabled ? "for approval." : "and release it."}
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: `Yes, ${title.toLowerCase()}`,
          loadingLabel: "Submitting…",
          onClick: handleConfirm,
          loading: isSubmitting,
          disabled: isSubmitting,
          icon: SentIcon,
          className: "bg-emerald-700 hover:bg-emerald-800 text-white",
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
                {workflowsEnabled
                  ? "What happens next"
                  : "Important: This action is irreversible"}
              </span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
              {workflowsEnabled ? (
                <>
                  <li>
                    The version <strong>stays editable</strong> until it is
                    released
                  </li>
                  <li>
                    An <strong>approval workflow</strong> will release it
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Once released, you <strong>cannot edit</strong> this
                    version
                  </li>
                  <li>
                    To make changes, you will need to{" "}
                    <strong>create a new version</strong>
                  </li>
                  <li>
                    The previous release becomes <strong>obsolete</strong>
                  </li>
                </>
              )}
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
