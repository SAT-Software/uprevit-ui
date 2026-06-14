"use client";

import { useGetBillingInvoice } from "@/hooks/billing/useGetBillingInvoice";
import { useDownloadBillingInvoice } from "@/hooks/billing/useDownloadBillingInvoice";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
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
import type { ChargebeeBillingAddress } from "@/types/billing";
import { PiArrowLeft, PiDownloadDuotone } from "react-icons/pi";
import Link from "next/link";
import { toast } from "sonner";

function formatBillingAddress(address: ChargebeeBillingAddress): string[] {
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
  const cityLine = [address.city, address.state, address.zip]
    .filter(Boolean)
    .join(", ");

  return [
    name,
    address.company,
    address.line1,
    address.line2,
    cityLine,
    address.country,
  ].filter((line): line is string => Boolean(line?.trim()));
}

type BillingInvoiceDetailProps = {
  workspaceId: string;
  invoiceId: string;
};

function BillingInvoiceDetail({ workspaceId, invoiceId }: BillingInvoiceDetailProps) {
  const { data: invoice, isLoading, isError, error, refetch } = useGetBillingInvoice(
    workspaceId,
    invoiceId,
  );
  const downloadInvoice = useDownloadBillingInvoice(workspaceId, invoiceId);

  const handleDownload = () => {
    downloadInvoice.mutate(undefined, {
      onSuccess: (data) => {
        const downloadUrl = data.pdfDownloadUrl ?? data.downloads[0]?.downloadUrl;
        if (!downloadUrl) {
          toast.error("Invoice PDF is not available");
          return;
        }

        window.open(downloadUrl, "_blank", "noopener,noreferrer");
      },
      onError: (downloadError) => {
        toast.error(
          downloadError instanceof Error
            ? downloadError.message
            : "Failed to download invoice",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !invoice) {
    const message = error instanceof Error ? error.message : "Unable to load invoice.";
    const isNotFound = message.toLowerCase().includes("not found");

    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isNotFound ? "Invoice not found." : message}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings?tab=billing">Back to billing</Link>
          </Button>
          {!isNotFound ? (
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const currencyCode = invoice.currencyCode;
  const addressLines = invoice.billingAddress
    ? formatBillingAddress(invoice.billingAddress)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
            <Link href="/settings?tab=billing" className="flex items-center gap-2">
              <PiArrowLeft className="h-4 w-4" />
              Back to billing
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Invoice {invoice.id}</h2>
            <Badge variant={invoiceStatusVariant(invoice.status)} className="capitalize">
              {invoice.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <dl className="grid gap-1 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Invoice date</dt>
              <dd>{invoice.date ? formatToLocalDate(invoice.date) : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Due date</dt>
              <dd>{invoice.dueDate ? formatToLocalDate(invoice.dueDate) : "—"}</dd>
            </div>
          </dl>
        </div>

        <Button
          onClick={handleDownload}
          disabled={downloadInvoice.isPending}
          className="w-fit"
        >
          {downloadInvoice.isPending ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <PiDownloadDuotone className="mr-2 h-4 w-4" />
          )}
          Download PDF
        </Button>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium">Line items</h3>
        {invoice.lineItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No line items on this invoice.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description ?? "—"}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatBillingMoney(item.unitAmount, currencyCode)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatBillingMoney(item.amount, currencyCode)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.dateFrom && item.dateTo
                      ? `${formatToLocalDate(item.dateFrom)} – ${formatToLocalDate(item.dateTo)}`
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-sm font-medium">Totals</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatBillingMoney(invoice.subTotal, currencyCode)}</dd>
            </div>
            {typeof invoice.tax === "number" ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tax</dt>
                <dd>{formatBillingMoney(invoice.tax, currencyCode)}</dd>
              </div>
            ) : null}
            {typeof invoice.creditsApplied === "number" && invoice.creditsApplied > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Credits applied</dt>
                <dd>{formatBillingMoney(invoice.creditsApplied, currencyCode)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 font-medium">
              <dt>Total</dt>
              <dd>{formatBillingMoney(invoice.total, currencyCode)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd>{formatBillingMoney(invoice.amountPaid, currencyCode)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Amount due</dt>
              <dd>{formatBillingMoney(invoice.amountDue, currencyCode)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-sm font-medium">Billing details</h3>
          {addressLines.length > 0 ? (
            <address className="space-y-0.5 text-sm not-italic">
              {addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
          ) : (
            <p className="text-sm text-muted-foreground">No billing address on file.</p>
          )}
          <dl className="space-y-2 border-t border-border pt-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Customer ID</dt>
              <dd className="font-mono text-xs mt-0.5">{invoice.customerId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subscription ID</dt>
              <dd className="font-mono text-xs mt-0.5">
                {invoice.subscriptionId ?? "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default BillingInvoiceDetail;
