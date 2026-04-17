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
import { Label } from "@uprevit/ui/components/ui/label";

type BillingCycle = "annual" | "monthly";

const BASE_SEAT_COUNT = 1;
const INCLUDED_STORAGE_GB = 10;
const INCLUDED_EXPORTS_PER_MONTH = 50;
const MAX_SEATS = 100;
const MAX_STORAGE_GB = 250;
const MAX_EXPORTS_PER_MONTH = 1000;

const pricing = {
  annual: {
    platformMonthlyEquivalent: 125,
    seatMonthlyEquivalent: 25,
    storageMonthlyEquivalent: 1.5,
    exportMonthlyEquivalent: 0.25,
    ssoMonthlyEquivalent: 125,
  },
  monthly: {
    platformMonthlyEquivalent: 149,
    seatMonthlyEquivalent: 29,
    storageMonthlyEquivalent: 1.9,
    exportMonthlyEquivalent: 0.29,
    ssoMonthlyEquivalent: 149,
  },
} as const;

function formatCurrency(value: number, minimumFractionDigits?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits:
      minimumFractionDigits ?? (Number.isInteger(value) ? 0 : 2),
    maximumFractionDigits: 2,
  }).format(value);
}

function getCycleAmount(value: number, billingCycle: BillingCycle) {
  return billingCycle === "annual" ? value * 12 : value;
}

function getCycleSuffix(billingCycle: BillingCycle) {
  return billingCycle === "annual" ? "/ year" : "/ month";
}

