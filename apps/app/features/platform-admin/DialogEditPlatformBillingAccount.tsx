"use client";

import { useId, useMemo, useState } from "react";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Switch } from "@uprevit/ui/components/ui/switch";
import {
  Cancel01Icon,
  CreditCardIcon,
  PropertyEditIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import type { UpdatePlatformBillingAccountInput } from "@/types/platform-admin";
import type {
  BillingAccount,
  EnforcementMode,
  WorkspaceBillingSummary,
} from "@/types/billing";
import { PlatformBillingConfirmDialog } from "@/features/platform-admin/PlatformBillingConfirmDialog";
import { InfoTooltip } from "@/components/common/InfoTooltip";
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
    ssoAllowed: account.limits.ssoAllowed,
    ssoEnabled: account.sso.enabled,
    exports: String(account.limits.exports),
    uploadGb: String(account.limits.uploadGb),
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
  if (!isPastDueStatus && form.status !== account.status)
    payload.status = form.status;
  if (form.billingCadence !== account.billingCadence)
    payload.billingCadence = form.billingCadence;

  const currency = form.currency.trim();
  if (currency && currency !== account.currency) payload.currency = currency;

  if (netTermDays !== account.netTermDays) payload.netTermDays = netTermDays;
  if (form.limitsEnabled !== account.limitsEnabled)
    payload.limitsEnabled = form.limitsEnabled;
  if (form.enforcementMode !== account.limits.enforcementMode) {
    payload.enforcementMode = form.enforcementMode;
  }
  if (form.ssoEnabled !== account.sso.enabled) payload.ssoEnabled = form.ssoEnabled;

  const limits: NonNullable<UpdatePlatformBillingAccountInput["limits"]> = {};
  if (exports !== account.limits.exports) limits.exports = exports;
  if (uploadGb !== account.limits.uploadGb) limits.uploadGb = uploadGb;
  if (form.ssoAllowed !== account.limits.ssoAllowed)
    limits.ssoAllowed = form.ssoAllowed;
  if (Object.keys(limits).length > 0) payload.limits = limits;

  return Object.keys(payload).length > 0 ? payload : null;
}

