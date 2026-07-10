"use client";

import { useGetBillingInvoice } from "@/hooks/billing/useGetBillingInvoice";
import { useDownloadBillingInvoice } from "@/hooks/billing/useDownloadBillingInvoice";
import { useGetPlatformBillingInvoice } from "@/hooks/platform-admin/useGetPlatformBillingInvoice";
import { useDownloadPlatformBillingInvoice } from "@/hooks/platform-admin/useDownloadPlatformBillingInvoice";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@uprevit/ui/components/ui/frame";
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
  Download04Icon,
  Invoice01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@uprevit/ui/lib/utils";

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

function TotalsRow({
  label,
  value,
  emphasize,
  destructive,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  destructive?: boolean;
}) {
  return (
    <Frame stacked dense spacing="sm" className="w-full">
      <FrameHeader className="flex flex-row items-center justify-between gap-3">
        <span
          className={cn(
            "text-sm",
            emphasize ? "font-semibold text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "text-sm tabular-nums",
            emphasize && "font-semibold",
            destructive && "font-semibold text-destructive",
          )}
        >
          {value}
        </span>
      </FrameHeader>
    </Frame>
  );
}

type BillingInvoiceDetailProps = {
  workspaceId: string;
  invoiceId: string;
  backHref?: string;
  apiScope?: "workspace" | "platform-admin";
  showBackLink?: boolean;
  edgeConnected?: boolean;
};

