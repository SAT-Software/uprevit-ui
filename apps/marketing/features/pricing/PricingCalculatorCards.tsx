"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import { SlidingNumber } from "@uprevit/ui/components/common/SlidingNumber";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
import { Label } from "@uprevit/ui/components/ui/label";
import { Slider } from "@uprevit/ui/components/ui/slider";
import { Switch } from "@uprevit/ui/components/ui/switch";
import { cn } from "@uprevit/ui/lib/utils";
import {
  PiArrowRightDuotone,
  PiBuildingsDuotone,
  PiCoinsDuotone,
  PiDatabaseDuotone,
  PiExportDuotone,
  PiLockKeyDuotone,
  PiUsersDuotone,
} from "react-icons/pi";
import type { IconType } from "react-icons";

type BillingCycle = "annual" | "monthly";

const BASE_SEAT_COUNT = 1;
const INCLUDED_UPLOAD_GB_MONTHLY = 10;
const INCLUDED_UPLOAD_GB_ANNUAL = 120;
const INCLUDED_EXPORTS_MONTHLY = 50;
const INCLUDED_EXPORTS_ANNUAL = 600;
const MAX_SEATS = 100;
const MAX_UPLOAD_GB_MONTHLY = 250;
const MAX_EXPORTS_MONTHLY = 1000;
const MB_PER_GB = 1024;

const pricing = {
  annual: {
    platform: 1500,
    seat: 300,
    uploadPerMb: 0.017578125,
    export: 3,
    sso: 1500,
  },
  monthly: {
    platform: 149,
    seat: 29,
    uploadPerMb: 0.00185546875,
    export: 0.29,
    sso: 149,
  },
} as const;

function formatCurrency(
  value: number,
  minimumFractionDigits?: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits:
      minimumFractionDigits ?? (Number.isInteger(value) ? 0 : 2),
    maximumFractionDigits,
  }).format(value);
}

function formatTinyCurrency(value: number) {
  return formatCurrency(value, 0, 8);
}

function getCycleSuffix(billingCycle: BillingCycle) {
  return billingCycle === "annual" ? "/ year" : "/ month";
}

function getMonthlyEquivalent(value: number, billingCycle: BillingCycle) {
  return billingCycle === "annual" ? value / 12 : value;
}

function getMonthlyEquivalentNote(value: number, billingCycle: BillingCycle) {
  return `${formatCurrency(getMonthlyEquivalent(value, billingCycle))} / month`;
}

function getCycleLabel(billingCycle: BillingCycle) {
  return billingCycle === "annual" ? "year" : "month";
}

function getIncludedUploadsGb(billingCycle: BillingCycle) {
  return billingCycle === "annual"
    ? INCLUDED_UPLOAD_GB_ANNUAL
    : INCLUDED_UPLOAD_GB_MONTHLY;
}

function getIncludedExports(billingCycle: BillingCycle) {
  return billingCycle === "annual"
    ? INCLUDED_EXPORTS_ANNUAL
    : INCLUDED_EXPORTS_MONTHLY;
}

function getMaxUploadsGb(billingCycle: BillingCycle) {
  return billingCycle === "annual"
    ? MAX_UPLOAD_GB_MONTHLY * 12
    : MAX_UPLOAD_GB_MONTHLY;
}

function getMaxExports(billingCycle: BillingCycle) {
  return billingCycle === "annual"
    ? MAX_EXPORTS_MONTHLY * 12
    : MAX_EXPORTS_MONTHLY;
}

function getUploadUnitPricePerGb(billingCycle: BillingCycle) {
  return pricing[billingCycle].uploadPerMb * MB_PER_GB;
}

function getCycleUsageValue(value: number, billingCycle: BillingCycle) {
  return billingCycle === "annual" ? value * 12 : value;
}

function getMonthlyUsageValue(value: number, billingCycle: BillingCycle) {
  return billingCycle === "annual" ? value / 12 : value;
}

function getRoundedCycleUsageValue(
  value: number,
  billingCycle: BillingCycle,
) {
  return billingCycle === "monthly" ? Math.ceil(value) : Math.round(value);
}

