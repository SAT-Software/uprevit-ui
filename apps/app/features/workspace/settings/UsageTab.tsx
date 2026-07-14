"use client";

import { useState } from "react";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetBillingSummary } from "@/hooks/billing/useGetBillingSummary";
import { useUpdateBillingPreferences } from "@/hooks/billing/useUpdateBillingPreferences";
import { UsageMetricCard } from "@/features/billing/UsageMetricCard";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Field, FieldLabel } from "@uprevit/ui/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Separator } from "@uprevit/ui/components/ui/separator";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  AlertCircleIcon,
  DashboardBrowsingIcon,
  LimitationIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { formatUploadVolumeDisplay } from "@/utils/formatUploadVolume";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import { getBillingStatusLabel } from "@/utils/billingStatusDisplay";
import type {
  BillingAccountStatus,
  EnforcementMode,
  WorkspaceBillingSummary,
} from "@/types/billing";
import type { BillingPreferencesInput } from "@/hooks/billing/useUpdateBillingPreferences";

function billingStatusTone(
  status: BillingAccountStatus,
  pastDue?: boolean | null,
): string {
  if (pastDue || status === "past_due") return "bg-amber-500";
  if (status === "active") return "bg-emerald-500";
  if (status === "cancelled") return "bg-muted-foreground/50";
  return "bg-sky-500";
}

