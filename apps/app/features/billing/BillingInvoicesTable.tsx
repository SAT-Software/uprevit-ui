"use client";

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

export function BillingInvoicesTable({
  invoices,
  onInvoiceClick,
}: {
  invoices: ChargebeeInvoice[];
  onInvoiceClick: (invoiceId: string) => void;
}) {
  return (
    <div className="w-full overflow-hidden border-b border-border">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-muted">
          <TableRow className="h-10 hover:bg-transparent">
            <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
              Invoice
            </TableHead>
            <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
              Date
            </TableHead>
            <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
              Status
            </TableHead>
            <TableHead className="h-10 border-r border-border text-right text-xs font-medium text-muted-foreground/60 last:border-r-0">
              Total
            </TableHead>
            <TableHead className="h-10 text-right text-xs font-medium text-muted-foreground/60">
              Due
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onInvoiceClick(invoice.id)}
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
                {formatBillingMoney(invoice.amountDue, invoice.currencyCode)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
