"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { useGetBillingSummary } from "@/hooks/billing/useGetBillingSummary";
import { useUpdateBillingPreferences } from "@/hooks/billing/useUpdateBillingPreferences";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Progress } from "@uprevit/ui/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";
import {
  PiChartBarDuotone,
  PiExportDuotone,
  PiCloudArrowUpDuotone,
  PiShieldCheckDuotone,
  PiSlidersHorizontalDuotone,
  PiWarningCircleDuotone,
  PiUsersDuotone,
} from "react-icons/pi";
import { formatUploadVolumeDisplay } from "@/utils/formatUploadVolume";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import type { EnforcementMode } from "@/types/billing";

function UsageMetricCard({
  label,
  icon: Icon,
  used,
  included,
  unit,
  usedValue,
  limitValue,
  secondaryUsed,
  isOverLimit,
  isAtLimit,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  used: number | string;
  included: number;
  unit: string;
  /** Precise numeric usage used for the progress percentage (defaults to `used`). */
  usedValue?: number;
  /** Precise numeric limit used for the progress percentage (defaults to `included`). */
  limitValue?: number;
  secondaryUsed?: string;
  isOverLimit?: boolean;
  isAtLimit?: boolean;
}) {
  const numericUsed =
    usedValue ?? (typeof used === "number" ? used : Number(used));
  const numericLimit = limitValue ?? included;
  const overLimit =
    typeof isOverLimit === "boolean"
      ? isOverLimit
      : Number.isFinite(numericUsed) && numericUsed > numericLimit;
  const atLimit =
    typeof isAtLimit === "boolean"
      ? isAtLimit
      : !overLimit &&
        numericLimit > 0 &&
        Number.isFinite(numericUsed) &&
        numericUsed >= numericLimit;

  const exceeded = overLimit || atLimit;
  const percent =
    numericLimit > 0 && Number.isFinite(numericUsed)
      ? Math.min(100, Math.round((numericUsed / numericLimit) * 100))
      : 0;

  return (
    <Card className="shadow-none">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-muted p-2 shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Badge variant={exceeded ? "destructive" : "secondary"}>
              {typeof used === "number" ? used.toLocaleString() : used} /{" "}
              {included.toLocaleString()} {unit}
            </Badge>
          </div>
          <Progress
            value={percent}
            className={cn(exceeded && "[&>div]:bg-destructive")}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          {overLimit ? (
            <span className="text-destructive">Over usage limit</span>
          ) : atLimit ? (
            <span className="text-destructive">At usage limit</span>
          ) : (
            <span className="text-muted-foreground">Within usage limit</span>
          )}
          <span className="text-muted-foreground">
            {secondaryUsed ? `${secondaryUsed} · ${percent}%` : `${percent}%`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function UsageTab() {
  const { data, isLoading, isError, error, refetch } = useGetBillingSummary();
  const updatePreferences = useUpdateBillingPreferences();
  const [enforcementMode, setEnforcementMode] = useState<EnforcementMode>("overage");
  const [exportsLimit, setExportsLimit] = useState("");
  const [uploadGbLimit, setUploadGbLimit] = useState("");

  useEffect(() => {
    if (!data) return;
    setEnforcementMode(data.enforcementMode);
    setExportsLimit(String(data.usageLimits.exports));
    setUploadGbLimit(String(data.usageLimits.uploadGb));
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    const errorMessage =
      isError && error instanceof Error ? error.message.toLowerCase() : "";
    const isAccessFrozen = errorMessage.includes("workspace access is frozen");
    const isUsageFrozen = errorMessage.includes("workspace usage is frozen");

    if (isAccessFrozen || isUsageFrozen) {
      return (
        <div className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="rounded-lg bg-amber-100 p-2.5 shrink-0">
            <PiWarningCircleDuotone className="h-5 w-5 text-amber-700" />
          </div>
          <p className="text-sm text-amber-900">
            {isAccessFrozen
              ? "Workspace access is frozen by a platform operator."
              : "Workspace usage is frozen. Invites, exports, and uploads are blocked."}
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="rounded-lg bg-destructive/10 p-2.5 shrink-0">
          <PiWarningCircleDuotone className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="text-sm font-medium">Unable to load usage information</div>
          <div className="text-sm text-muted-foreground">
            Something went wrong while fetching your usage for this period.
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
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

  const parsedExports = Number(exportsLimit);
  const parsedUploadGb = Number(uploadGbLimit);
  const limitsDirty =
    enforcementMode !== data.enforcementMode ||
    parsedExports !== data.usageLimits.exports ||
    parsedUploadGb !== data.usageLimits.uploadGb;
  const limitsValid =
    Number.isInteger(parsedExports) &&
    parsedExports >= 0 &&
    Number.isFinite(parsedUploadGb) &&
    parsedUploadGb >= 0;

  const savePreferences = () => {
    if (!limitsValid) return;
    updatePreferences.mutate({
      enforcementMode,
      exports: parsedExports,
      uploadGb: parsedUploadGb,
    });
  };

  return (
    <div className="space-y-6">
      {/* Usage Header */}
      <div className="flex flex-col gap-4 rounded-lg border bg-accent p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-background">
            <PiChartBarDuotone className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">Usage this period</h2>
              <Badge variant="outline" className="capitalize">
                {data.account.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {data.account.billingCadence}
              </Badge>
              {data.limitsEnabled ? (
                <Badge>Limit enforcement on</Badge>
              ) : (
                <Badge variant="secondary">Limit enforcement off</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {data.period.source === "chargebee"
                ? "Usage is aggregated for your current subscription term."
                : "Usage is aggregated for the current billing period until your subscription is active."}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatToLocalDate(data.period.start)} –{" "}
              {formatToLocalDate(data.period.end)}
              {" · "}
              {data.period.source === "chargebee"
                ? "Subscription term"
                : "Standard billing period"}
            </p>
          </div>
        </div>
        {hasOverage && data.enforcementMode === "overage" ? (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 sm:max-w-[220px]">
            <PiWarningCircleDuotone className="h-4 w-4 shrink-0 text-amber-700" />
            <p className="text-xs text-amber-900">
              Usage exceeds configured limits this period.
            </p>
          </div>
        ) : null}
      </div>

      {/* Usage Metrics */}
      <div className="space-y-4">
        <div className="text-lg font-medium">Usage breakdown</div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <UsageMetricCard
            label="Active members"
            icon={PiUsersDuotone}
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
          />
          <UsageMetricCard
            label="Exports"
            icon={PiExportDuotone}
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
          />
          <UsageMetricCard
            label="Upload volume"
            icon={PiCloudArrowUpDuotone}
            used={uploadVolume.primary}
            included={data.usageLimits.uploadGb}
            unit="GB"
            usedValue={data.limitStatus.uploadGb.used}
            limitValue={data.limitStatus.uploadGb.limit}
            secondaryUsed={`${uploadVolume.secondary} used`}
            isOverLimit={data.limitStatus.uploadGb.overLimit}
            isAtLimit={
              !data.limitStatus.uploadGb.overLimit &&
              data.usageLimits.uploadGb > 0 &&
              data.limitStatus.uploadGb.used >= data.limitStatus.uploadGb.limit
            }
          />
          <Card className="shadow-none">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-muted p-2 shrink-0">
                  <PiShieldCheckDuotone className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">SSO add-on</span>
              </div>
              <div className="flex justify-end">
                <Badge variant={data.addOns.ssoEnabled ? "default" : "secondary"}>
                  {data.addOns.ssoEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Seat limits are set from your subscription and cannot be changed
                here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Limit enforcement */}
      <Card className="shadow-none">
        <CardHeader className="space-y-1 p-6 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-muted p-2 shrink-0">
              <PiSlidersHorizontalDuotone className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Limit enforcement</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose whether over-limit usage is allowed or blocked for exports and
            uploads.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="enforcement-mode">Enforcement mode</Label>
            <Select
              value={enforcementMode}
              onValueChange={(value) =>
                setEnforcementMode(value as EnforcementMode)
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exports-limit">Export limit</Label>
              <Input
                id="exports-limit"
                type="number"
                min={0}
                step={1}
                value={exportsLimit}
                onChange={(event) => setExportsLimit(event.target.value)}
                disabled={updatePreferences.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload-limit">Upload limit (GB)</Label>
              <Input
                id="upload-limit"
                type="number"
                min={0}
                step={0.1}
                value={uploadGbLimit}
                onChange={(event) => setUploadGbLimit(event.target.value)}
                disabled={updatePreferences.isPending}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={savePreferences}
              disabled={
                !limitsDirty || !limitsValid || updatePreferences.isPending
              }
            >
              Save preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {(data.freezes?.usageFreeze.enabled ||
        data.freezes?.accessFreeze.enabled) && (
        <div className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="rounded-lg bg-amber-100 p-2.5 shrink-0">
            <PiWarningCircleDuotone className="h-5 w-5 text-amber-700" />
          </div>
          <p className="text-sm text-amber-900">
            {data.freezes.accessFreeze.enabled
              ? "Workspace access is frozen by a platform operator."
              : "Workspace usage is frozen. Invites, exports, and uploads are blocked."}
          </p>
        </div>
      )}
    </div>
  );
}

export default UsageTab;
