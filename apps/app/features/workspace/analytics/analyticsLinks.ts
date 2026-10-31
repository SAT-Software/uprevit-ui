import { analyticsSearchParams } from "@/hooks/analytics/useGetAnalytics";
import type { AnalyticsFilters } from "@/types/analytics";

export function analyticsDrillHref(
  filters: AnalyticsFilters,
  metric: string,
  value?: string,
) {
  const params = analyticsSearchParams({ ...filters, ...(value && { value }) });
  const query = params.toString();
  return `/analytics/${metric}${query ? `?${query}` : ""}`;
}
