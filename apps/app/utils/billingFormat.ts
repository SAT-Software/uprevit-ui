export function formatBillingMoney(
  amount: number,
  currencyCode: string | null | undefined,
): string {
  const currency = currencyCode ?? "USD";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function invoiceStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "paid") return "default";
  if (status === "payment_due" || status === "not_paid") return "destructive";
  return "secondary";
}
