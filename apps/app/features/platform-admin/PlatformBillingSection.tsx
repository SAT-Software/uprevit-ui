"use client";

import { useState, type ReactNode } from "react";
import { useCreatePlatformBillingAccount } from "@/hooks/platform-admin/useCreatePlatformBillingAccount";
import { useGetPlatformBillingAccount } from "@/hooks/platform-admin/useGetPlatformBillingAccount";
import { usePlatformBillingActions } from "@/hooks/platform-admin/usePlatformBillingActions";
import { useUpdatePlatformBillingAccount } from "@/hooks/platform-admin/useUpdatePlatformBillingAccount";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { DialogEditPlatformBillingAccount } from "@/features/platform-admin/DialogEditPlatformBillingAccount";
import { DialogEditPlatformWorkspaceFreezes } from "@/features/platform-admin/DialogEditPlatformWorkspaceFreezes";
import { DialogPlatformBillingOperations } from "@/features/platform-admin/DialogPlatformBillingOperations";
import { PlatformChargebeeSection } from "@/features/platform-admin/PlatformChargebeeSection";
import { UsageMetricCard } from "@/features/billing/UsageMetricCard";
import {
  BILLING_OPERATIONS_FIELD_TOOLTIPS,
  BILLING_SUMMARY_FIELD_TOOLTIPS,
} from "@/features/platform-admin/platformBillingFieldTooltips";
import { formatUploadVolumeDisplay } from "@/utils/formatUploadVolume";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import {
  billingAccountStatusVariant,
  getBillingStatusLabel,
} from "@/utils/billingStatusDisplay";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@uprevit/ui/lib/utils";
import {
  AlertCircleIcon,
  BanIcon,
  Calendar03Icon,
  CircleDollarSignIcon,
  CircleLock01Icon,
  MasterCardIcon,
  Key01Icon,
  LimitationIcon,
  SlidersHorizontalIcon,
  CalendarSyncIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import type { IconProps } from "@uprevit/ui/components/common/Icon";
import type { PlatformBillingDetail } from "@/types/billing";
import type { UpdatePlatformBillingAccountInput } from "@/types/platform-admin";

function fieldCellClassName() {
  return cn(
    "group flex items-start gap-4 p-4",
    "border-b border-border last:border-b-0",
    "md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(odd)]:border-r",
  );
}

function BillingFieldCell({
  icon,
  label,
  tooltip,
  value,
  hint,
}: {
  icon: IconProps["icon"];
  label: string;
  tooltip?: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className={fieldCellClassName()}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground">
        <Icon icon={icon} size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-normal text-muted-foreground/60">
            {label}
          </p>
          {tooltip ? <InfoTooltip content={tooltip} /> : null}
        </div>
        <div className="text-sm font-medium text-foreground">{value}</div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

function OnOffBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "green" : "outline"}>
      {enabled ? "On" : "Off"}
    </Badge>
  );
}

function FreezeBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "red" : "outline"}>
      {enabled ? "Frozen" : "Off"}
    </Badge>
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
    <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border pl-3 pr-2">
        <p className="text-sm font-medium">Billing account</p>
        <InfoTooltip content="Create a billing account to configure limits, freezes, and Chargebee linking." />
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
            <Icon icon={CreditCardIcon} size={18} strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">No billing account yet</p>
            <p className="max-w-prose text-sm text-muted-foreground">
              Creating an account lets you set usage limits, enable limit
              enforcement, and control freezes.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() =>
            createAccount.mutate(undefined, { onSuccess: onAccountCreated })
          }
          disabled={createAccount.isPending}
        >
          {createAccount.isPending
            ? "Creating account…"
            : "Create billing account"}
        </Button>
      </div>
    </div>
  );
}

function BillingLoadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
        <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium">Unable to load billing account</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