function getMonthlyEquivalentNote(value: number) {
  return `${formatCurrency(value)} / month`;
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
          "text-2xl font-semibold tracking-tight  md:text-3xl",
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
  const [storageGb, setStorageGb] = useState(INCLUDED_STORAGE_GB);
  const [exportsPerMonth, setExportsPerMonth] = useState(
    INCLUDED_EXPORTS_PER_MONTH,
  );
  const [ssoEnabled, setSsoEnabled] = useState(false);

  const currentPricing = pricing[billingCycle];
  const alternativePricing =
    pricing[billingCycle === "annual" ? "monthly" : "annual"];

  const extraStorageGb = Math.max(0, storageGb - INCLUDED_STORAGE_GB);
  const extraExportsPerMonth = Math.max(
    0,
    exportsPerMonth - INCLUDED_EXPORTS_PER_MONTH,
  );

  const platformMonthlyEquivalent = currentPricing.platformMonthlyEquivalent;
  const seatsMonthlyEquivalent =
    seatCount * currentPricing.seatMonthlyEquivalent;
  const storageMonthlyEquivalent =
    extraStorageGb * currentPricing.storageMonthlyEquivalent;
  const exportsMonthlyEquivalent =
    extraExportsPerMonth * currentPricing.exportMonthlyEquivalent;
  const ssoMonthlyEquivalent = ssoEnabled
    ? currentPricing.ssoMonthlyEquivalent
    : 0;

  const totalMonthlyEquivalent = useMemo(
    () =>
      platformMonthlyEquivalent +
      seatsMonthlyEquivalent +
      storageMonthlyEquivalent +
      exportsMonthlyEquivalent +
      ssoMonthlyEquivalent,
    [
      exportsMonthlyEquivalent,
      platformMonthlyEquivalent,
      seatsMonthlyEquivalent,
      ssoMonthlyEquivalent,
      storageMonthlyEquivalent,
    ],
  );

  const totalCycleAmount = getCycleAmount(totalMonthlyEquivalent, billingCycle);
  const annualMonthlyEquivalent =
    pricing.annual.platformMonthlyEquivalent +
    seatCount * pricing.annual.seatMonthlyEquivalent +
    extraStorageGb * pricing.annual.storageMonthlyEquivalent +
    extraExportsPerMonth * pricing.annual.exportMonthlyEquivalent +
    (ssoEnabled ? pricing.annual.ssoMonthlyEquivalent : 0);

  const monthlyCycleAmount =
    pricing.monthly.platformMonthlyEquivalent +
    seatCount * pricing.monthly.seatMonthlyEquivalent +
    extraStorageGb * pricing.monthly.storageMonthlyEquivalent +
    extraExportsPerMonth * pricing.monthly.exportMonthlyEquivalent +
    (ssoEnabled ? pricing.monthly.ssoMonthlyEquivalent : 0);

  const billingToggle = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <div className="flex items-center space-x-2">
        <Label htmlFor="pricing-plan">Monthly</Label>
        <Switch
          checked={billingCycle === "annual"}
          onCheckedChange={(checked) =>
            setBillingCycle(checked ? "annual" : "monthly")
          }
          aria-label="billing cycle toggle"
          className="scale-125 data-[state=checked]:bg-foreground"
        />
        <Label htmlFor="pricing-plan">Yearly</Label>
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
          <div className="space-y-6">
            <div className="">
              {/* <p className="text-sm text-muted-foreground">Current subtotal</p> */}
              <div className="space-y-2">
                <AmountDisplay
                  value={getCycleAmount(
                    platformMonthlyEquivalent,
                    billingCycle,
                  )}
                  billingCycle={billingCycle}
                />
                {billingCycle === "annual" ? (
                  <p className="text-sm text-muted-foreground">
                    Equivalent to{" "}
                    {getMonthlyEquivalentNote(platformMonthlyEquivalent)} on an
                    annual contract.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Switch to annual billing to bring this down to{" "}
                    {getMonthlyEquivalentNote(
                      pricing.annual.platformMonthlyEquivalent,
                    )}
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Workspace</p>
            <RailRow label="Platform Workspace" value="1 account" emphasized />
            {/* <RailRow
              label="Annual billing"
              value={`${formatCurrency(1500)} / year`}
            /> */}
            {/* <RailRow
              label="Monthly equivalent"
              value={getMonthlyEquivalentNote(
                pricing.annual.platformMonthlyEquivalent,
              )}
            />
            <RailRow
              label="Monthly billing"
              value={`${formatCurrency(149)} / month`}
            /> */}
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
              <div>
                {/* <p className="text-sm text-muted-foreground">Selected seats</p> */}
                <div className="">
                  <CountDisplay
                    value={seatCount}
                    suffix={
                      seatCount === 1 ? "licensed user" : "licensed users"
                    }
                  />
                </div>
              </div>
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
              {/* <p className="text-sm text-muted-foreground">Current subtotal</p> */}
              <div className="space-y-2">
                <AmountDisplay
                  value={getCycleAmount(seatsMonthlyEquivalent, billingCycle)}
                  billingCycle={billingCycle}
                />
                {billingCycle === "annual" ? (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(currentPricing.seatMonthlyEquivalent)} per
                    seat per month, billed annually.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(currentPricing.seatMonthlyEquivalent)} per
                    seat per month.
                  </p>
                )}
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Unit pricing</p>
            {/* <RailRow label="Current seats" value={seatCount} emphasized /> */}
            <RailRow
              label={
                billingCycle === "annual" ? "Selected cycle" : "Annual option"
              }
              value={
                billingCycle === "annual"
                  ? `${formatCurrency(currentPricing.seatMonthlyEquivalent)} / seat / month`
                  : `${formatCurrency(alternativePricing.seatMonthlyEquivalent)} / seat / month`
              }
            />
            <RailRow
              label={
                billingCycle === "monthly" ? "Selected cycle" : "Monthly option"
              }
              value={
                billingCycle === "monthly"
                  ? `${formatCurrency(currentPricing.seatMonthlyEquivalent)} / seat / month`
                  : `${formatCurrency(alternativePricing.seatMonthlyEquivalent)} / seat / month`
              }
            />
            <div className="border-t border-border/70 pt-4">
              <RailRow
                label="Annual contract rate"
                value={`${formatCurrency(300)} / seat / year`}
              />
            </div>
          </div>
        }
      />

      <CalculatorCard
        icon={PiDatabaseDuotone}
        iconClassName="text-foreground"
        title="Storage"
        description="Uploaded file storage for the workspace. The first 10 GB stay included, then pricing scales per GB."
        headerAction={<ScaleLink copy="Need more storage? Talk to sales" />}
        leftContent={
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {/* <p className="text-sm text-muted-foreground">
                  Selected storage
                </p> */}
                <div>
                  <CountDisplay
                    value={storageGb}
                    suffix={storageGb === 1 ? "GB" : "GB"}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {INCLUDED_STORAGE_GB} GB included, then increments of 1 GB
              </p>
            </div>

            <div className="space-y-3">
              <Slider
                value={[storageGb]}
                min={INCLUDED_STORAGE_GB}
                max={MAX_STORAGE_GB}
                step={1}
                onValueChange={(value) =>
                  setStorageGb(value[0] ?? INCLUDED_STORAGE_GB)
                }
                aria-label="Storage in gigabytes"
                trackClassName="h-2 rounded-full bg-muted"
                rangeClassName="bg-foreground"
                thumbClassName="h-7 w-7 rounded-full border border-border bg-background shadow-[0_8px_18px_-10px_rgba(15,15,15,0.45)] before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-foreground"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{INCLUDED_STORAGE_GB} GB</span>
                <span>{MAX_STORAGE_GB} GB</span>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <div className="space-y-2">
                {extraStorageGb === 0 ? (
                  <IncludedSummary
                    isIncluded={true}
                    label={`${INCLUDED_STORAGE_GB} GB is already covered by the platform fee.`}
                  />
                ) : (
                  <>
                    <AmountDisplay
                      value={getCycleAmount(
                        storageMonthlyEquivalent,
                        billingCycle,
                      )}
                      billingCycle={billingCycle}
                    />
                    <p className="text-sm text-muted-foreground">
                      {extraStorageGb} billable GB above the included{" "}
                      {INCLUDED_STORAGE_GB} GB.
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
              label="Included storage"
              value={`${INCLUDED_STORAGE_GB} GB`}
              emphasized
            />
            <RailRow label="Billable now" value={`${extraStorageGb} GB`} />
            <RailRow
              label={
                billingCycle === "annual" ? "Selected cycle" : "Annual option"
              }
              value={
                billingCycle === "annual"
                  ? `${formatCurrency(currentPricing.storageMonthlyEquivalent)} / GB / month`
                  : `${formatCurrency(alternativePricing.storageMonthlyEquivalent)} / GB / month`
              }
            />
            <RailRow
              label={
                billingCycle === "monthly" ? "Selected cycle" : "Monthly option"
              }
              value={
                billingCycle === "monthly"
                  ? `${formatCurrency(currentPricing.storageMonthlyEquivalent)} / GB / month`
                  : `${formatCurrency(alternativePricing.storageMonthlyEquivalent)} / GB / month`
              }
            />
          </div>
        }
      />

      <CalculatorCard
        icon={PiExportDuotone}
        iconClassName="text-foreground"
        title="Exports"
        description="Completed PDF or XLSX product exports and report exports per month. The first 50 per month stay included."
        headerAction={
          <ScaleLink copy="Need higher export volume? Talk to sales" />
        }
        leftContent={
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div>
                  <CountDisplay
                    value={exportsPerMonth}
                    suffix="exports / month"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {INCLUDED_EXPORTS_PER_MONTH} exports included each month
              </p>
            </div>

            <div className="space-y-3">
              <Slider
                value={[exportsPerMonth]}
                min={INCLUDED_EXPORTS_PER_MONTH}
                max={MAX_EXPORTS_PER_MONTH}
                step={1}
                onValueChange={(value) =>
                  setExportsPerMonth(value[0] ?? INCLUDED_EXPORTS_PER_MONTH)
                }
                aria-label="Exports per month"
                trackClassName="h-2 rounded-full bg-muted"
                rangeClassName="bg-foreground"
                thumbClassName="h-7 w-7 rounded-full border border-border bg-background shadow-[0_8px_18px_-10px_rgba(15,15,15,0.45)] before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-foreground"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{INCLUDED_EXPORTS_PER_MONTH} / month</span>
                <span>{MAX_EXPORTS_PER_MONTH} / month</span>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <div className=" space-y-2">
                {extraExportsPerMonth === 0 ? (
                  <IncludedSummary
                    isIncluded={true}
                    label={`${INCLUDED_EXPORTS_PER_MONTH} exports per month are already covered.`}
                  />
                ) : (
                  <>
                    <AmountDisplay
                      value={getCycleAmount(
                        exportsMonthlyEquivalent,
                        billingCycle,
                      )}
                      billingCycle={billingCycle}
                    />
                    <p className="text-sm text-muted-foreground">
                      {extraExportsPerMonth} billable exports above the included{" "}
                      {INCLUDED_EXPORTS_PER_MONTH} per month.
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
              value={`${INCLUDED_EXPORTS_PER_MONTH} / month`}
              emphasized
            />
            <RailRow
              label="Billable now"
              value={`${extraExportsPerMonth} / month`}
            />
            <RailRow
              label={
                billingCycle === "annual" ? "Selected cycle" : "Annual option"
              }
              value={
                billingCycle === "annual"
                  ? `${formatCurrency(currentPricing.exportMonthlyEquivalent)} / export / month`
                  : `${formatCurrency(alternativePricing.exportMonthlyEquivalent)} / export / month`
              }
            />
            <RailRow
              label={
                billingCycle === "monthly" ? "Selected cycle" : "Monthly option"
              }
              value={
                billingCycle === "monthly"
                  ? `${formatCurrency(currentPricing.exportMonthlyEquivalent)} / export / month`
                  : `${formatCurrency(alternativePricing.exportMonthlyEquivalent)} / export / month`
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
                      value={getCycleAmount(
                        currentPricing.ssoMonthlyEquivalent,
                        billingCycle,
                      )}
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
              label="Annual billing"
              value={`${formatCurrency(1500)} / year`}
            />
            {/* <RailRow
              label="Monthly equivalent"
              value={getMonthlyEquivalentNote(
                pricing.annual.ssoMonthlyEquivalent,
              )}
            /> */}
            <RailRow
              label="Monthly billing"
              value={`${formatCurrency(149)} / month`}
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
        description="Estimated price for one workspace based on the current seat count, storage, export volume, and SSO selection."
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
                value={formatCurrency(
                  getCycleAmount(platformMonthlyEquivalent, billingCycle),
                )}
                emphasized
              />
              <RailRow
                label={`${seatCount} seat${seatCount === 1 ? "" : "s"}`}
                value={formatCurrency(
                  getCycleAmount(seatsMonthlyEquivalent, billingCycle),
                )}
                emphasized
              />
              <RailRow
                label={`Storage (${storageGb} GB selected)`}
                value={
                  extraStorageGb === 0
                    ? "Included"
                    : formatCurrency(
                        getCycleAmount(storageMonthlyEquivalent, billingCycle),
                      )
                }
                emphasized
              />
              <RailRow
                label={`Exports (${exportsPerMonth} / month selected)`}
                value={
                  extraExportsPerMonth === 0
                    ? "Included"
                    : formatCurrency(
                        getCycleAmount(exportsMonthlyEquivalent, billingCycle),
                      )
                }
                emphasized
              />
              <RailRow
                label="SSO add-on"
                value={
                  ssoEnabled
                    ? formatCurrency(
                        getCycleAmount(ssoMonthlyEquivalent, billingCycle),
                      )
                    : "Not added"
                }
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
                  {getMonthlyEquivalentNote(totalMonthlyEquivalent)} effective
                  monthly spend on annual billing.
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
                  Switching this exact configuration to annual billing would
                  bring it to{" "}
                  {getMonthlyEquivalentNote(annualMonthlyEquivalent)} and{" "}
                  {formatCurrency(annualMonthlyEquivalent * 12)} / year.
                </p>
              </div>
            )}

            <div className="border-t border-border/70 pt-4">
              <ScaleLink copy="Need a larger rollout or enterprise pricing? Talk to sales" />
            </div>
          </div>
        }
      />
    </div>
  );
}