function BillingInvoiceDetail({
  workspaceId,
  invoiceId,
  backHref = "/settings?tab=billing",
  apiScope = "workspace",
  showBackLink,
  edgeConnected = false,
}: BillingInvoiceDetailProps) {
  const isPlatformAdmin = apiScope === "platform-admin";
  const shouldShowBackLink =
    showBackLink ?? !isPlatformAdmin;
  const workspaceInvoice = useGetBillingInvoice(
    workspaceId,
    invoiceId,
    !isPlatformAdmin,
  );
  const platformInvoice = useGetPlatformBillingInvoice(
    workspaceId,
    invoiceId,
    isPlatformAdmin,
  );
  const workspaceDownload = useDownloadBillingInvoice(workspaceId, invoiceId);
  const platformDownload = useDownloadPlatformBillingInvoice(
    workspaceId,
    invoiceId,
  );

  const { data: invoice, isLoading, isError, error, refetch } =
    apiScope === "platform-admin" ? platformInvoice : workspaceInvoice;
  const downloadInvoice =
    apiScope === "platform-admin" ? platformDownload : workspaceDownload;

  const handleDownload = () => {
    downloadInvoice.mutate(undefined, {
      onSuccess: (data) => {
        const downloadUrl =
          data.pdfDownloadUrl ?? data.downloads[0]?.downloadUrl;
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
      <div className={cn("flex flex-col", !edgeConnected && "gap-2")}>
        <Skeleton className={cn("h-20 w-full", !edgeConnected && "rounded-xl")} />
        <Skeleton className={cn("h-56 w-full", !edgeConnected && "rounded-xl")} />
        <div className="grid gap-2 md:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    const message =
      error instanceof Error ? error.message : "Unable to load invoice.";
    const isNotFound = message.toLowerCase().includes("not found");

    return (
      <div className={cn("space-y-4", edgeConnected ? "p-4" : undefined)}>
        {shouldShowBackLink ? (
          <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
            <Link href={backHref}>Back to invoices</Link>
          </Button>
        ) : null}
        <div className="flex items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
            <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
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
    <div className="flex flex-col">
      {/* Header — edge-connected when used in platform admin */}
      <div
        className={cn(
          "flex flex-col gap-3 border-b border-border bg-background sm:flex-row sm:items-center sm:justify-between",
          edgeConnected ? "px-4 py-4" : "rounded-xl border p-4",
        )}
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">Invoice {invoice.id}</h2>
            <Badge
              variant={invoiceStatusVariant(invoice.status)}
              className="capitalize"
            >
              {invoice.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              Issued{" "}
              <span className="font-medium text-foreground">
                {invoice.date ? formatToLocalDate(invoice.date) : "—"}
              </span>
            </span>
            <span>
              Due{" "}
              <span className="font-medium text-foreground">
                {invoice.dueDate ? formatToLocalDate(invoice.dueDate) : "—"}
              </span>
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={downloadInvoice.isPending}
          size="sm"
          className="w-fit shrink-0"
        >
          {downloadInvoice.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Icon icon={Download04Icon} size={14} strokeWidth={2} />
          )}
          Download PDF
        </Button>
      </div>

      {/* Line items */}
      <div className="border-b border-border">
        <div className="flex h-10 shrink-0 items-center border-b border-border pl-3 pr-2">
          <p className="text-sm font-medium">Line items</p>
        </div>
        {invoice.lineItems.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
            <Icon
              icon={Invoice01Icon}
              size={24}
              strokeWidth={2}
              className="text-muted-foreground/30"
            />
            <p className="text-sm text-muted-foreground">
              No line items on this invoice.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-muted">
                <TableRow className="h-10 hover:bg-transparent">
                  <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
                    Description
                  </TableHead>
                  <TableHead className="h-10 border-r border-border text-right text-xs font-medium text-muted-foreground/60 last:border-r-0">
                    Qty
                  </TableHead>
                  <TableHead className="h-10 border-r border-border text-right text-xs font-medium text-muted-foreground/60 last:border-r-0">
                    Unit price
                  </TableHead>
                  <TableHead className="h-10 border-r border-border text-right text-xs font-medium text-muted-foreground/60 last:border-r-0">
                    Amount
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground/60">
                    Period
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
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
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2">
        {/* Totals */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Totals</p>
          <div className="flex flex-col gap-1.5">
            <TotalsRow
              label="Subtotal"
              value={formatBillingMoney(invoice.subTotal, currencyCode)}
            />
            {typeof invoice.tax === "number" ? (
              <TotalsRow
                label="Tax"
                value={formatBillingMoney(invoice.tax, currencyCode)}
              />
            ) : null}
            {typeof invoice.creditsApplied === "number" &&
            invoice.creditsApplied > 0 ? (
              <TotalsRow
                label="Credits applied"
                value={`-${formatBillingMoney(invoice.creditsApplied, currencyCode)}`}
              />
            ) : null}
            <TotalsRow
              label="Total"
              value={formatBillingMoney(invoice.total, currencyCode)}
              emphasize
            />
            <TotalsRow
              label="Amount paid"
              value={formatBillingMoney(invoice.amountPaid, currencyCode)}
            />
            <TotalsRow
              label="Amount due"
              value={formatBillingMoney(invoice.amountDue, currencyCode)}
              destructive={amountDuePositive}
            />
          </div>
        </div>

        {/* Billing details */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Billing details</p>
          <Frame stacked dense spacing="sm" className="w-full">
            <FrameHeader>
              <FrameTitle className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
                Address
              </FrameTitle>
            </FrameHeader>
            <FramePanel>
              {addressLines.length > 0 ? (
                <address className="space-y-0.5 text-sm not-italic">
                  {addressLines.map((line, index) => (
                    <div
                      key={line}
                      className={
                        index === 0 ? "font-medium" : "text-muted-foreground"
                      }
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
            </FramePanel>
          </Frame>

          <div className="grid gap-1.5 sm:grid-cols-2">
            <Frame stacked dense spacing="sm" className="w-full">
              <FrameHeader>
                <FrameTitle className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
                  Customer ID
                </FrameTitle>
              </FrameHeader>
              <FramePanel>
                <p className="break-all font-mono text-xs">{invoice.customerId}</p>
              </FramePanel>
            </Frame>
            <Frame stacked dense spacing="sm" className="w-full">
              <FrameHeader>
                <FrameTitle className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
                  Subscription ID
                </FrameTitle>
              </FrameHeader>
              <FramePanel>
                <p className="break-all font-mono text-xs">
                  {invoice.subscriptionId ?? "—"}
                </p>
              </FramePanel>
            </Frame>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingInvoiceDetail;