function BillingAccountUnavailable({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
        <Icon icon={CreditCardIcon} size={18} strokeWidth={2} />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function usePlatformBillingSectionState(
  workspaceId: string,
  billingStatus = "not_set",
) {
  const [accountCreatedLocally, setAccountCreatedLocally] = useState(false);
  const hasAccount = billingStatus !== "not_set" || accountCreatedLocally;
  const query = useGetPlatformBillingAccount(workspaceId, {
    enabled: hasAccount,
  });
  const updateAccount = useUpdatePlatformBillingAccount(workspaceId);
  const { updateFreezes, createAdjustment } =
    usePlatformBillingActions(workspaceId);

  return {
    hasAccount,
    setAccountCreatedLocally,
    query,
    updateAccount,
    updateFreezes,
    createAdjustment,
  };
}

function BillingAccountCard({
  data,
  isPending,
  onSave,
}: {
  data: PlatformBillingDetail;
  isPending: boolean;
  onSave: (input: UpdatePlatformBillingAccountInput) => Promise<void>;
}) {
  const { account, summary } = data;
  const statusLabel = getBillingStatusLabel(account.status, account.pastDue);

  const accountFields = [
    {
      id: "status",
      icon: MasterCardIcon,
      label: "Status",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.status,
      value: (
        <Badge
          variant={billingAccountStatusVariant(account.status, account.pastDue)}
        >
          {statusLabel}
        </Badge>
      ),
    },
    {
      id: "cadence",
      icon: CalendarSyncIcon,
      label: "Billing cadence",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.cadence,
      value: <span className="capitalize">{account.billingCadence}</span>,
    },
    {
      id: "currency",
      icon: CircleDollarSignIcon,
      label: "Currency",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.currency,
      value: account.currency,
    },
    {
      id: "period",
      icon: Calendar03Icon,
      label: "Billing period",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.currentPeriod,
      value: (
        <>
          {formatToLocalDate(summary.period.start)} –{" "}
          {formatToLocalDate(summary.period.end)}
        </>
      ),
      hint:
        summary.period.source === "chargebee"
          ? "Chargebee subscription term"
          : "Internal billing period",
    },
    {
      id: "limits",
      icon: LimitationIcon,
      label: "Limit enforcement",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.limits,
      value: <OnOffBadge enabled={account.limitsEnabled} />,
    },
    {
      id: "sso",
      icon: Key01Icon,
      label: "SSO add-on",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.sso,
      value: <OnOffBadge enabled={account.sso.enabled} />,
    },
  ] as const;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="text-sm font-medium">Billing account</p>
          <InfoTooltip content="Subscription status, cadence, and add-on configuration for this workspace." />
          {account.status === "draft" ? (
            <Badge variant="yellow">Draft</Badge>
          ) : null}
        </div>
        <DialogEditPlatformBillingAccount
          account={account}
          summary={summary}
          isPending={isPending}
          onSave={onSave}
        />
      </div>

      {account.status === "draft" ? (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-900/50 dark:bg-amber-950/30">
          <Icon
            icon={AlertCircleIcon}
            size={14}
            strokeWidth={2}
            className="shrink-0 text-amber-700 dark:text-amber-300"
          />
          <p className="text-xs text-amber-900 dark:text-amber-100">
            This account is in draft. Switch to pilot or active and turn limit
            enforcement on when you&apos;re ready to apply usage guardrails.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2">
        {accountFields.map((field) => (
          <BillingFieldCell
            key={field.id}
            icon={field.icon}
            label={field.label}
            tooltip={field.tooltip}
            value={field.value}
            hint={"hint" in field ? field.hint : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function WorkspaceFreezesCard({
  data,
  isPending,
  onSave,
}: {
  data: PlatformBillingDetail;
  isPending: boolean;
  onSave: (input: {
    usageFreezeEnabled?: boolean;
    accessFreezeEnabled?: boolean;
  }) => Promise<void>;
}) {
  const { freezes } = data;
  const freezeFields = [
    {
      id: "usageFreeze",
      icon: BanIcon,
      label: "Usage freeze",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.usageFreeze,
      value: <FreezeBadge enabled={freezes.usageFreeze.enabled} />,
      hint: "Prevents new invites, exports, and source uploads. Users can still log in and view existing content.",
    },
    {
      id: "accessFreeze",
      icon: CircleLock01Icon,
      label: "Access freeze",
      tooltip: BILLING_SUMMARY_FIELD_TOOLTIPS.accessFreeze,
      value: <FreezeBadge enabled={freezes.accessFreeze.enabled} />,
      hint: "Blocks all login and usage for the workspace. Use only for full suspension scenarios.",
    },
  ] as const;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Workspace freezes</p>
          <InfoTooltip content="Operator controls that temporarily restrict usage or block access for this workspace." />
        </div>
        <DialogEditPlatformWorkspaceFreezes
          freezes={freezes}
          isPending={isPending}
          onSave={onSave}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {freezeFields.map((field) => (
          <BillingFieldCell
            key={field.id}
            icon={field.icon}
            label={field.label}
            tooltip={field.tooltip}
            value={field.value}
            hint={field.hint}
          />
        ))}
      </div>
    </section>
  );
}

function UsageMetricsGrid({ data }: { data: PlatformBillingDetail }) {
  const { summary } = data;
  const uploadVolume = formatUploadVolumeDisplay(
    summary.usage.uploadBytes,
    summary.usage.uploadGb,
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      <UsageMetricCard
        label="Active members"
        info="Number of active members in this workspace for the current billing period."
        used={summary.usage.activeSeats}
        included={summary.usageLimits.seats}
        unit="seats"
        usedValue={summary.limitStatus.seats.used}
        limitValue={summary.limitStatus.seats.limit}
        isOverLimit={summary.limitStatus.seats.overLimit}
        isAtLimit={
          !summary.limitStatus.seats.overLimit &&
          summary.usageLimits.seats > 0 &&
          summary.limitStatus.seats.used >= summary.limitStatus.seats.limit
        }
        colorClass="from-sky-400 via-sky-500 to-sky-600"
      />
      <UsageMetricCard
        label="Exports"
        info="Total product exports generated during this billing period."
        used={summary.usage.exports}
        included={summary.usageLimits.exports}
        unit="exports"
        usedValue={summary.limitStatus.exports.used}
        limitValue={summary.limitStatus.exports.limit}
        isOverLimit={summary.limitStatus.exports.overLimit}
        isAtLimit={
          !summary.limitStatus.exports.overLimit &&
          summary.usageLimits.exports > 0 &&
          summary.limitStatus.exports.used >= summary.limitStatus.exports.limit
        }
        colorClass="from-amber-400 via-amber-500 to-amber-600"
      />
      <UsageMetricCard
        label="Upload volume"
        info="Total source file upload volume used during this billing period."
        used={uploadVolume.primary}
        included={summary.usageLimits.uploadGb}
        unit="GB"
        usedValue={summary.limitStatus.uploadGb.used}
        limitValue={summary.limitStatus.uploadGb.limit}
        secondaryUsed={`${uploadVolume.secondary} used`}
        isOverLimit={summary.limitStatus.uploadGb.overLimit}
        isAtLimit={
          !summary.limitStatus.uploadGb.overLimit &&
          summary.usageLimits.uploadGb > 0 &&
          summary.limitStatus.uploadGb.used >=
            summary.limitStatus.uploadGb.limit
        }
        colorClass="from-emerald-400 via-emerald-500 to-emerald-600"
      />
    </div>
  );
}

function UsageCorrectionsCard({
  isAdjustmentPending,
  onAdjustment,
}: {
  isAdjustmentPending: boolean;
  onAdjustment: (input: {
    metric: "completed_export" | "upload_bytes";
    quantityDelta: number;
  }) => Promise<void>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Usage corrections</p>
          <InfoTooltip
            content={BILLING_OPERATIONS_FIELD_TOOLTIPS.usageAdjustment}
          />
        </div>
        <DialogPlatformBillingOperations
          isAdjustmentPending={isAdjustmentPending}
          onAdjustment={onAdjustment}
        />
      </div>
      <div className="flex items-start gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
          <Icon icon={SlidersHorizontalIcon} size={18} strokeWidth={2} />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium">Manual usage adjustments</p>
          <p className="text-sm text-muted-foreground">
            Correct recorded exports or upload bytes for the current billing
            period. Each change is audited.
          </p>
        </div>
      </div>
    </section>
  );
}

export function PlatformBillingOverviewSection({
  workspaceId,
  billingStatus = "not_set",
}: {
  workspaceId: string;
  billingStatus?: string;
}) {
  const {
    hasAccount,
    setAccountCreatedLocally,
    query,
    updateAccount,
    updateFreezes,
  } = usePlatformBillingSectionState(workspaceId, billingStatus);
  const { data, isLoading, isError, error, refetch, isFetching } = query;

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
      <div className="flex flex-col gap-2">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <BillingLoadError
        message={
          isError
            ? getErrorMessage(error, "Please try again in a moment.")
            : "Billing is configured for this workspace, but no account details were returned."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <BillingAccountCard
        data={data}
        isPending={updateAccount.isPending}
        onSave={async (input) => {
          await updateAccount.mutateAsync(input);
        }}
      />
      <WorkspaceFreezesCard
        data={data}
        isPending={updateFreezes.isPending}
        onSave={async (input) => {
          await updateFreezes.mutateAsync(input);
        }}
      />
    </div>
  );
}

export function PlatformBillingUsageSection({
  workspaceId,
  billingStatus = "not_set",
}: {
  workspaceId: string;
  billingStatus?: string;
}) {
  const { hasAccount, query, createAdjustment } =
    usePlatformBillingSectionState(workspaceId, billingStatus);
  const { data, isLoading, isError, error, refetch, isFetching } = query;

  if (!hasAccount) {
    return (
      <BillingAccountUnavailable
        title="Usage unavailable"
        description="Create a billing account from the Overview tab to track seats, exports, and upload volume."
      />
    );
  }

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="flex flex-col gap-2">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <BillingLoadError
        message={
          isError
            ? getErrorMessage(error, "Please try again in a moment.")
            : "Billing is configured for this workspace, but no account details were returned."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <UsageMetricsGrid data={data} />
      <UsageCorrectionsCard
        isAdjustmentPending={createAdjustment.isPending}
        onAdjustment={async (input) => {
          await createAdjustment.mutateAsync(input);
        }}
      />
    </div>
  );
}

export function PlatformBillingChargebeeTab({
  workspaceId,
  billingStatus = "not_set",
}: {
  workspaceId: string;
  billingStatus?: string;
}) {
  const { hasAccount, query } = usePlatformBillingSectionState(
    workspaceId,
    billingStatus,
  );
  const { data, isLoading, isError, error, refetch, isFetching } = query;

  if (!hasAccount) {
    return (
      <BillingAccountUnavailable
        title="Chargebee unavailable"
        description="Create a billing account from the Overview tab before linking a Chargebee customer or subscription."
      />
    );
  }

  if (isLoading || (isFetching && !data)) {
    return <Skeleton className="h-56 w-full rounded-2xl" />;
  }

  if (isError || !data) {
    return (
      <BillingLoadError
        message={
          isError
            ? getErrorMessage(error, "Please try again in a moment.")
            : "Billing is configured for this workspace, but no account details were returned."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <PlatformChargebeeSection
      workspaceId={workspaceId}
      account={data.account}
      failedUsageEventSyncCount={data.failedUsageEventSyncCount}
    />
  );
}
