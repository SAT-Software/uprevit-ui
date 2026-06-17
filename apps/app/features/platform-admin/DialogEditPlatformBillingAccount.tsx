"use client";

import { useId, useMemo, useState } from "react";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
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
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Switch } from "@uprevit/ui/components/ui/switch";
import {
  PiChecksDuotone,
  PiCreditCardDuotone,
  PiPencilCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import type { UpdatePlatformBillingAccountInput } from "@/types/platform-admin";
import type { BillingAccount, EnforcementMode, WorkspaceBillingSummary } from "@/types/billing";
import { PlatformBillingConfirmDialog } from "@/features/platform-admin/PlatformBillingConfirmDialog";
import {
  billingAccountStatusVariant,
  getBillingStatusLabel,
} from "@/utils/billingStatusDisplay";
type BillingAccountForm = {
  status: BillingAccount["status"];
  billingCadence: BillingAccount["billingCadence"];
  currency: string;
  netTermDays: string;
  limitsEnabled: boolean;
  enforcementMode: EnforcementMode;
  ssoAllowed: boolean;
  ssoEnabled: boolean;
  exports: string;
  uploadGb: string;
};

function accountToForm(account: BillingAccount): BillingAccountForm {
  return {
    status: account.status,
    billingCadence: account.billingCadence,
    currency: account.currency,
    netTermDays: String(account.netTermDays),
    limitsEnabled: account.limitsEnabled,
    enforcementMode: account.limits.enforcementMode,
    ssoAllowed: account.usageLimits.ssoAllowed,
    ssoEnabled: account.sso.enabled,
    exports: String(account.usageLimits.exports),
    uploadGb: String(account.usageLimits.uploadGb),
  };
}

function buildUpdatePayload(
  form: BillingAccountForm,
  account: BillingAccount,
): UpdatePlatformBillingAccountInput | null {
  const netTermDays = Number(form.netTermDays);
  const exports = Number(form.exports);
  const uploadGb = Number(form.uploadGb);

  if (
    !Number.isFinite(netTermDays) ||
    netTermDays < 0 ||
    !Number.isFinite(exports) ||
    exports < 0 ||
    !Number.isInteger(exports) ||
    !Number.isFinite(uploadGb) ||
    uploadGb < 0
  ) {
    return null;
  }

  const payload: UpdatePlatformBillingAccountInput = {};

  const isPastDueStatus = account.pastDue || account.status === "past_due";
  if (!isPastDueStatus && form.status !== account.status) payload.status = form.status;
  if (form.billingCadence !== account.billingCadence) payload.billingCadence = form.billingCadence;

  const currency = form.currency.trim();
  if (currency && currency !== account.currency) payload.currency = currency;

  if (netTermDays !== account.netTermDays) payload.netTermDays = netTermDays;
  if (form.limitsEnabled !== account.limitsEnabled) payload.limitsEnabled = form.limitsEnabled;
  if (form.enforcementMode !== account.limits.enforcementMode) {
    payload.enforcementMode = form.enforcementMode;
  }
  if (form.ssoEnabled !== account.sso.enabled) payload.ssoEnabled = form.ssoEnabled;

  const usageLimits: NonNullable<UpdatePlatformBillingAccountInput["usageLimits"]> = {};
  if (exports !== account.usageLimits.exports) usageLimits.exports = exports;
  if (uploadGb !== account.usageLimits.uploadGb) usageLimits.uploadGb = uploadGb;
  if (form.ssoAllowed !== account.usageLimits.ssoAllowed) usageLimits.ssoAllowed = form.ssoAllowed;
  if (Object.keys(usageLimits).length > 0) payload.usageLimits = usageLimits;

  return Object.keys(payload).length > 0 ? payload : null;
}

function describeChanges(
  form: BillingAccountForm,
  account: BillingAccount,
): string[] {
  const changes: string[] = [];
  if (form.status !== account.status) changes.push(`Status: ${account.status} → ${form.status}`);
  if (form.billingCadence !== account.billingCadence) {
    changes.push(`Cadence: ${account.billingCadence} → ${form.billingCadence}`);
  }
  if (form.currency.trim() !== account.currency) {
    changes.push(`Currency: ${account.currency} → ${form.currency.trim()}`);
  }
  if (Number(form.netTermDays) !== account.netTermDays) {
    changes.push(`Net terms: ${account.netTermDays} → ${form.netTermDays} days`);
  }
  if (form.limitsEnabled !== account.limitsEnabled) {
    changes.push(`Limit enforcement: ${account.limitsEnabled ? "on" : "off"} → ${form.limitsEnabled ? "on" : "off"}`);
  }
  if (form.enforcementMode !== account.limits.enforcementMode) {
    changes.push(`Enforcement mode: ${account.limits.enforcementMode} → ${form.enforcementMode}`);
  }
  if (form.ssoEnabled !== account.sso.enabled) {
    changes.push(`SSO enabled: ${account.sso.enabled ? "on" : "off"} → ${form.ssoEnabled ? "on" : "off"}`);
  }
  if (form.ssoAllowed !== account.usageLimits.ssoAllowed) {
    changes.push(`SSO allowed: ${account.usageLimits.ssoAllowed ? "yes" : "no"} → ${form.ssoAllowed ? "yes" : "no"}`);
  }
  if (Number(form.exports) !== account.usageLimits.exports) {
    changes.push(`Export limit: ${account.usageLimits.exports} → ${form.exports}`);
  }
  if (Number(form.uploadGb) !== account.usageLimits.uploadGb) {
    changes.push(`Upload GB limit: ${account.usageLimits.uploadGb} → ${form.uploadGb}`);
  }
  return changes;
}

export function DialogEditPlatformBillingAccount({
  account,
  summary,
  isPending,
  onSave,
}: {
  account: BillingAccount;
  summary: WorkspaceBillingSummary;
  isPending: boolean;
  onSave: (input: UpdatePlatformBillingAccountInput) => Promise<void>;
}) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState<BillingAccountForm>(() => accountToForm(account));
  const [formError, setFormError] = useState<string | null>(null);

  const pendingPayload = useMemo(
    () => (open ? buildUpdatePayload(form, account) : null),
    [open, form, account],
  );

  const changeSummary = useMemo(
    () => (open ? describeChanges(form, account) : []),
    [open, form, account],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm(accountToForm(account));
      setFormError(null);
    } else {
      setFormError(null);
    }
    setOpen(nextOpen);
  };

  const handleSaveClick = () => {
    const payload = buildUpdatePayload(form, account);
    if (!payload) {
      setFormError("Enter valid values. Export limit must be a whole number.");
      return;
    }
    setFormError(null);
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    const payload = buildUpdatePayload(form, account);
    if (!payload) return;
    try {
      await onSave(payload);
      setConfirmOpen(false);
      setOpen(false);
    } catch {
      setConfirmOpen(false);
    }
  };

  const patchForm = (patch: Partial<BillingAccountForm>) => {
    setForm((current) => ({ ...current, ...patch }));
    setFormError(null);
  };

  const isPastDueStatus = account.pastDue || account.status === "past_due";

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size="sm" variant="secondary" className="gap-2">
            <PiPencilCircleDuotone className="h-4 w-4" />
            Edit billing account
          </Button>
        </DialogTrigger>

        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-y-visible p-0 sm:max-w-2xl [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
              <div className="flex items-center gap-2">
                <PiCreditCardDuotone className="h-5 w-5 text-muted-foreground" />
                <p>Edit billing account</p>
              </div>
              <DialogClose asChild>
                <button type="button" className="cursor-pointer">
                  <PiXCircleDuotone size={18} />
                </button>
              </DialogClose>
            </DialogTitle>
            <div className="border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Update terms, limit enforcement, and usage limits. All changes are reviewed in a confirmation step before saving.
            </div>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Edit billing account settings for this workspace.
          </DialogDescription>

          <form
            id={formId}
            className="overflow-y-auto p-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveClick();
            }}
            noValidate
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billing-status">Status</Label>
                  {isPastDueStatus ? (
                    <div className="space-y-1.5">
                      <Badge
                        variant={billingAccountStatusVariant(account.status, account.pastDue)}
                        className="capitalize"
                      >
                        {getBillingStatusLabel(account.status, account.pastDue)}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Past due is set automatically from Chargebee when invoices are overdue.
                      </p>
                    </div>
                  ) : (
                    <Select
                      value={form.status}
                      onValueChange={(status) =>
                        patchForm({ status: status as BillingAccount["status"] })
                      }
                    >
                      <SelectTrigger id="billing-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["draft", "pilot", "active", "cancelled"] as const).map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-cadence">Cadence</Label>
                  <Select
                    value={form.billingCadence}
                    onValueChange={(billingCadence) =>
                      patchForm({
                        billingCadence: billingCadence as BillingAccount["billingCadence"],
                      })
                    }
                  >
                    <SelectTrigger id="billing-cadence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-currency">Currency</Label>
                  <Input
                    id="billing-currency"
                    value={form.currency}
                    onChange={(event) => patchForm({ currency: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-net-terms">Net terms (days)</Label>
                  <Input
                    id="billing-net-terms"
                    type="number"
                    min={0}
                    step={1}
                    value={form.netTermDays}
                    onChange={(event) => patchForm({ netTermDays: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="edit-metering-enabled">Limit enforcement</Label>
                  <Switch
                    id="edit-metering-enabled"
                    checked={form.limitsEnabled}
                    onCheckedChange={(limitsEnabled) => patchForm({ limitsEnabled })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="edit-sso-allowed">SSO allowed</Label>
                  <Switch
                    id="edit-sso-allowed"
                    checked={form.ssoAllowed}
                    onCheckedChange={(ssoAllowed) => patchForm({ ssoAllowed })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="edit-sso-enabled">SSO enabled</Label>
                  <Switch
                    id="edit-sso-enabled"
                    checked={form.ssoEnabled}
                    onCheckedChange={(ssoEnabled) => patchForm({ ssoEnabled })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Seat limit</Label>
                  <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                    {account.usageLimits.seats.toLocaleString()} seats
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mirrored from Chargebee. Used: {summary.usage.activeSeats}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-enforcement-mode">Enforcement mode</Label>
                  <Select
                    value={form.enforcementMode}
                    onValueChange={(enforcementMode) =>
                      patchForm({ enforcementMode: enforcementMode as EnforcementMode })
                    }
                  >
                    <SelectTrigger id="billing-enforcement-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overage">Allow overage</SelectItem>
                      <SelectItem value="block">Block when over limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-exports">Export limit</Label>
                  <Input
                    id="billing-exports"
                    type="number"
                    min={0}
                    step={1}
                    value={form.exports}
                    onChange={(event) => patchForm({ exports: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used: {summary.usage.exports}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-upload-gb">Upload GB limit</Label>
                  <Input
                    id="billing-upload-gb"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.uploadGb}
                    onChange={(event) => patchForm({ uploadGb: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used: {summary.usage.uploadGb.toFixed(2)} GB · decimals allowed (e.g. 0.5)
                  </p>
                </div>
              </div>

              {formError ? (
                <p className="text-xs text-destructive">{formError}</p>
              ) : null}
            </div>
          </form>

          <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm" disabled={isPending}>
                <PiXCircleDuotone />
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              form={formId}
              disabled={isPending || !pendingPayload}
              aria-busy={isPending}
            >
              {isPending ? <Spinner /> : <PiChecksDuotone />}
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PlatformBillingConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Save billing account changes?"
        icon={PiCreditCardDuotone}
        confirmLabel="Confirm save"
        isPending={isPending}
        onConfirm={handleConfirmSave}
        description={
          <div className="space-y-2">
            <p>The following updates will be applied to this workspace billing account:</p>
            <ul className="list-disc space-y-1 pl-4">
              {changeSummary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        }
      />
    </>
  );
}