function UsagePeriodHoverCard({
  status,
  pastDue,
  periodStart,
  periodEnd,
  periodSource,
  limitsEnabled,
}: {
  status: BillingAccountStatus;
  pastDue?: boolean | null;
  periodStart: string;
  periodEnd: string;
  periodSource: "chargebee" | "internal";
  limitsEnabled: boolean;
}) {
  const statusLabel = getBillingStatusLabel(status, pastDue);
  const periodLabel =
    periodSource === "chargebee" ? "Subscription term" : "Billing period";

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="View billing period overview"
        >
          <Icon icon={DashboardBrowsingIcon} size={14} strokeWidth={2} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-72 p-0">
        <div className="px-4 py-3">
          <p className="text-sm font-medium text-foreground">{periodLabel}</p>
          <p className="text-xs text-muted-foreground">
            {formatToLocalDate(periodStart)} – {formatToLocalDate(periodEnd)}
          </p>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "ml-0.5 size-2.5 shrink-0 rounded-full",
                  billingStatusTone(status, pastDue),
                )}
              />
              <p className="text-xs text-muted-foreground">Status</p>
            </div>
            <p className="text-xs font-medium capitalize text-foreground">
              {statusLabel}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Icon
                icon={LimitationIcon}
                size={14}
                strokeWidth={2}
                className="text-muted-foreground/70"
              />
              <p className="text-xs text-muted-foreground">Limit enforcement</p>
            </div>
            <p
              className={cn(
                "text-xs font-medium",
                limitsEnabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {limitsEnabled ? "On" : "Off"}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function UsageLimitEnforcementForm({
  summary,
  isSaving,
  onSaved,
  onSave,
}: {
  summary: WorkspaceBillingSummary;
  isSaving: boolean;
  onSaved: () => void | Promise<void>;
  onSave: (
    input: BillingPreferencesInput,
    options?: { onSuccess?: () => void | Promise<void> },
  ) => void;
}) {
  const [enforcementMode, setEnforcementMode] = useState(
    summary.enforcementMode,
  );
  const [exportsLimit, setExportsLimit] = useState(
    String(summary.usageLimits.exports),
  );
  const [uploadGbLimit, setUploadGbLimit] = useState(
    String(summary.usageLimits.uploadGb),
  );
  const [formDirty, setFormDirty] = useState(false);

  const markDirty = () => {
    if (!formDirty) {
      setFormDirty(true);
    }
  };

  const exportsTrimmed = exportsLimit.trim();
  const uploadGbTrimmed = uploadGbLimit.trim();
  const parsedExports = Number(exportsTrimmed);
  const parsedUploadGb = Number(uploadGbTrimmed);
  const limitsValid =
    exportsTrimmed !== "" &&
    uploadGbTrimmed !== "" &&
    Number.isInteger(parsedExports) &&
    parsedExports >= 0 &&
    Number.isFinite(parsedUploadGb) &&
    parsedUploadGb >= 0;

  const savePreferences = () => {
    if (!limitsValid) return;
    onSave(
      {
        enforcementMode,
        exports: parsedExports,
        uploadGb: parsedUploadGb,
      },
      {
        onSuccess: async () => {
          await onSaved();
          setFormDirty(false);
        },
      },
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Limit enforcement</p>
          <InfoTooltip content="Choose whether over-limit usage is allowed or blocked for exports and uploads." />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={savePreferences}
          disabled={!formDirty || !limitsValid || isSaving}
        >
          <Icon icon={LimitationIcon} size={16} strokeWidth={2} />
          Save preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="enforcement-mode">Enforcement mode</FieldLabel>
          <Select
            value={enforcementMode}
            onValueChange={(value) => {
              markDirty();
              setEnforcementMode(value as EnforcementMode);
            }}
            disabled={isSaving}
          >
            <SelectTrigger id="enforcement-mode" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overage">Allow overage</SelectItem>
              <SelectItem value="block">Block when over limit</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="exports-limit">Export limit</FieldLabel>
          <InputGroup size="md">
            <InputGroupInput
              id="exports-limit"
              type="number"
              min={0}
              step={1}
              value={exportsLimit}
              onChange={(event) => {
                markDirty();
                setExportsLimit(event.target.value);
              }}
              disabled={isSaving}
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel htmlFor="upload-limit">Upload limit (GB)</FieldLabel>
          <InputGroup size="md">
            <InputGroupInput
              id="upload-limit"
              type="number"
              min={0}
              step={0.1}
              value={uploadGbLimit}
              onChange={(event) => {
                markDirty();
                setUploadGbLimit(event.target.value);
              }}
              disabled={isSaving}
            />
          </InputGroup>
        </Field>

        <p className="text-xs text-muted-foreground lg:col-span-3">
          Seat limits are set from your subscription and cannot be changed here.
        </p>
      </div>
    </div>
  );
}

function UsageTab() {
  const { data, isLoading, isError, error, refetch } = useGetBillingSummary();
  const updatePreferences = useUpdateBillingPreferences();
  const [formResetKey, setFormResetKey] = useState(0);

  const handlePreferencesSaved = async () => {
    await refetch();
    setFormResetKey((key) => key + 1);
  };

  if (isLoading) {
    return (
      <div className="-m-2 flex flex-col">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Usage & limits</p>
            <InfoTooltip content="Review workspace usage for the current billing period and configure export and upload limit enforcement." />
          </div>
          <Skeleton className="h-7 w-28 rounded-md" />
        </div>
        <div className="flex flex-col gap-2 p-2">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    const errorMessage =
      isError && error instanceof Error ? error.message.toLowerCase() : "";
    const isAccessFrozen = errorMessage.includes("workspace access is frozen");
    const isUsageFrozen = errorMessage.includes("workspace usage is frozen");

    return (
      <div className="-m-2 flex flex-col">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <p className="text-sm font-medium">Usage & limits</p>
          <InfoTooltip content="Review workspace usage for the current billing period and configure export and upload limit enforcement." />
        </div>
        <div className="p-2">
          {isAccessFrozen || isUsageFrozen ? (
            <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/40 dark:text-amber-300">
                <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
              </div>
              <p className="text-sm text-amber-900 dark:text-amber-100">
                {isAccessFrozen
                  ? "Workspace access is frozen by a platform operator."
                  : "Workspace usage is frozen. Invites, exports, and uploads are blocked."}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
                <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="text-sm font-medium">
                  Unable to load usage information
                </div>
                <div className="text-sm text-muted-foreground">
                  Something went wrong while fetching your usage for this
                  period.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const hasOverage =
    data.limitStatus.seats.overLimit ||
    data.limitStatus.exports.overLimit ||
    data.limitStatus.uploadGb.overLimit;
  const uploadVolume = formatUploadVolumeDisplay(
    data.usage.uploadBytes,
    data.usage.uploadGb,
  );

  return (
    <div className="-m-2 flex flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Usage & limits</p>
          <InfoTooltip content="Review workspace usage for the current billing period and configure export and upload limit enforcement." />
        </div>
        <UsagePeriodHoverCard
          status={data.account.status}
          pastDue={data.account.pastDue}
          periodStart={data.period.start}
          periodEnd={data.period.end}
          periodSource={data.period.source}
          limitsEnabled={data.limitsEnabled}
        />
      </div>

      <div className="flex flex-col gap-2 p-2">
        {hasOverage && data.enforcementMode === "overage" ? (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/50 dark:bg-amber-950/30">
            <Icon
              icon={AlertCircleIcon}
              size={14}
              strokeWidth={2}
              className="shrink-0 text-amber-700 dark:text-amber-300"
            />
            <p className="text-xs text-amber-900 dark:text-amber-100">
              Usage exceeds configured limits this period.
            </p>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <UsageMetricCard
            label="Active members"
            info="Number of active members in your workspace for this billing period."
            used={data.usage.activeSeats}
            included={data.usageLimits.seats}
            unit="seats"
            usedValue={data.limitStatus.seats.used}
            limitValue={data.limitStatus.seats.limit}
            isOverLimit={data.limitStatus.seats.overLimit}
            isAtLimit={
              !data.limitStatus.seats.overLimit &&
              data.usageLimits.seats > 0 &&
              data.limitStatus.seats.used >= data.limitStatus.seats.limit
            }
            colorClass="from-sky-400 via-sky-500 to-sky-600"
          />
          <UsageMetricCard
            label="Exports"
            info="Total product exports generated during this billing period."
            used={data.usage.exports}
            included={data.usageLimits.exports}
            unit="exports"
            usedValue={data.limitStatus.exports.used}
            limitValue={data.limitStatus.exports.limit}
            isOverLimit={data.limitStatus.exports.overLimit}
            isAtLimit={
              !data.limitStatus.exports.overLimit &&
              data.usageLimits.exports > 0 &&
              data.limitStatus.exports.used >= data.limitStatus.exports.limit
            }
            colorClass="from-amber-400 via-amber-500 to-amber-600"
          />
          <UsageMetricCard
            label="Upload volume"
            info="Total source file upload volume used during this billing period."
            used={uploadVolume.primary}
            included={data.usageLimits.uploadGb}
            unit="GB"
            usedValue={data.limitStatus.uploadGb.used}
            limitValue={data.limitStatus.uploadGb.limit}
            secondaryUsed={`${uploadVolume.secondary}`}
            isOverLimit={data.limitStatus.uploadGb.overLimit}
            isAtLimit={
              !data.limitStatus.uploadGb.overLimit &&
              data.usageLimits.uploadGb > 0 &&
              data.limitStatus.uploadGb.used >= data.limitStatus.uploadGb.limit
            }
            colorClass="from-emerald-400 via-emerald-500 to-emerald-600"
          />

          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
              <p className="text-sm font-medium">SSO add-on</p>
              <InfoTooltip content="Single sign-on add-on status for your workspace subscription." />
            </div>
            <div className="flex h-full flex-col justify-between gap-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-normal text-muted-foreground/60">
                  Single sign-on status
                </p>
                <Badge variant="outline">
                  {data.addOns.ssoEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Managed through your subscription plan.
              </p>
            </div>
          </div>
        </div>

        <UsageLimitEnforcementForm
          key={formResetKey}
          summary={data}
          isSaving={updatePreferences.isPending}
          onSaved={handlePreferencesSaved}
          onSave={(input, options) => updatePreferences.mutate(input, options)}
        />

        {(data.freezes?.usageFreeze.enabled ||
          data.freezes?.accessFreeze.enabled) && (
          <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/40 dark:text-amber-300">
              <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-100">
              {data.freezes.accessFreeze.enabled
                ? "Workspace access is frozen by a platform operator."
                : "Workspace usage is frozen. Invites, exports, and uploads are blocked."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsageTab;
