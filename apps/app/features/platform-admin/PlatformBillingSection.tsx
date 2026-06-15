"use client";

import { useState, type ReactNode } from "react";
import { useCreatePlatformBillingAccount } from "@/hooks/platform-admin/useCreatePlatformBillingAccount";
import { useGetPlatformBillingAccount } from "@/hooks/platform-admin/useGetPlatformBillingAccount";
import { usePlatformBillingActions } from "@/hooks/platform-admin/usePlatformBillingActions";
import { useUpdatePlatformBillingAccount } from "@/hooks/platform-admin/useUpdatePlatformBillingAccount";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { DialogEditPlatformBillingAccount } from "@/features/platform-admin/DialogEditPlatformBillingAccount";
import { DialogEditPlatformWorkspaceFreezes } from "@/features/platform-admin/DialogEditPlatformWorkspaceFreezes";
import { DialogPlatformBillingOperations } from "@/features/platform-admin/DialogPlatformBillingOperations";
import { PlatformBillingFieldLabel } from "@/features/platform-admin/PlatformBillingFieldLabel";
import { PlatformChargebeeSection } from "@/features/platform-admin/PlatformChargebeeSection";
import { PlatformUsageEventsTable } from "@/features/platform-admin/PlatformUsageEventsTable";
import { BILLING_SUMMARY_FIELD_TOOLTIPS } from "@/features/platform-admin/platformBillingFieldTooltips";
import { formatUploadVolumeHint } from "@/utils/formatUploadVolume";
import { getErrorMessage } from "@/lib/api-error";

function ReadOnlyField({
  label,
  tooltip,
  value,
  hint,
}: {
  label: string;
  tooltip: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <PlatformBillingFieldLabel
        label={label}
        tooltip={tooltip}
        className="text-[11px] font-normal uppercase tracking-wide text-muted-foreground"
      />
      <p className="text-[15px] font-semibold leading-tight">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ReadOnlyToggleCard({
  label,
  tooltip,
  enabled,
  onLabel = "On",
  offLabel = "Off",
}: {
  label: string;
  tooltip: string;
  enabled: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5">
      <PlatformBillingFieldLabel
        label={label}
        tooltip={tooltip}
        className="text-[11px] font-normal uppercase tracking-wide text-muted-foreground"
      />
      <EnabledBadge enabled={enabled} onLabel={onLabel} offLabel={offLabel} />
    </div>
  );
}

function PlatformBillingNotSetState({
  workspaceId,
  onAccountCreated,
}: {
  workspaceId: string;
  onAccountCreated: () => void;
}) {
  const createAccount = useCreatePlatformBillingAccount(workspaceId);

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="max-w-prose">
          <h2 className="text-sm font-semibold">Billing account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            No billing configuration yet. Creating an account lets you set usage limits, enable limit enforcement,
            and control freezes. New workspaces usually start in draft automatically.
          </p>
        </div>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() =>
            createAccount.mutate(undefined, { onSuccess: onAccountCreated })
          }
          disabled={createAccount.isPending}
        >
          {createAccount.isPending ? "Creating account…" : "Create billing account"}
        </Button>
      </div>
    </div>
  );
}

function EnabledBadge({ enabled, onLabel = "On", offLabel = "Off" }: {
  enabled: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <Badge variant={enabled ? "default" : "secondary"}>
      {enabled ? onLabel : offLabel}
    </Badge>
  );
}

