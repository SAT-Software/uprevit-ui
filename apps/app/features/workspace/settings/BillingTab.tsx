"use client";

import { useGetBillingChargebee } from "@/hooks/billing/useGetBillingChargebee";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import {
  formatBillingMoney,
  invoiceStatusVariant,
} from "@/utils/billingFormat";
import {
  PiCalendarDuotone,
  PiCoinsDuotone,
  PiCreditCardDuotone,
  PiInfoDuotone,
  PiKeyDuotone,
  PiMoneyDuotone,
  PiReceiptDuotone,
  PiShieldCheckDuotone,
  PiTagDuotone,
  PiUsersDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";

function InvoiceTableHeader({
  title,
  icon: Icon,
  align = "left",
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  align?: "left" | "right";
}) {
  return (
    <div
      className={
        align === "right"
          ? "flex items-center justify-end gap-2"
          : "flex items-center gap-2"
      }
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{title}</span>
    </div>
  );
}

function BillingTab() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetBillingChargebee();

  const openInvoice = (invoiceId: string) => {
    router.push(`/settings/billing/invoices/${encodeURIComponent(invoiceId)}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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
          <PiWarningCircleDuotone className="h-5 w-5 text-destructive" />
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
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border bg-accent p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-background">
            <PiCreditCardDuotone className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">Billing</h2>
              <Badge variant="outline" className="capitalize">
                {account.status}
              </Badge>
              {subscription?.subscriptionStatus ? (
                <Badge variant="secondary" className="capitalize">
                  {subscription.subscriptionStatus.replace(/_/g, " ")}
                </Badge>
              ) : connection.linked ? (
                <Badge variant="outline">Subscription linked</Badge>
              ) : (
                <Badge variant="outline">Billing not set up</Badge>
              )}
              {account.pastDue ? (
                <Badge variant="destructive">Past due</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Your plan, subscription term, and invoices.
            </p>
          </div>
        </div>

        {account.pastDue ? (
          <div className="flex shrink-0 items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 dark:border-amber-800 dark:bg-amber-950/40 sm:items-center md:max-w-2xl md:whitespace-nowrap">
            <PiWarningCircleDuotone className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 sm:mt-0" />
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
                <PiTagDuotone className="h-4 w-4 text-muted-foreground" />
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
                  {subscription?.subscriptionStatus ?? "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="space-y-1 p-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <PiCalendarDuotone className="h-4 w-4 text-muted-foreground" />
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
              <PiShieldCheckDuotone className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Add-ons</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <PiUsersDuotone className="h-4 w-4 text-muted-foreground" />
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
                <PiShieldCheckDuotone className="h-4 w-4 text-muted-foreground" />
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
              <PiKeyDuotone className="h-4 w-4 text-muted-foreground" />
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
                <PiReceiptDuotone className="h-4 w-4 text-muted-foreground" />
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
            <div className="mb-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <PiWarningCircleDuotone className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
              {invoiceError}
            </div>
          ) : null}

          {!connection.customerId ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <PiReceiptDuotone className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Invoices will appear once billing is set up for this workspace.
              </p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <PiReceiptDuotone className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No invoices found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-background">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-11 border-r border-border text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      <InvoiceTableHeader title="Invoice" icon={PiReceiptDuotone} />
                    </TableHead>
                    <TableHead className="h-11 border-r border-border text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      <InvoiceTableHeader title="Date" icon={PiCalendarDuotone} />
                    </TableHead>
                    <TableHead className="h-11 border-r border-border text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      <InvoiceTableHeader title="Status" icon={PiInfoDuotone} />
                    </TableHead>
                    <TableHead className="h-11 border-r border-border text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      <InvoiceTableHeader
                        title="Total"
                        icon={PiCoinsDuotone}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="h-11 text-xs uppercase font-medium text-muted-foreground">
                      <InvoiceTableHeader
                        title="Due"
                        icon={PiMoneyDuotone}
                        align="right"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => openInvoice(invoice.id)}
                    >
                      <TableCell className="py-3 font-mono text-xs">
                        {invoice.id}
                      </TableCell>
                      <TableCell className="py-3">
                        {invoice.date ? formatToLocalDate(invoice.date) : "—"}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant={invoiceStatusVariant(invoice.status)}
                          className="capitalize"
                        >
                          {invoice.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {formatBillingMoney(invoice.total, invoice.currencyCode)}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {formatBillingMoney(
                          invoice.amountDue,
                          invoice.currencyCode,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BillingTab;