function AmountDisplay({
  value,
  billingCycle,
  size = "default",
}: {
  value: number;
  billingCycle: BillingCycle;
  size?: "default" | "large";
}) {
  const roundedValue = Number.isInteger(value)
    ? value
    : Number(value.toFixed(2));

  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-x-1.5 gap-y-2 font-semibold tracking-tight tabular-nums",
        size === "large" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
      )}
    >
      <span>$</span>
      <SlidingNumber value={roundedValue} />
      <span className="mb-1 text-sm font-medium text-muted-foreground tracking-normal">
        {getCycleSuffix(billingCycle)}
      </span>
    </div>
  );
}

function CountDisplay({ value, suffix }: { value: number; suffix: string }) {
  return (
    <div className="flex flex-wrap items-end gap-x-2 gap-y-2 tabular-nums">
      <div className="text-4xl font-semibold tracking-tight md:text-5xl">
        <SlidingNumber value={value} />
      </div>
      <span className="mb-1 text-sm text-muted-foreground">{suffix}</span>
    </div>
  );
}

function IncludedSummary({
  isIncluded,
  label,
}: {
  isIncluded: boolean;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          isIncluded ? "text-primary" : "text-accent-foreground",
          "text-2xl font-semibold tracking-tight md:text-3xl",
        )}
      >
        {isIncluded ? "Included" : "Not Included"}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function CalculatorCard({
  icon: Icon,
  iconClassName,
  title,
  description,
  headerAction,
  leftContent,
  rightContent,
  className,
  rightRailClassName,
}: {
  icon: IconType;
  iconClassName?: string;
  title: string;
  description: string;
  headerAction?: ReactNode;
  leftContent: ReactNode;
  rightContent: ReactNode;
  className?: string;
  rightRailClassName?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-border/70 bg-background shadow-[0_12px_30px_-24px_rgba(15,15,15,0.22)]",
        className,
      )}
    >
      <CardHeader className="gap-4 border-b border-border/70 px-6 py-6 md:px-8 md:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/30",
              iconClassName,
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">
              {description}
            </CardDescription>
          </div>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </CardHeader>
      <CardContent className="grid p-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="px-6 py-6 md:px-8 md:py-8">{leftContent}</div>
        <div
          className={cn(
            "border-t border-border/70 bg-muted/20 px-6 py-6 md:px-7 md:py-8 lg:border-t-0 lg:border-l",
            rightRailClassName,
          )}
        >
          {rightContent}
        </div>
      </CardContent>
    </Card>
  );
}

function RailRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right font-medium",
          emphasized && "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ScaleLink({ copy }: { copy: string }) {
  return (
    <Link
      href="mailto:contact@uprevit.com"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {copy}
      <PiArrowRightDuotone className="h-4 w-4" />
    </Link>
  );
}

