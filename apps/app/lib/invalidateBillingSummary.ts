import type { QueryClient } from "@tanstack/react-query";

export const BILLING_SUMMARY_QUERY_KEY = ["billing", "summary"] as const;

export function invalidateBillingSummary(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: BILLING_SUMMARY_QUERY_KEY });
}