export function PlatformBillingSection({
  workspaceId,
  billingStatus = "not_set",
}: {
  workspaceId: string;
  billingStatus?: string;
}) {
  const [accountCreatedLocally, setAccountCreatedLocally] = useState(false);
  const hasAccount = billingStatus !== "not_set" || accountCreatedLocally;
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetPlatformBillingAccount(workspaceId, {
      enabled: hasAccount,
    });
  const updateAccount = useUpdatePlatformBillingAccount(workspaceId);
  const { updateFreezes, createAdjustment } = usePlatformBillingActions(workspaceId);

  if (!hasAccount) {
    return (
      <PlatformBillingNotSetState
        workspaceId={workspaceId}
        onAccountCreated={() => setAccountCreatedLocally(true)}
      />
    );
  }

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-destructive/20 bg-destructive/5 p-5 text-center">
        <p className="text-sm font-medium text-destructive">
          Unable to load billing account
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {getErrorMessage(error, "Please try again in a moment.")}
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed border-destructive/20 bg-destructive/5 p-5 text-center">
        <p className="text-sm font-medium text-destructive">
          Unable to load billing account
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Billing is configured for this workspace, but no account details were returned.
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { account, summary, freezes } = data;

  return (
    <div className="space-y-4">
      {/* Billing account */}
      <section className="space-y-5 rounded-xl border border-border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">Billing account</h2>
              {account.status === "draft" && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Draft
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-prose">
              Contract terms, limit enforcement, and usage limits for this workspace.
            </p>
            {account.status === "draft" ? (
              <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-400">
                This account is in draft. Switch to pilot or active and turn limit enforcement on when you&apos;re ready to apply usage guardrails.
              </p>
            ) : null}
          </div>
          <DialogEditPlatformBillingAccount
            account={account}
            summary={summary}
            isPending={updateAccount.isPending}
            onSave={async (input) => {
              await updateAccount.mutateAsync(input);
            }}
          />
        </div>

        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
          <ReadOnlyField
            label="Status"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.status}
            value={<span className="capitalize">{account.status}</span>}
          />
          <ReadOnlyField
            label="Billing cadence"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.cadence}
            value={<span className="capitalize">{account.billingCadence}</span>}
          />
          <ReadOnlyField
            label="Currency"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.currency}
            value={account.currency}
          />
          <ReadOnlyField
            label="Net terms"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.netTerms}
            value={`${account.netTermDays} days`}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <ReadOnlyToggleCard
            label="Limit enforcement"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.metering}
            enabled={account.limitsEnabled}
          />
          <ReadOnlyToggleCard
            label="Past due"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.pastDue}
            enabled={account.pastDue}
            onLabel="Yes"
            offLabel="No"
          />
          <ReadOnlyToggleCard
            label="SSO add-on"
            tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.sso}
            enabled={account.sso.enabled}
          />
        </div>

        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Usage limits (current period)
          </div>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-3">
            <ReadOnlyField
              label="Active members"
              tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.seatMonths}
              value={account.usageLimits.seats.toLocaleString()}
              hint={`Used: ${summary.usage.activeSeats.toLocaleString()}`}
            />
            <ReadOnlyField
              label="Exports"
              tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.exports}
              value={account.usageLimits.exports.toLocaleString()}
              hint={`Used: ${summary.usage.exports.toLocaleString()}`}
            />
            <ReadOnlyField
              label="Upload GB"
              tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.uploadGb}
              value={account.usageLimits.uploadGb.toLocaleString()}
              hint={formatUploadVolumeHint(summary.usage.uploadBytes, summary.usage.uploadGb)}
            />
          </div>
        </div>
      </section>

      {/* Freezes */}
      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Workspace freezes</h2>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-prose">
              Immediate operational controls. These are independent of billing status and take effect right away.
            </p>
          </div>
          <DialogEditPlatformWorkspaceFreezes
            freezes={freezes}
            isPending={updateFreezes.isPending}
            onSave={async (input) => {
              await updateFreezes.mutateAsync(input);
            }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <PlatformBillingFieldLabel
                label="Usage freeze"
                tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.usageFreeze}
              />
              <EnabledBadge enabled={freezes.usageFreeze.enabled} />
            </div>
            <p className="text-sm text-muted-foreground">
              Prevents new invites, exports, and source uploads. Users can still log in and view existing content.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <PlatformBillingFieldLabel
                label="Access freeze"
                tooltip={BILLING_SUMMARY_FIELD_TOOLTIPS.accessFreeze}
              />
              <EnabledBadge enabled={freezes.accessFreeze.enabled} />
            </div>
            <p className="text-sm text-muted-foreground">
              Blocks all login and usage for the workspace. Use only for full suspension scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* Usage corrections */}
      <section className="space-y-4 rounded-xl border border-border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Usage corrections</h2>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-prose">
              Manual usage corrections for the current billing period. Each adjustment asks for
              confirmation.
            </p>
          </div>
          <DialogPlatformBillingOperations
            isAdjustmentPending={createAdjustment.isPending}
            onAdjustment={async (input) => {
              await createAdjustment.mutateAsync(input);
            }}
          />
        </div>
      </section>

      <PlatformChargebeeSection workspaceId={workspaceId} account={account} />

      <section className="space-y-3 rounded-xl border border-border bg-background p-5">
        <div>
          <h2 className="text-sm font-semibold">Recent usage events</h2>
          <p className="mt-0.5 text-xs text-muted-foreground max-w-prose">
            Ledger entries from exports, uploads, and adjustments with Chargebee sync status.
          </p>
        </div>
        <PlatformUsageEventsTable workspaceId={workspaceId} />
      </section>
    </div>
  );
}
