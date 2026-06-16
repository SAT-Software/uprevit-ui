"use client";

import type { ComponentType } from "react";
import { Badge } from "@uprevit/ui/components/ui/badge";
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
import type { ChargebeeInvoice } from "@/types/billing";
import {
  PiCalendarDuotone,
  PiCoinsDuotone,
  PiInfoDuotone,
  PiMoneyDuotone,
  PiReceiptDuotone,
} from "react-icons/pi";

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

export function BillingInvoicesTable({
  invoices,
  onInvoiceClick,
}: {
  invoices: ChargebeeInvoice[];
  onInvoiceClick: (invoiceId: string) => void;
}) {
  return (
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
              onClick={() => onInvoiceClick(invoice.id)}
            >
              <TableCell className="py-3 font-mono text-xs">{invoice.id}</TableCell>
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
                {formatBillingMoney(invoice.amountDue, invoice.currencyCode)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
