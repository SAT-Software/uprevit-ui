"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetBillingChargebee } from "@/hooks/billing/useGetBillingChargebee";
import { useGetBillingSummary } from "@/hooks/billing/useGetBillingSummary";
import { BillingInvoicesTable } from "@/features/billing/BillingInvoicesTable";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import { Separator } from "@uprevit/ui/components/ui/separator";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import {
  billingAccountStatusVariant,
  formatSubscriptionStatusLabel,
  getBillingStatusLabel,
} from "@/utils/billingStatusDisplay";
import {
  Alert01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Invoice01Icon,
  Key01Icon,
  LimitationIcon,
  SecurityCheckIcon,
  Tag01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import type {
  BillingAccountStatus,
  BillingCadence,
  WorkspaceBillingSummary,
} from "@/types/billing";

function billingStatusTone(
  status: BillingAccountStatus,
  pastDue?: boolean | null,
): string {
  if (pastDue || status === "past_due") return "bg-amber-500";
  if (status === "active") return "bg-emerald-500";
  if (status === "cancelled") return "bg-muted-foreground/50";
  return "bg-sky-500";
}

function formatBillingCadenceLabel(cadence: BillingCadence): string {
  return cadence === "yearly" ? "Yearly" : "Monthly";
}

function UsageBillingStatusHoverCard({
  status,
  pastDue,
  billingCadence,
  limitsEnabled,
}: {
  status: BillingAccountStatus;
  pastDue?: boolean | null;
  billingCadence: BillingCadence;
  limitsEnabled: boolean;
}) {
  const statusLabel = getBillingStatusLabel(status, pastDue);
  const cadenceLabel = formatBillingCadenceLabel(billingCadence);

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1.5 text-muted-foreground"
          aria-label="View billing status"
        >
          <Icon icon={CreditCardIcon} size={14} strokeWidth={2} />
          Billing status
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-72 p-0">
        <div className="px-4 py-3">
          <p className="text-sm font-medium text-foreground">
            Workspace billing
          </p>
          <p className="text-xs text-muted-foreground">
            Subscription status, plan, and limit enforcement
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
                icon={Calendar03Icon}
                size={14}
                strokeWidth={2}
                className="text-muted-foreground/70"
              />
              <p className="text-xs text-muted-foreground">Plan</p>
            </div>
            <p className="text-xs font-medium text-foreground">{cadenceLabel}</p>
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

function BillingUsagePeriodCard({
  summary,
}: {
  summary: WorkspaceBillingSummary;
}) {
  const hasOverage =
    summary.limitStatus.seats.overLimit ||
    summary.limitStatus.exports.overLimit ||
    summary.limitStatus.uploadGb.overLimit;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <p className="text-sm font-medium">Usage period</p>
        <InfoTooltip
          content={
            summary.period.source === "chargebee"
              ? "Dates for the current subscription term. Usage tracked from the start date to the end date of the subscription term."
              : "Dates for the current billing period. Usage tracked from the start date to the end date of the billing period."
          }
        />
        <UsageBillingStatusHoverCard
          status={summary.account.status}
          pastDue={summary.account.pastDue}
          billingCadence={summary.account.billingCadence}
          limitsEnabled={summary.limitsEnabled}
        />
      </div>

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {formatToLocalDate(summary.period.start)} –{" "}
            {formatToLocalDate(summary.period.end)}
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.period.source === "chargebee"
              ? "Subscription term"
              : "Standard billing period"}
          </p>
        </div>
        {hasOverage && summary.enforcementMode === "overage" ? (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/50 dark:bg-amber-950/30">
            <Icon
              icon={Alert01Icon}
              size={14}
              strokeWidth={2}
              className="shrink-0 text-amber-700 dark:text-amber-300"
            />
            <p className="text-xs text-amber-900 dark:text-amber-100">
              Usage exceeds configured limits this period.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BillingTab() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetBillingChargebee();
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetBillingSummary();

  const openInvoice = (invoiceId: string) => {
    router.push(`/settings/billing/invoices/${encodeURIComponent(invoiceId)}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="rounded-lg bg-destructive/10 p-2.5 shrink-0">
          <Icon icon={Alert01Icon} size={20} strokeWidth={2} className="text-destructive" />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="text-sm font-medium">Unable to load billing information</div>
          <div className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Something went wrong while fetching billing details."}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { account, connection, invoices, invoiceError } = data;
  const subscription = account.chargebee;
  const hasSubscriptionDates =
    !!subscription?.currentTermStart && !!subscription?.currentTermEnd;

  return (
    <div className="space-y-6">
      {/* Usage period — parked here while Usage tab focuses on metrics + enforcement */}
      {isSummaryLoading ? (
        <Skeleton className="h-24 rounded-2xl" />
      ) : summary && !isSummaryError ? (
        <BillingUsagePeriodCard summary={summary} />
      ) : null}

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border bg-accent p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-background">
            <Icon icon={CreditCardIcon} size={32} strokeWidth={2} className="text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">Billing</h2>
              <Badge
                variant={billingAccountStatusVariant(account.status, account.pastDue)}
                className="capitalize"
              >
                {getBillingStatusLabel(account.status, account.pastDue)}
              </Badge>
              {!connection.linked ? (
                <Badge variant="outline">Billing not set up</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Your plan, subscription term, and invoices.
            </p>
          </div>
        </div>

        {account.pastDue ? (
          <div className="flex shrink-0 items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 dark:border-amber-800 dark:bg-amber-950/40 sm:items-center md:max-w-2xl md:whitespace-nowrap">
            <Icon
              icon={Alert01Icon}
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400 sm:mt-0"
            />
            <p className="text-xs leading-snug text-amber-900 dark:text-amber-200">
              Your account is past due. Please review your payment method or contact support.
            </p>
          </div>
        ) : null}
      </div>

      {/* Plan & Term */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="space-y-1 p-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon icon={Tag01Icon} size={16} strokeWidth={2} className="text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-medium">
                  {subscription?.planName ?? subscription?.planId ?? "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Cadence</dt>
                <dd className="capitalize font-medium">
                  {subscription?.billingCadence ?? account.billingCadence}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Subscription status</dt>
                <dd className="capitalize font-medium">
                  {formatSubscriptionStatusLabel(
                    subscription?.subscriptionStatus,
                    account.status,
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="space-y-1 p-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon icon={Calendar03Icon} size={16} strokeWidth={2} className="text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Current term</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            {hasSubscriptionDates ? (
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Term</dt>
                  <dd className="font-medium">
                    {formatToLocalDate(subscription!.currentTermStart!)} –{" "}
                    {formatToLocalDate(subscription!.currentTermEnd!)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Next billing</dt>
                  <dd className="font-medium">
                    {subscription?.nextBillingAt
                      ? formatToLocalDate(subscription.nextBillingAt)
                      : "—"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Subscription term dates appear once billing is set up for this
                workspace.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add-ons */}
      <Card className="shadow-none">
        <CardHeader className="space-y-1 p-6 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-muted p-2 shrink-0">
              <Icon icon={SecurityCheckIcon} size={16} strokeWidth={2} className="text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Add-ons</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon icon={UserGroupIcon} size={16} strokeWidth={2} className="text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">
                  Included seats
                </div>
                <div className="text-sm font-medium">
                  {account.usageLimits.seats.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon icon={SecurityCheckIcon} size={16} strokeWidth={2} className="text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">SSO</div>
                <div className="text-sm font-medium">
                  {account.sso.enabled ? "Enabled" : "Not enabled"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing references */}
      <Card className="shadow-none">
        <CardHeader className="space-y-1 p-6 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-muted p-2 shrink-0">
              <Icon icon={Key01Icon} size={16} strokeWidth={2} className="text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Billing references</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Identifiers from your billing provider.
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Customer ID</div>
              <div className="font-mono text-xs mt-1 break-all">
                {connection.customerId ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                Subscription ID
              </div>
              <div className="font-mono text-xs mt-1 break-all">
                {connection.subscriptionId ?? "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-col gap-1 p-6 pb-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon icon={Invoice01Icon} size={16} strokeWidth={2} className="text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Invoices</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Refreshed when you open this tab.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2 sm:mt-0"
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          {invoiceError ? (
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <Icon
                icon={Alert01Icon}
                size={16}
                strokeWidth={2}
                className="shrink-0 text-amber-700 dark:text-amber-400"
              />
              {invoiceError}
            </div>
          ) : !connection.customerId ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <Icon
                icon={Invoice01Icon}
                size={32}
                strokeWidth={2}
                className="text-muted-foreground/40"
              />
              <p className="text-sm text-muted-foreground">
                Invoices will appear once billing is set up for this workspace.
              </p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <Icon
                icon={Invoice01Icon}
                size={32}
                strokeWidth={2}
                className="text-muted-foreground/40"
              />
              <p className="text-sm text-muted-foreground">No invoices found.</p>
            </div>
          ) : (
            <BillingInvoicesTable invoices={invoices} onInvoiceClick={openInvoice} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BillingTab;
