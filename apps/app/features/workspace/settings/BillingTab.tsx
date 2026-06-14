"use client";

import { useGetBillingChargebee } from "@/hooks/billing/useGetBillingChargebee";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
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
import { PiArrowSquareOutDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";

function BillingTab() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetBillingChargebee();

  const openInvoice = (invoiceId: string) => {
    router.push(`/settings/billing/invoices/${encodeURIComponent(invoiceId)}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unable to load billing information."}
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { account, connection, invoices, invoiceError } = data;
  const subscription = account.chargebee;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Billing</h2>
            <Badge variant="outline" className="capitalize">
              {account.status}
            </Badge>
            {connection.linked ? (
              <Badge variant="secondary">Subscription active</Badge>
            ) : (
              <Badge variant="outline">Billing not set up</Badge>
            )}
            {account.pastDue ? <Badge variant="destructive">Past due</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Your plan, subscription term, and invoices.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-sm font-medium">Plan</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Plan</dt>
              <dd>{subscription?.planName ?? subscription?.planId ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Cadence</dt>
              <dd className="capitalize">{subscription?.billingCadence ?? account.billingCadence}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Subscription status</dt>
              <dd className="capitalize">{subscription?.subscriptionStatus ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-sm font-medium">Current term</h3>
          {subscription?.currentTermStart && subscription?.currentTermEnd ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Term</dt>
                <dd>
                  {formatToLocalDate(subscription.currentTermStart)} –{" "}
                  {formatToLocalDate(subscription.currentTermEnd)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Next billing</dt>
                <dd>
                  {subscription.nextBillingAt
                    ? formatToLocalDate(subscription.nextBillingAt)
                    : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Subscription term dates appear once billing is set up for this workspace.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium">Add-ons</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Included seats</dt>
            <dd>{account.usageLimits.seats.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">SSO</dt>
            <dd>{account.sso.enabled ? "Enabled" : "Not enabled"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium">Billing references</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Customer ID</dt>
            <dd className="font-mono text-xs mt-0.5">{connection.customerId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Subscription ID</dt>
            <dd className="font-mono text-xs mt-0.5">{connection.subscriptionId ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium">Invoices</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Refreshed when you open this tab.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>

        {invoiceError ? (
          <p className="text-sm text-amber-700">{invoiceError}</p>
        ) : null}

        {!connection.customerId ? (
          <p className="text-sm text-muted-foreground">
            Invoices will appear once billing is set up for this workspace.
          </p>
        ) : invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Due</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer"
                  onClick={() => openInvoice(invoice.id)}
                >
                  <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                  <TableCell>
                    {invoice.date ? formatToLocalDate(invoice.date) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={invoiceStatusVariant(invoice.status)} className="capitalize">
                      {invoice.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatBillingMoney(invoice.total, invoice.currencyCode)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatBillingMoney(invoice.amountDue, invoice.currencyCode)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`View invoice ${invoice.id}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openInvoice(invoice.id);
                      }}
                    >
                      <PiArrowSquareOutDuotone className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default BillingTab;
