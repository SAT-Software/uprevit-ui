"use client";

import { useId, useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { FieldGroup } from "@uprevit/ui/components/ui/field";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Cancel01Icon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import type { BillingUsageMetric } from "@/types/billing";
import { PlatformBillingConfirmDialog } from "@/features/platform-admin/PlatformBillingConfirmDialog";
import { PlatformBillingFieldLabel } from "@/features/platform-admin/PlatformBillingFieldLabel";
import { BILLING_OPERATIONS_FIELD_TOOLTIPS } from "@/features/platform-admin/platformBillingFieldTooltips";

type PendingOperation = {
  type: "adjustment";
  metric: AdjustableUsageMetric;
  quantityDelta: number;
};

type AdjustableUsageMetric = Extract<
  BillingUsageMetric,
  "completed_export" | "upload_bytes"
>;

const METRIC_LABELS: Record<AdjustableUsageMetric, string> = {
  completed_export: "Export",
  upload_bytes: "Upload bytes",
};

export function DialogPlatformBillingOperations({
  isAdjustmentPending,
  onAdjustment,
}: {
  isAdjustmentPending: boolean;
  onAdjustment: (input: {
    metric: AdjustableUsageMetric;
    quantityDelta: number;
  }) => Promise<void>;
}) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingOperation, setPendingOperation] =
    useState<PendingOperation | null>(null);
  const [adjustmentMetric, setAdjustmentMetric] =
    useState<AdjustableUsageMetric>("completed_export");
  const [adjustmentDelta, setAdjustmentDelta] = useState("1");
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);

  const openConfirm = (operation: PendingOperation) => {
    setPendingOperation(operation);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingOperation) return;

    try {
      await onAdjustment({
        metric: pendingOperation.metric,
        quantityDelta: pendingOperation.quantityDelta,
      });
      setConfirmOpen(false);
      setPendingOperation(null);
    } catch {
      setConfirmOpen(false);
      setPendingOperation(null);
    }
  };

  const handleApplyAdjustment = () => {
    const quantityDelta = Number(adjustmentDelta);
    if (!Number.isFinite(quantityDelta) || quantityDelta === 0) {
      setAdjustmentError("Enter a non-zero numeric delta.");
      return;
    }
    setAdjustmentError(null);
    openConfirm({ type: "adjustment", metric: adjustmentMetric, quantityDelta });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="secondary">
            <Icon icon={SlidersHorizontalIcon} size={14} strokeWidth={2} />
            Apply correction
          </Button>
        </DialogTrigger>

        <AppDialogContent
          title="Usage corrections"
          description="Apply manual usage adjustments for this workspace."
          subtitle="Manual usage corrections for the current billing period. Each adjustment asks for confirmation."
          variant="form"
          size="lg"
          primaryAction={{
            label: "Apply adjustment",
            loadingLabel: "Applying...",
            form: formId,
            type: "submit",
            loading: isAdjustmentPending,
            disabled: isAdjustmentPending,
            icon: SlidersHorizontalIcon,
          }}
          secondaryAction={{
            label: "Cancel",
            disabled: isAdjustmentPending,
            icon: Cancel01Icon,
          }}
        >
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault();
              handleApplyAdjustment();
            }}
            noValidate
          >
            <FieldGroup className="gap-4 p-4">
              <div className="space-y-3 rounded-lg border border-border p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <PlatformBillingFieldLabel
                      htmlFor="adjustment-metric"
                      label="Metric"
                      tooltip={BILLING_OPERATIONS_FIELD_TOOLTIPS.adjustmentMetric}
                    />
                    <Select
                      value={adjustmentMetric}
                      onValueChange={(value) =>
                        setAdjustmentMetric(value as AdjustableUsageMetric)
                      }
                    >
                      <SelectTrigger
                        id="adjustment-metric"
                        size="md"
                        className="w-full bg-background"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed_export">Export</SelectItem>
                        <SelectItem value="upload_bytes">Upload bytes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <PlatformBillingFieldLabel
                      htmlFor="adjustment-delta"
                      label="Delta"
                      tooltip={BILLING_OPERATIONS_FIELD_TOOLTIPS.adjustmentDelta}
                    />
                    <Input
                      id="adjustment-delta"
                      type="number"
                      className="w-full"
                      value={adjustmentDelta}
                      onChange={(event) => {
                        setAdjustmentDelta(event.target.value);
                        setAdjustmentError(null);
                      }}
                    />
                  </div>
                </div>
                {adjustmentError ? (
                  <p className="text-xs text-destructive">{adjustmentError}</p>
                ) : null}
              </div>
            </FieldGroup>
          </form>
        </AppDialogContent>
      </Dialog>

      <PlatformBillingConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Apply usage adjustment?"
        icon={SlidersHorizontalIcon}
        confirmLabel="Apply adjustment"
        isPending={isAdjustmentPending}
        onConfirm={handleConfirm}
        description={
          pendingOperation ? (
            <p>
              Applies a manual adjustment of{" "}
              <strong>
                {pendingOperation.quantityDelta > 0 ? "+" : ""}
                {pendingOperation.quantityDelta}
              </strong>{" "}
              to <strong>{METRIC_LABELS[pendingOperation.metric]}</strong> for
              the current billing period.
            </p>
          ) : (
            <p>Confirm this usage adjustment.</p>
          )
        }
      />
    </>
  );
}
