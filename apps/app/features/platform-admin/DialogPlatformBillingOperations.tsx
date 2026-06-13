"use client";

import { useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  PiGearDuotone,
  PiSlidersHorizontalDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import type { BillingUsageMetric } from "@/types/billing";
import { PlatformBillingConfirmDialog } from "@/features/platform-admin/PlatformBillingConfirmDialog";
import { PlatformBillingFieldLabel } from "@/features/platform-admin/PlatformBillingFieldLabel";
import { BILLING_OPERATIONS_FIELD_TOOLTIPS } from "@/features/platform-admin/platformBillingFieldTooltips";

type PendingOperation = {
  type: "adjustment";
  metric: AdjustableUsageMetric;
  quantityDelta: number;
};

type AdjustableUsageMetric = Extract<BillingUsageMetric, "completed_export" | "upload_bytes">;

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
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<PendingOperation | null>(null);
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

  const handleApplyAdjustmentClick = () => {
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
          <Button size="sm" variant="secondary" className="gap-2">
            <PiGearDuotone className="h-4 w-4" />
            Usage operations
          </Button>
        </DialogTrigger>

        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
              <div className="flex items-center gap-2">
                <PiGearDuotone className="h-5 w-5 text-muted-foreground" />
                <p>Usage operations</p>
              </div>
              <DialogClose asChild>
                <button type="button" className="cursor-pointer">
                  <PiXCircleDuotone size={18} />
                </button>
              </DialogClose>
            </DialogTitle>
            <div className="border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Manual usage corrections for the current billing period. Each adjustment asks for confirmation.
            </div>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Apply manual usage adjustments for this workspace.
          </DialogDescription>

          <div className="space-y-4 overflow-y-auto p-4">
            <div className="space-y-3 rounded-lg border border-border p-3">
              <PlatformBillingFieldLabel
                label="Usage adjustment"
                tooltip={BILLING_OPERATIONS_FIELD_TOOLTIPS.usageAdjustment}
              />
              <div className="flex flex-wrap items-end gap-3">
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
                    <SelectTrigger id="adjustment-metric" className="w-48">
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
                    className="w-28"
                    value={adjustmentDelta}
                    onChange={(event) => {
                      setAdjustmentDelta(event.target.value);
                      setAdjustmentError(null);
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  disabled={isAdjustmentPending}
                  onClick={handleApplyAdjustmentClick}
                >
                  Apply adjustment
                </Button>
              </div>
              {adjustmentError ? (
                <p className="text-xs text-destructive">{adjustmentError}</p>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PlatformBillingConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Apply usage adjustment?"
        icon={PiSlidersHorizontalDuotone}
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
              to <strong>{METRIC_LABELS[pendingOperation.metric]}</strong> for the current billing
              period.
            </p>
          ) : (
            <p>Confirm this usage adjustment.</p>
          )
        }
      />
    </>
  );
}
