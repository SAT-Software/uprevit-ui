"use client";

import { useGetBillingInvoice } from "@/hooks/billing/useGetBillingInvoice";
import { useDownloadBillingInvoice } from "@/hooks/billing/useDownloadBillingInvoice";
import { useGetPlatformBillingInvoice } from "@/hooks/platform-admin/useGetPlatformBillingInvoice";
import { useDownloadPlatformBillingInvoice } from "@/hooks/platform-admin/useDownloadPlatformBillingInvoice";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
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
import {
  PiArrowLeft,
  PiCalendarDuotone,
  PiDownloadDuotone,
  PiListBulletsDuotone,
  PiMapPinDuotone,
  PiReceiptDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
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
  backHref?: string;
  apiScope?: "workspace" | "platform-admin";
};

function BillingInvoiceDetail({
  workspaceId,
  invoiceId,
  backHref = "/settings?tab=billing",
  apiScope = "workspace",
}: BillingInvoiceDetailProps) {
  const isPlatformAdmin = apiScope === "platform-admin";
  const workspaceInvoice = useGetBillingInvoice(workspaceId, invoiceId, !isPlatformAdmin);
  const platformInvoice = useGetPlatformBillingInvoice(workspaceId, invoiceId, isPlatformAdmin);
  const workspaceDownload = useDownloadBillingInvoice(workspaceId, invoiceId);
  const platformDownload = useDownloadPlatformBillingInvoice(workspaceId, invoiceId);

  const { data: invoice, isLoading, isError, error, refetch } =
    apiScope === "platform-admin" ? platformInvoice : workspaceInvoice;
  const downloadInvoice =
    apiScope === "platform-admin" ? platformDownload : workspaceDownload;

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
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[120px] w-full rounded-lg" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    const message = error instanceof Error ? error.message : "Unable to load invoice.";
    const isNotFound = message.toLowerCase().includes("not found");

    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
          <Link href={backHref} className="flex items-center gap-2">
            <PiArrowLeft className="h-4 w-4" />
            Back to invoices
          </Link>
        </Button>
        <div className="flex items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="rounded-lg bg-destructive/10 p-2.5 shrink-0">
            <PiWarningCircleDuotone className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="text-sm font-medium">
              {isNotFound ? "Invoice not found" : "Unable to load invoice"}
            </div>
            <div className="text-sm text-muted-foreground">
              {isNotFound
                ? "This invoice may have been removed or the link is incorrect."
                : message}
            </div>
          </div>
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

  const amountDuePositive = invoice.amountDue > 0;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
        <Link href={backHref} className="flex items-center gap-2">
          <PiArrowLeft className="h-4 w-4" />
          Back to invoices
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border bg-accent p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-border bg-background p-3 shrink-0">
            <PiReceiptDuotone className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">Invoice {invoice.id}</h2>
              <Badge
                variant={invoiceStatusVariant(invoice.status)}
                className="capitalize"
              >
                {invoice.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PiCalendarDuotone className="h-4 w-4" />
                Issued{" "}
                <span className="font-medium text-foreground">
                  {invoice.date ? formatToLocalDate(invoice.date) : "—"}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <PiCalendarDuotone className="h-4 w-4" />
                Due{" "}
                <span className="font-medium text-foreground">
                  {invoice.dueDate ? formatToLocalDate(invoice.dueDate) : "—"}
                </span>
              </span>
            </div>
          </div>
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

      {/* Line items */}
      <Card className="shadow-none">
        <CardHeader className="space-y-1 p-6 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-muted p-2 shrink-0">
              <PiListBulletsDuotone className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Line items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          {invoice.lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <PiListBulletsDuotone className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No line items on this invoice.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-background">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-11 border-r border-border text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      Description
                    </TableHead>
                    <TableHead className="h-11 border-r border-border text-right text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      Qty
                    </TableHead>
                    <TableHead className="h-11 border-r border-border text-right text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      Unit price
                    </TableHead>
                    <TableHead className="h-11 border-r border-border text-right text-xs uppercase font-medium text-muted-foreground last:border-r-0">
                      Amount
                    </TableHead>
                    <TableHead className="h-11 text-xs uppercase font-medium text-muted-foreground">
                      Period
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="py-3 font-medium">
                        {item.description ?? "—"}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {formatBillingMoney(item.unitAmount, currencyCode)}
                      </TableCell>
                      <TableCell className="py-3 text-right font-medium">
                        {formatBillingMoney(item.amount, currencyCode)}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {item.dateFrom && item.dateTo
                          ? `${formatToLocalDate(item.dateFrom)} – ${formatToLocalDate(item.dateTo)}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Totals */}
        <Card className="shadow-none">
          <CardHeader className="space-y-1 p-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <PiReceiptDuotone className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Totals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <dl className="space-y-2.5 text-sm">
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
              {typeof invoice.creditsApplied === "number" &&
              invoice.creditsApplied > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Credits applied</dt>
                  <dd>
                    -{formatBillingMoney(invoice.creditsApplied, currencyCode)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatBillingMoney(invoice.total, currencyCode)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount paid</dt>
                <dd>{formatBillingMoney(invoice.amountPaid, currencyCode)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Amount due</dt>
                <dd
                  className={
                    amountDuePositive ? "font-semibold text-destructive" : ""
                  }
                >
                  {formatBillingMoney(invoice.amountDue, currencyCode)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Billing details */}
        <Card className="shadow-none">
          <CardHeader className="space-y-1 p-6 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <PiMapPinDuotone className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">Billing details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-4">
            {addressLines.length > 0 ? (
              <address className="space-y-0.5 text-sm not-italic">
                {addressLines.map((line, index) => (
                  <div
                    key={line}
                    className={index === 0 ? "font-medium" : "text-muted-foreground"}
                  >
                    {line}
                  </div>
                ))}
              </address>
            ) : (
              <p className="text-sm text-muted-foreground">
                No billing address on file.
              </p>
            )}
            <dl className="grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Customer ID</dt>
                <dd className="font-mono text-xs mt-1 break-all">
                  {invoice.customerId}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Subscription ID</dt>
                <dd className="font-mono text-xs mt-1 break-all">
                  {invoice.subscriptionId ?? "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BillingInvoiceDetail;
