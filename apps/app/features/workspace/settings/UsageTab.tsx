"use client";

import { useGetBillingSummary } from "@/hooks/billing/useGetBillingSummary";
import { useUpdateBillingPreferences } from "@/hooks/billing/useUpdateBillingPreferences";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { formatUploadVolumeDisplay } from "@/utils/formatUploadVolume";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";

function UsageMetricCard({
  label,
  used,
  included,
  unit,
  secondaryUsed,
  isOverLimit,
}: {
  label: string;
  used: number | string;
  included: number;
  unit: string;
  secondaryUsed?: string;
  isOverLimit?: boolean;
}) {
  const numericUsed = typeof used === "number" ? used : Number(used);
  const overLimit =
    typeof isOverLimit === "boolean"
      ? isOverLimit
      : Number.isFinite(numericUsed) && numericUsed > included;

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant={overLimit ? "destructive" : "secondary"}>
          {typeof used === "number" ? used.toLocaleString() : used} /{" "}
          {included.toLocaleString()} {unit}
        </Badge>
      </div>
      {secondaryUsed ? (
        <p className="text-xs text-muted-foreground">{secondaryUsed}</p>
      ) : null}
      {overLimit ? (
        <p className="text-xs text-destructive">Over usage limit this period</p>
      ) : (
        <p className="text-xs text-muted-foreground">Within usage limit</p>
      )}
    </div>
  );
}

function UsageTab() {
  const { data, isLoading, isError, error, refetch } = useGetBillingSummary();
  const updatePreferences = useUpdateBillingPreferences();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-lg" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
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
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        {isAccessFrozen ? (
          <p className="text-sm text-amber-900">
            Workspace access is frozen by a platform operator.
          </p>
        ) : isUsageFrozen ? (
          <p className="text-sm text-amber-900">
            Workspace usage is frozen. Invites, exports, and uploads are blocked.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unable to load usage information.
          </p>
        )}
        {!isAccessFrozen && !isUsageFrozen ? (
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Try again
          </Button>
        ) : null}
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Usage this period</h2>
            <Badge variant="outline" className="capitalize">
              {data.account.status}
            </Badge>
            <Badge variant="outline">{data.account.billingCadence}</Badge>
            {data.limitsEnabled ? (
              <Badge>Limit enforcement on</Badge>
            ) : (
              <Badge variant="secondary">Limit enforcement off</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatToLocalDate(data.period.start)} – {formatToLocalDate(data.period.end)}
          </p>
        </div>
        {hasOverage && data.enforcementMode === "overage" ? (
          <p className="text-sm text-amber-600">Usage exceeds configured limits this period.</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <UsageMetricCard
          label="Active members"
          used={data.usage.activeSeats}
          included={data.usageLimits.seats}
          unit="seats"
          isOverLimit={data.limitStatus.seats.overLimit}
        />
        <UsageMetricCard
          label="Exports"
          used={data.usage.exports}
          included={data.usageLimits.exports}
          unit="exports"
          isOverLimit={data.limitStatus.exports.overLimit}
        />
        <UsageMetricCard
          label="Upload volume"
          used={uploadVolume.primary}
          included={data.usageLimits.uploadGb}
          unit="GB"
          secondaryUsed={`${uploadVolume.secondary} this period`}
          isOverLimit={data.limitStatus.uploadGb.overLimit}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium">SSO add-on</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.addOns.ssoEnabled ? "Enabled" : "Disabled"}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <Label htmlFor="enforcement-mode" className="text-sm font-medium">
            Limit enforcement
          </Label>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">
            Choose whether over-limit usage is allowed or blocked per metric.
          </p>
          <Select
            value={data.enforcementMode}
            onValueChange={(value: "overage" | "block") =>
              updatePreferences.mutate({ enforcementMode: value })
            }
            disabled={updatePreferences.isPending}
          >
            <SelectTrigger id="enforcement-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overage">Allow overage</SelectItem>
              <SelectItem value="block">Block when over limit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(data.freezes?.usageFreeze.enabled || data.freezes?.accessFreeze.enabled) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {data.freezes.accessFreeze.enabled
            ? "Workspace access is frozen by a platform operator."
            : "Workspace usage is frozen. Invites, exports, and uploads are blocked."}
        </div>
      )}
    </div>
  );
}

export default UsageTab;