export function PricingCalculatorCards() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [seatCount, setSeatCount] = useState(BASE_SEAT_COUNT);
  const [uploadGb, setUploadGb] = useState(INCLUDED_UPLOAD_GB_ANNUAL);
  const [exportsCount, setExportsCount] = useState(INCLUDED_EXPORTS_ANNUAL);
  const [ssoEnabled, setSsoEnabled] = useState(false);

  const currentPricing = pricing[billingCycle];
  const currentCycleLabel = getCycleLabel(billingCycle);
  const includedUploadGb = getIncludedUploadsGb(billingCycle);
  const includedExports = getIncludedExports(billingCycle);
  const extraUploadGb = Math.max(0, uploadGb - includedUploadGb);
  const extraUploadMb = extraUploadGb * MB_PER_GB;
  const extraExports = Math.max(0, exportsCount - includedExports);

  const platformCycleAmount = currentPricing.platform;
  const seatsCycleAmount = seatCount * currentPricing.seat;
  const uploadCycleAmount = extraUploadMb * currentPricing.uploadPerMb;
  const exportsCycleAmount = extraExports * currentPricing.export;
  const ssoCycleAmount = ssoEnabled ? currentPricing.sso : 0;

  const totalCycleAmount = useMemo(
    () =>
      platformCycleAmount +
      seatsCycleAmount +
      uploadCycleAmount +
      exportsCycleAmount +
      ssoCycleAmount,
    [
      exportsCycleAmount,
      platformCycleAmount,
      seatsCycleAmount,
      ssoCycleAmount,
      uploadCycleAmount,
    ],
  );

  const monthlyEquivalentUploadGb = getMonthlyUsageValue(
    uploadGb,
    billingCycle,
  );
  const monthlyEquivalentExports = getMonthlyUsageValue(
    exportsCount,
    billingCycle,
  );
  const annualUploadGb = getCycleUsageValue(monthlyEquivalentUploadGb, "annual");
  const annualExports = getCycleUsageValue(monthlyEquivalentExports, "annual");
  const annualExtraUploadGb = Math.max(
    0,
    annualUploadGb - INCLUDED_UPLOAD_GB_ANNUAL,
  );
  const annualExtraExports = Math.max(
    0,
    annualExports - INCLUDED_EXPORTS_ANNUAL,
  );
  const annualCycleAmount =
    pricing.annual.platform +
    seatCount * pricing.annual.seat +
    annualExtraUploadGb * MB_PER_GB * pricing.annual.uploadPerMb +
    annualExtraExports * pricing.annual.export +
    (ssoEnabled ? pricing.annual.sso : 0);
  const monthlyExtraUploadGb = Math.max(
    0,
    monthlyEquivalentUploadGb - INCLUDED_UPLOAD_GB_MONTHLY,
  );
  const monthlyExtraExports = Math.max(
    0,
    monthlyEquivalentExports - INCLUDED_EXPORTS_MONTHLY,
  );
  const monthlyCycleAmount =
    pricing.monthly.platform +
    seatCount * pricing.monthly.seat +
    monthlyExtraUploadGb * MB_PER_GB * pricing.monthly.uploadPerMb +
    monthlyExtraExports * pricing.monthly.export +
    (ssoEnabled ? pricing.monthly.sso : 0);

  function handleBillingCycleChange(checked: boolean) {
    const nextCycle: BillingCycle = checked ? "annual" : "monthly";
    if (nextCycle === billingCycle) return;

    setBillingCycle(nextCycle);
    setUploadGb((currentValue) => {
      const monthlyValue = getMonthlyUsageValue(currentValue, billingCycle);
      return getRoundedCycleUsageValue(
        getCycleUsageValue(monthlyValue, nextCycle),
        nextCycle,
      );
    });
    setExportsCount((currentValue) => {
      const monthlyValue = getMonthlyUsageValue(currentValue, billingCycle);
      return getRoundedCycleUsageValue(
        getCycleUsageValue(monthlyValue, nextCycle),
        nextCycle,
      );
    });
  }

  const billingToggle = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <div className="flex items-center space-x-2">
        <Label>Monthly</Label>
        <Switch
          checked={billingCycle === "annual"}
          onCheckedChange={handleBillingCycleChange}
          aria-label="billing cycle toggle"
          className="scale-125 data-[state=checked]:bg-foreground"
        />
        <Label>Yearly</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {billingToggle}

      <CalculatorCard
        icon={PiBuildingsDuotone}
        iconClassName="text-foreground"
        title="Platform fee"
        description="One paid workspace with the core platform, collaboration surface, and audit-ready workspace foundation."
        headerAction={
          <span className="text-sm text-muted-foreground">
            Required once per workspace
          </span>
        }
        leftContent={
          <div className="space-y-2">
            <AmountDisplay
              value={platformCycleAmount}
              billingCycle={billingCycle}
            />
            {billingCycle === "annual" ? (
              <p className="text-sm text-muted-foreground">
                Equivalent to{" "}
                {getMonthlyEquivalentNote(platformCycleAmount, billingCycle)} on
                a yearly contract.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Switch to yearly billing to bring this down to{" "}
                {getMonthlyEquivalentNote(pricing.annual.platform, "annual")}.
              </p>
            )}
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Workspace</p>
            <RailRow label="Platform workspace" value="1 account" emphasized />
            <RailRow
              label="Yearly billing"
              value={`${formatCurrency(pricing.annual.platform)} / year`}
            />
            <RailRow
              label="Monthly billing"
              value={`${formatCurrency(pricing.monthly.platform)} / month`}
            />
          </div>
        }
      />

      <CalculatorCard
        icon={PiUsersDuotone}
        iconClassName="text-foreground"
        title="Seats"
        description="Licensed users in the workspace. Move the slider to estimate how the workspace scales with your team."
        headerAction={
          <ScaleLink copy="Need more than 100 seats? Talk to sales" />
        }
        leftContent={
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <CountDisplay
                value={seatCount}
                suffix={seatCount === 1 ? "licensed user" : "licensed users"}
              />
              <p className="text-sm text-muted-foreground">
                Range: 1 to {MAX_SEATS} seats
              </p>
            </div>

            <div className="space-y-3">
              <Slider
                value={[seatCount]}
                min={1}
                max={MAX_SEATS}
                step={1}
                onValueChange={(value) => setSeatCount(value[0] ?? 1)}
                aria-label="Licensed seats"
                trackClassName="h-2 rounded-full bg-muted"
                rangeClassName="bg-foreground"
                thumbClassName="h-7 w-7 rounded-full border border-border bg-background shadow-[0_8px_18px_-10px_rgba(15,15,15,0.45)] before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-foreground"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>{MAX_SEATS}</span>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <div className="space-y-2">
                <AmountDisplay
                  value={seatsCycleAmount}
                  billingCycle={billingCycle}
                />
                <p className="text-sm text-muted-foreground">
                  {billingCycle === "annual"
                    ? `${formatCurrency(currentPricing.seat)} per seat per year, billed yearly.`
                    : `${formatCurrency(currentPricing.seat)} per seat per month.`}
                </p>
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Unit pricing</p>
            <RailRow
              label={
                billingCycle === "annual" ? "Selected cycle" : "Yearly option"
              }
              value={
                billingCycle === "annual"
                  ? `${formatCurrency(currentPricing.seat)} / seat / year`
                  : `${formatCurrency(pricing.annual.seat)} / seat / year`
              }
            />
            <RailRow
              label={
                billingCycle === "monthly" ? "Selected cycle" : "Monthly option"
              }
              value={
                billingCycle === "monthly"
                  ? `${formatCurrency(currentPricing.seat)} / seat / month`
                  : `${formatCurrency(pricing.monthly.seat)} / seat / month`
              }
            />
            <div className="border-t border-border/70 pt-4">
              <RailRow
                label="Yearly monthly equivalent"
                value={`${formatCurrency(pricing.annual.seat / 12)} / seat / month`}
              />
            </div>
          </div>
        }
      />

      <CalculatorCard
        icon={PiDatabaseDuotone}
        iconClassName="text-foreground"
        title="Uploads"
        description={`Committed upload volume for the workspace. The first ${includedUploadGb.toLocaleString()} GB per ${currentCycleLabel} stay included, then usage is metered in MB.`}
        headerAction={<ScaleLink copy="Need more uploads? Talk to sales" />}
        leftContent={
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <CountDisplay
                value={uploadGb}
                suffix={`GB / ${currentCycleLabel}`}
              />
              <p className="text-sm text-muted-foreground">
                {includedUploadGb.toLocaleString()} GB included per{" "}
                {currentCycleLabel}, then increments of 1 GB
              </p>
            </div>

            <div className="space-y-3">
              <Slider
                value={[uploadGb]}
                min={includedUploadGb}
                max={getMaxUploadsGb(billingCycle)}
                step={1}
                onValueChange={(value) =>
                  setUploadGb(value[0] ?? includedUploadGb)
                }
                aria-label={`Uploads in gigabytes per ${currentCycleLabel}`}
                trackClassName="h-2 rounded-full bg-muted"
                rangeClassName="bg-foreground"
                thumbClassName="h-7 w-7 rounded-full border border-border bg-background shadow-[0_8px_18px_-10px_rgba(15,15,15,0.45)] before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-foreground"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{includedUploadGb.toLocaleString()} GB</span>
                <span>{getMaxUploadsGb(billingCycle).toLocaleString()} GB</span>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <div className="space-y-2">
                {extraUploadGb === 0 ? (
                  <IncludedSummary
                    isIncluded={true}
                    label={`${includedUploadGb.toLocaleString()} GB per ${currentCycleLabel} is already covered by the platform plan.`}
                  />
                ) : (
                  <>
                    <AmountDisplay
                      value={uploadCycleAmount}
                      billingCycle={billingCycle}
                    />
                    <p className="text-sm text-muted-foreground">
                      {extraUploadGb.toLocaleString()} billable GB above the
                      included {includedUploadGb.toLocaleString()} GB per{" "}
                      {currentCycleLabel}.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Included and unit pricing
            </p>
            <RailRow
              label="Included uploads"
              value={`${includedUploadGb.toLocaleString()} GB / ${currentCycleLabel}`}
              emphasized
            />
            <RailRow
              label="Billable now"
              value={`${extraUploadGb.toLocaleString()} GB / ${currentCycleLabel}`}
            />
            <RailRow
              label={
                billingCycle === "annual" ? "Selected cycle" : "Yearly option"
              }
              value={
                billingCycle === "annual"
                  ? `${formatCurrency(getUploadUnitPricePerGb("annual"))} / GB / year`
                  : `${formatCurrency(getUploadUnitPricePerGb("annual"))} / GB / year`
              }
            />
            <RailRow
              label={
                billingCycle === "monthly" ? "Selected cycle" : "Monthly option"
              }
              value={
                billingCycle === "monthly"
                  ? `${formatCurrency(getUploadUnitPricePerGb("monthly"))} / GB / month`
                  : `${formatCurrency(getUploadUnitPricePerGb("monthly"))} / GB / month`
              }
            />
            <div className="border-t border-border/70 pt-4">
              <RailRow
                label="Chargebee unit"
                value={`${formatTinyCurrency(currentPricing.uploadPerMb)} / MB`}
              />
            </div>
          </div>
        }
      />

      <CalculatorCard
        icon={PiExportDuotone}
        iconClassName="text-foreground"
        title="Exports"
        description={`Completed PDF or XLSX product exports and report exports. The first ${includedExports.toLocaleString()} per ${currentCycleLabel} stay included.`}
        headerAction={
          <ScaleLink copy="Need higher export volume? Talk to sales" />
        }
        leftContent={
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <CountDisplay
                value={exportsCount}
                suffix={`exports / ${currentCycleLabel}`}
              />
              <p className="text-sm text-muted-foreground">
                {includedExports.toLocaleString()} exports included per{" "}
                {currentCycleLabel}
              </p>
            </div>

            <div className="space-y-3">
              <Slider
                value={[exportsCount]}
                min={includedExports}
                max={getMaxExports(billingCycle)}
                step={1}
                onValueChange={(value) =>
                  setExportsCount(value[0] ?? includedExports)
                }
                aria-label={`Exports per ${currentCycleLabel}`}
                trackClassName="h-2 rounded-full bg-muted"
                rangeClassName="bg-foreground"
                thumbClassName="h-7 w-7 rounded-full border border-border bg-background shadow-[0_8px_18px_-10px_rgba(15,15,15,0.45)] before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-foreground"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {includedExports.toLocaleString()} / {currentCycleLabel}
                </span>
                <span>
                  {getMaxExports(billingCycle).toLocaleString()} /{" "}
                  {currentCycleLabel}
                </span>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <div className="space-y-2">
                {extraExports === 0 ? (
                  <IncludedSummary
                    isIncluded={true}
                    label={`${includedExports.toLocaleString()} exports per ${currentCycleLabel} are already covered.`}
                  />
                ) : (
                  <>
                    <AmountDisplay
                      value={exportsCycleAmount}
                      billingCycle={billingCycle}
                    />
                    <p className="text-sm text-muted-foreground">
                      {extraExports.toLocaleString()} billable exports above the
                      included {includedExports.toLocaleString()} per{" "}
                      {currentCycleLabel}.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Included and unit pricing
            </p>
            <RailRow
              label="Included exports"
              value={`${includedExports.toLocaleString()} / ${currentCycleLabel}`}
              emphasized
            />
            <RailRow
              label="Billable now"
              value={`${extraExports.toLocaleString()} / ${currentCycleLabel}`}
            />
            <RailRow
              label={
                billingCycle === "annual" ? "Selected cycle" : "Yearly option"
              }
              value={
                billingCycle === "annual"
                  ? `${formatCurrency(currentPricing.export)} / export / year`
                  : `${formatCurrency(pricing.annual.export)} / export / year`
              }
            />
            <RailRow
              label={
                billingCycle === "monthly" ? "Selected cycle" : "Monthly option"
              }
              value={
                billingCycle === "monthly"
                  ? `${formatCurrency(currentPricing.export)} / export / month`
                  : `${formatCurrency(pricing.monthly.export)} / export / month`
              }
            />
          </div>
        }
      />

      <CalculatorCard
        icon={PiLockKeyDuotone}
        iconClassName="text-foreground"
        title="SSO add-on"
        description="Enable SAML or OIDC single sign-on for the workspace when your team needs centralized identity management."
        headerAction={
          <span className="text-sm text-muted-foreground">Optional add-on</span>
        }
        leftContent={
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-medium text-foreground">
                  Workspace SSO
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Turn this on when you need SAML or OIDC sign-in.
                </p>
              </div>
              <Switch
                checked={ssoEnabled}
                onCheckedChange={setSsoEnabled}
                aria-label="Enable SSO add-on"
                className="scale-125 data-[state=checked]:bg-foreground"
              />
            </div>

            <div className="border-t border-border/70 pt-6">
              <div className="space-y-2">
                {ssoEnabled ? (
                  <>
                    <AmountDisplay
                      value={ssoCycleAmount}
                      billingCycle={billingCycle}
                    />
                    <p className="text-sm text-muted-foreground">
                      Adds one workspace-level SSO connection to the estimate.
                    </p>
                  </>
                ) : (
                  <IncludedSummary
                    isIncluded={false}
                    label="Leave this off if the workspace will sign in directly with email and OTP/password."
                  />
                )}
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Add-on pricing
            </p>
            <RailRow
              label="Status"
              value={ssoEnabled ? "Enabled" : "Not added"}
              emphasized
            />
            <RailRow
              label="Yearly billing"
              value={`${formatCurrency(pricing.annual.sso)} / year`}
            />
            <RailRow
              label="Monthly billing"
              value={`${formatCurrency(pricing.monthly.sso)} / month`}
            />
            <div className="border-t border-border/70 pt-4">
              <ScaleLink copy="Need SSO rollout help? Talk to sales" />
            </div>
          </div>
        }
      />

      <CalculatorCard
        icon={PiCoinsDuotone}
        iconClassName="text-foreground"
        title="Total"
        description="Estimated price for one workspace based on the current seat count, upload volume, export volume, and SSO selection."
        className="border-primary/20"
        rightRailClassName="bg-primary/5"
        leftContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Estimate breakdown
            </p>
            <div className="space-y-3">
              <RailRow
                label="Platform fee"
                value={formatCurrency(platformCycleAmount)}
                emphasized
              />
              <RailRow
                label={`${seatCount} seat${seatCount === 1 ? "" : "s"}`}
                value={formatCurrency(seatsCycleAmount)}
                emphasized
              />
              <RailRow
                label={`Uploads (${uploadGb.toLocaleString()} GB / ${currentCycleLabel} selected)`}
                value={
                  extraUploadGb === 0
                    ? "Included"
                    : formatCurrency(uploadCycleAmount)
                }
                emphasized
              />
              <RailRow
                label={`Exports (${exportsCount.toLocaleString()} / ${currentCycleLabel} selected)`}
                value={
                  extraExports === 0
                    ? "Included"
                    : formatCurrency(exportsCycleAmount)
                }
                emphasized
              />
              <RailRow
                label="SSO add-on"
                value={ssoEnabled ? formatCurrency(ssoCycleAmount) : "Not added"}
                emphasized
              />
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Estimated total
              </p>
              <div className="mt-3">
                <AmountDisplay
                  value={totalCycleAmount}
                  billingCycle={billingCycle}
                  size="large"
                />
              </div>
            </div>

            {billingCycle === "annual" ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {getMonthlyEquivalentNote(totalCycleAmount, billingCycle)}{" "}
                  effective monthly spend on yearly billing.
                </p>
                <p>
                  If you switched this exact configuration to monthly billing,
                  the estimate would be {formatCurrency(monthlyCycleAmount)} /
                  month.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {formatCurrency(monthlyCycleAmount)} / month with monthly
                  billing.
                </p>
                <p>
                  Switching this exact configuration to yearly billing would
                  bring it to {formatCurrency(annualCycleAmount / 12)} / month
                  and {formatCurrency(annualCycleAmount)} / year.
                </p>
              </div>
            )}

            <div className="border-t border-border/70 pt-4">
              <ScaleLink copy="Need a larger rollout or tailored agreement? Talk to sales" />
            </div>
          </div>
        }
      />
    </div>
  );
}