function describeChanges(
  form: BillingAccountForm,
  account: BillingAccount,
): string[] {
  const changes: string[] = [];
  if (form.status !== account.status)
    changes.push(`Status: ${account.status} → ${form.status}`);
  if (form.billingCadence !== account.billingCadence) {
    changes.push(
      `Cadence: ${account.billingCadence} → ${form.billingCadence}`,
    );
  }
  if (form.currency.trim() !== account.currency) {
    changes.push(`Currency: ${account.currency} → ${form.currency.trim()}`);
  }
  if (Number(form.netTermDays) !== account.netTermDays) {
    changes.push(
      `Net terms: ${account.netTermDays} → ${form.netTermDays} days`,
    );
  }
  if (form.limitsEnabled !== account.limitsEnabled) {
    changes.push(
      `Limit enforcement: ${account.limitsEnabled ? "on" : "off"} → ${form.limitsEnabled ? "on" : "off"}`,
    );
  }
  if (form.enforcementMode !== account.limits.enforcementMode) {
    changes.push(
      `Enforcement mode: ${account.limits.enforcementMode} → ${form.enforcementMode}`,
    );
  }
  if (form.ssoEnabled !== account.sso.enabled) {
    changes.push(
      `SSO enabled: ${account.sso.enabled ? "on" : "off"} → ${form.ssoEnabled ? "on" : "off"}`,
    );
  }
  if (form.ssoAllowed !== account.limits.ssoAllowed) {
    changes.push(
      `SSO allowed: ${account.limits.ssoAllowed ? "yes" : "no"} → ${form.ssoAllowed ? "yes" : "no"}`,
    );
  }
  if (Number(form.exports) !== account.limits.exports) {
    changes.push(`Export limit: ${account.limits.exports} → ${form.exports}`);
  }
  if (Number(form.uploadGb) !== account.limits.uploadGb) {
    changes.push(
      `Upload GB limit: ${account.limits.uploadGb} → ${form.uploadGb}`,
    );
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
  const [form, setForm] = useState<BillingAccountForm>(() =>
    accountToForm(account),
  );
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
          <Button size="sm" variant="secondary">
            <Icon icon={PropertyEditIcon} size={14} strokeWidth={2} />
            Edit billing account
          </Button>
        </DialogTrigger>

        <AppDialogContent
          title="Edit billing account"
          description="Edit billing account settings for this workspace."
          subtitle="Update terms, limit enforcement, and usage limits. All changes are reviewed in a confirmation step before saving."
          variant="form"
          size="xl"
          className="sm:max-w-2xl"
          primaryAction={{
            label: "Save changes",
            loadingLabel: "Saving…",
            form: formId,
            type: "submit",
            loading: isPending,
            disabled: isPending || !pendingPayload,
            icon: Tick02Icon,
          }}
          secondaryAction={{
            label: "Cancel",
            disabled: isPending,
            icon: Cancel01Icon,
          }}
        >
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveClick();
            }}
            noValidate
          >
            <FieldGroup className="gap-6 p-4">
              <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-medium">Billing terms</h4>
                  <InfoTooltip content="Account status, billing cadence, currency, and payment terms." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="billing-status">Status</Label>
                    {isPastDueStatus ? (
                      <div className="space-y-1.5">
                        <Badge
                          variant={billingAccountStatusVariant(
                            account.status,
                            account.pastDue,
                          )}
                          className="capitalize"
                        >
                          {getBillingStatusLabel(
                            account.status,
                            account.pastDue,
                          )}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Past due is set automatically from Chargebee when
                          invoices are overdue.
                        </p>
                      </div>
                    ) : (
                      <Select
                        value={form.status}
                        onValueChange={(status) =>
                          patchForm({
                            status: status as BillingAccount["status"],
                          })
                        }
                      >
                        <SelectTrigger
                          id="billing-status"
                          size="md"
                          className="w-full bg-background"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            ["draft", "pilot", "active", "cancelled"] as const
                          ).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor="billing-cadence">Cadence</Label>
                    <Select
                      value={form.billingCadence}
                      onValueChange={(billingCadence) =>
                        patchForm({
                          billingCadence:
                            billingCadence as BillingAccount["billingCadence"],
                        })
                      }
                    >
                      <SelectTrigger
                        id="billing-cadence"
                        size="md"
                        className="w-full bg-background"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <Label htmlFor="billing-currency">Currency</Label>
                    <Input
                      id="billing-currency"
                      value={form.currency}
                      onChange={(event) =>
                        patchForm({ currency: event.target.value })
                      }
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="billing-net-terms">Net terms (days)</Label>
                    <Input
                      id="billing-net-terms"
                      type="number"
                      min={0}
                      step={1}
                      value={form.netTermDays}
                      onChange={(event) =>
                        patchForm({ netTermDays: event.target.value })
                      }
                    />
                  </Field>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-medium">Access & enforcement</h4>
                  <InfoTooltip content="Limit enforcement and single sign-on settings for this workspace." />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                    <Label htmlFor="edit-limits-enabled">
                      Limit enforcement
                    </Label>
                    <Switch
                      id="edit-limits-enabled"
                      checked={form.limitsEnabled}
                      onCheckedChange={(limitsEnabled) =>
                        patchForm({ limitsEnabled })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                    <Label htmlFor="edit-sso-allowed">SSO allowed</Label>
                    <Switch
                      id="edit-sso-allowed"
                      checked={form.ssoAllowed}
                      onCheckedChange={(ssoAllowed) =>
                        patchForm({ ssoAllowed })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                    <Label htmlFor="edit-sso-enabled">SSO enabled</Label>
                    <Switch
                      id="edit-sso-enabled"
                      checked={form.ssoEnabled}
                      onCheckedChange={(ssoEnabled) =>
                        patchForm({ ssoEnabled })
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-medium">Usage limits</h4>
                  <InfoTooltip content="Seat allocation from Chargebee and export/upload limits for this workspace." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <Label>Seat limit</Label>
                    <p className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                      {account.usageLimits.seats.toLocaleString()} seats
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mirrored from Chargebee. Used: {summary.usage.activeSeats}
                    </p>
                  </Field>
                  <Field>
                    <Label htmlFor="billing-enforcement-mode">
                      Enforcement mode
                    </Label>
                    <Select
                      value={form.enforcementMode}
                      onValueChange={(enforcementMode) =>
                        patchForm({
                          enforcementMode:
                            enforcementMode as EnforcementMode,
                        })
                      }
                    >
                      <SelectTrigger
                        id="billing-enforcement-mode"
                        size="md"
                        className="w-full bg-background"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overage">Allow overage</SelectItem>
                        <SelectItem value="block">
                          Block when over limit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="billing-exports">Export limit</Label>
                    <Input
                      id="billing-exports"
                      type="number"
                      min={0}
                      step={1}
                      value={form.exports}
                      onChange={(event) =>
                        patchForm({ exports: event.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Used: {summary.usage.exports}
                    </p>
                  </Field>
                  <Field>
                    <Label htmlFor="billing-upload-gb">Upload GB limit</Label>
                    <Input
                      id="billing-upload-gb"
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.uploadGb}
                      onChange={(event) =>
                        patchForm({ uploadGb: event.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Used: {summary.usage.uploadGb.toFixed(2)} GB · decimals
                      allowed (e.g. 0.5)
                    </p>
                  </Field>
                </div>
              </section>

              {formError ? (
                <p className="text-xs text-destructive">{formError}</p>
              ) : null}
            </FieldGroup>
          </form>
        </AppDialogContent>
      </Dialog>

      <PlatformBillingConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Save billing account changes?"
        icon={CreditCardIcon}
        confirmLabel="Confirm save"
        isPending={isPending}
        onConfirm={handleConfirmSave}
        description={
          <div className="space-y-2">
            <p>
              The following updates will be applied to this workspace billing
              account:
            </p>
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
