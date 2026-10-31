"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { AnalyticsBlockingTabsChart } from "@/features/workspace/analytics/AnalyticsBlockingTabsChart";
import { AnalyticsCreatedReleasedChart } from "@/features/workspace/analytics/AnalyticsCreatedReleasedChart";
import { AnalyticsDepartmentsChart } from "@/features/workspace/analytics/AnalyticsDepartmentsChart";
import { AnalyticsDueCalendarChart } from "@/features/workspace/analytics/AnalyticsDueCalendarChart";
import { AnalyticsFilterBar } from "@/features/workspace/analytics/AnalyticsFilterBar";
import { AnalyticsPendingApprovalsChart } from "@/features/workspace/analytics/AnalyticsPendingApprovalsChart";
import { AnalyticsPipelineChart } from "@/features/workspace/analytics/AnalyticsPipelineChart";
import { AnalyticsStatsGrid } from "@/features/workspace/analytics/AnalyticsStatsGrid";
import {
  analyticsSearchParams,
  useGetAnalytics,
} from "@/hooks/analytics/useGetAnalytics";
import type { AnalyticsFilters } from "@/types/analytics";

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters: AnalyticsFilters = {
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    departmentId: searchParams.get("departmentId") ?? undefined,
    projectId: searchParams.get("projectId") ?? undefined,
  };
  const { data, isLoading, isError } = useGetAnalytics(filters);

  const setFilters = (next: AnalyticsFilters) => {
    const query = analyticsSearchParams(next).toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-10 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Analytics</p>
          <InfoTooltip content="See where products are in the pipeline, what is due, what is blocking submission and who reviews are waiting on. Click any chart to list the products behind it." />
        </div>
        <AnalyticsFilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isError ? (
          <p className="p-6 text-sm text-muted-foreground">
            Analytics could not be loaded. Refresh the page to try again.
          </p>
        ) : (
          <>
            <AnalyticsStatsGrid
              tiles={data?.tiles}
              filters={filters}
              isLoading={isLoading}
            />
            <div className="flex flex-col gap-2 p-2">
              <AnalyticsPipelineChart
                data={data?.pipeline}
                filters={filters}
                isLoading={isLoading}
              />
              <AnalyticsDueCalendarChart
                data={data?.due_calendar}
                filters={filters}
                isLoading={isLoading}
              />
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <AnalyticsCreatedReleasedChart
                    data={data?.created_vs_released}
                    filters={filters}
                    isLoading={isLoading}
                  />
                </div>
                <AnalyticsBlockingTabsChart
                  data={data?.incomplete_tabs}
                  draftCount={data?.draft_count}
                  filters={filters}
                  isLoading={isLoading}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <AnalyticsDepartmentsChart
                    data={data?.departments}
                    isLoading={isLoading}
                  />
                </div>
                <AnalyticsPendingApprovalsChart
                  data={data?.pending_by_approver}
                  filters={filters}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
