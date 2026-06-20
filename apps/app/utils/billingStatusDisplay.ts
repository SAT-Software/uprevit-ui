import type { BillingAccountStatus } from "@/types/billing";

export function formatBillingStatusLabel(
  status: BillingAccountStatus | "not_set",
): string {
  if (status === "not_set") return "Not set";
  return status.replace(/_/g, " ");
}

export function getBillingStatusLabel(
  status: BillingAccountStatus | "not_set",
  pastDue?: boolean | null,
): string {
  if (pastDue || status === "past_due") return "Past due";
  return formatBillingStatusLabel(status);
}

export function billingAccountStatusVariant(
  status: BillingAccountStatus | "not_set",
  pastDue?: boolean | null,
): "default" | "secondary" | "destructive" | "outline" {
  if (pastDue || status === "past_due") return "destructive";
  if (status === "active") return "default";
  if (status === "cancelled") return "secondary";
  if (status === "not_set") return "outline";
  return "secondary";
}

export function formatSubscriptionStatusLabel(
  status: string | null | undefined,
  accountStatus?: BillingAccountStatus,
): string {
  if (!status) return "—";
  if (status === "future" && accountStatus === "active") return "Active";
  if (status === "non_renewing" && accountStatus === "active") return "Active";
  return status.replace(/_/g, " ");
}
