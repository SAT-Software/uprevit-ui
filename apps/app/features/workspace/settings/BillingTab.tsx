"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetBillingChargebee } from "@/hooks/billing/useGetBillingChargebee";
import { BillingInvoicesTable } from "@/features/billing/BillingInvoicesTable";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import {
  billingAccountStatusVariant,
  formatSubscriptionStatusLabel,
  getBillingStatusLabel,
} from "@/utils/billingStatusDisplay";
import {
  AlertCircleIcon,
  Invoice01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

const BILLING_INFO =
  "Your plan, subscription term, included seats, and invoices. Contact Uprevit support to change your plan.";

function BillingHeader({ action }: { action?: ReactNode }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">Billing</h2>
        <InfoTooltip content={BILLING_INFO} />
      </div>
      {action}
    </div>
  );
}

function BillingSection({
  title,
  info,
  action,
  children,
}: {
  title: string;
  info?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {info ? <InfoTooltip content={info} /> : null}
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

function BillingTab() {
  const router = useRouter();
  const { data, isLoading, isError, isFetching, refetch } =
    useGetBillingChargebee();

  if (isLoading) {
    return (
      <div className="-m-2 flex flex-col">
        <BillingHeader action={<Skeleton className="h-5 w-16 rounded-md" />} />
        <div className="flex flex-col gap-2 p-2">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="-m-2 flex flex-col">
        <BillingHeader />
        <div className="p-2">
          <ErrorState
            icon={AlertCircleIcon}
            title="Failed to load billing information"
            description="Something went wrong while fetching your plan and invoices."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const { account, connection, invoices, invoiceError } = data;
  const subscription = account.chargebee;
  const openInvoice = (invoiceId: string) =>
    router.push(`/settings/billing/invoices/${encodeURIComponent(invoiceId)}`);

  return (
    <div className="-m-2 flex flex-col">
      <BillingHeader
        action={
          <Badge
            variant={billingAccountStatusVariant(account.status, account.pastDue)}
            className="capitalize"
          >
            {getBillingStatusLabel(account.status, account.pastDue)}
          </Badge>
        }
      />

      <div className="flex flex-col gap-2 p-2">
        {account.pastDue ? (
          <div
            role="status"
            className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/50 dark:bg-amber-950/30"
          >
            <Icon
              icon={AlertCircleIcon}
              size={14}
              strokeWidth={2}
              className="shrink-0 text-amber-700 dark:text-amber-300"
            />
            <p className="text-xs text-amber-900 dark:text-amber-100">
              An invoice is past due. Check the invoices below, or contact
              Uprevit support if you&apos;ve already paid.
            </p>
          </div>
        ) : null}

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <BillingSection title="Plan">
            <dl className="flex flex-col gap-3 p-4">
              <DetailRow
                label="Plan"
                value={
                  subscription?.planName ??
                  subscription?.planId
                    ?.replace(/-[A-Z]{3}-(Monthly|Yearly)$/, "")
                    .replace(/-/g, " ") ??
                  "—"
                }
              />
              <DetailRow
                label="Billing"
                value={
                  (subscription?.billingCadence ?? account.billingCadence) ===
                  "yearly"
                    ? "Yearly"
                    : "Monthly"
                }
              />
              <DetailRow
                label="Status"
                value={
                  <span className="capitalize">
                    {formatSubscriptionStatusLabel(
                      subscription?.subscriptionStatus,
                      account.status,
                    )}
                  </span>
                }
              />
            </dl>
          </BillingSection>

          <BillingSection title="Current term">
            {subscription?.currentTermStart && subscription.currentTermEnd ? (
              <dl className="flex flex-col gap-3 p-4">
                <DetailRow
                  label="Starts"
                  value={formatToLocalDate(subscription.currentTermStart)}
                />
                <DetailRow
                  label="Ends"
                  value={formatToLocalDate(subscription.currentTermEnd)}
                />
                <DetailRow
                  label="Next billing"
                  value={
                    subscription.nextBillingAt
                      ? formatToLocalDate(subscription.nextBillingAt)
                      : "—"
                  }
                />
              </dl>
            ) : (
              <p className="p-4 text-xs text-muted-foreground">
                Term dates appear once billing is set up for this workspace.
              </p>
            )}
          </BillingSection>

          <BillingSection
            title="Included"
            info="Seats and add-ons in your subscription. Manager-only members are free and don't use a seat."
          >
            <dl className="flex flex-col gap-3 p-4">
              <DetailRow
                label="Full seats"
                value={account.usageLimits.seats.toLocaleString()}
              />
              <DetailRow
                label="Approver seats"
                value={account.usageLimits.approverSeats.toLocaleString()}
              />
              <DetailRow
                label="SSO"
                value={account.sso.enabled ? "Enabled" : "Not included"}
              />
            </dl>
          </BillingSection>

          <BillingSection
            title="References"
            info="Share these with Uprevit support when asking about a bill."
          >
            <dl className="flex flex-col gap-3 p-4">
              <DetailRow
                label="Customer ID"
                value={
                  <span className="break-all font-mono text-xs">
                    {connection.customerId ?? "—"}
                  </span>
                }
              />
              <DetailRow
                label="Subscription ID"
                value={
                  <span className="break-all font-mono text-xs">
                    {connection.subscriptionId ?? "—"}
                  </span>
                }
              />
            </dl>
          </BillingSection>
        </div>

        <BillingSection
          title="Invoices"
          info="Open an invoice to see its line items and download the PDF."
          action={
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-muted-foreground"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <Icon icon={RefreshIcon} size={14} strokeWidth={2} />
              {isFetching ? "Refreshing…" : "Refresh"}
            </Button>
          }
        >
          {invoiceError ? (
            <ErrorState
              icon={AlertCircleIcon}
              title="Couldn't load invoices"
              description="Unable to reach the billing provider. Try again, or contact Uprevit support if it keeps happening."
              onRetry={() => refetch()}
              embedded
            />
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={Invoice01Icon}
              title={connection.customerId ? "No invoices yet" : "Billing isn't set up yet"}
              description={
                connection.customerId
                  ? "Invoices appear here once they're issued."
                  : "Invoices appear here once Uprevit sets up billing for this workspace."
              }
              embedded
            />
          ) : (
            <BillingInvoicesTable invoices={invoices} onInvoiceClick={openInvoice} />
          )}
        </BillingSection>
      </div>
    </div>
  );
}

export default BillingTab;
