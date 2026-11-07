"use client";

import { useId, useState } from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { Field, FieldDescription } from "@uprevit/ui/components/ui/field";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { useRecordPlatformInvoicePayment } from "@/hooks/platform-admin/useRecordPlatformInvoicePayment";

export function DialogMarkInvoicePaid({
  workspaceId,
  invoiceId,
  amountDue,
}: {
  workspaceId: string;
  invoiceId: string;
  amountDue: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const { mutate, isPending } = useRecordPlatformInvoicePayment(
    workspaceId,
    invoiceId,
  );

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    setOpen(nextOpen);
    setReferenceNumber("");
  }

  function handleConfirm() {
    mutate(
      { referenceNumber: referenceNumber.trim() || undefined },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-fit shrink-0">
          <Icon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2} />
          Mark as paid
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Mark invoice as paid"
        description={`Record a bank transfer of ${amountDue} for invoice ${invoiceId}.`}
        subtitle={`Records a bank transfer of ${amountDue} for invoice ${invoiceId} in Chargebee. To reverse it, refund or void the payment in Chargebee.`}
        variant="confirm"
        size="md"
        primaryAction={{
          label: `Mark ${amountDue} as paid`,
          loadingLabel: "Recording…",
          onClick: handleConfirm,
          loading: isPending,
          icon: CheckmarkCircle02Icon,
        }}
        secondaryAction={{ label: "Cancel", disabled: isPending }}
      >
        <div className="p-4">
          <Field>
            <Label htmlFor={`${id}-reference`}>Reference (optional)</Label>
            <Input
              id={`${id}-reference`}
              value={referenceNumber}
              onChange={(event) => setReferenceNumber(event.target.value)}
              maxLength={100}
              placeholder="UTR or bank reference"
              autoComplete="off"
              disabled={isPending}
            />
            <FieldDescription className="text-xs">
              Saved on the payment in Chargebee.
            </FieldDescription>
          </Field>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
