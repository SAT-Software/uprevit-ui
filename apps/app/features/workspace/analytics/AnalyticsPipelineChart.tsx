"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { EChartsBarChart } from "@/components/evilcharts/charts/echarts-bar-chart";
import { PIPELINE_STATUSES, STAGE_CHART_CONFIG } from "@/data/analytics-config";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";

export function AnalyticsPipelineChart({
  data,
  filters,
  isLoading,
}: {
  data?: AnalyticsData["pipeline"];
  filters: AnalyticsFilters;
  isLoading: boolean;
}) {
  const router = useRouter();

  return (
    <AnalyticsChartPanel
      title="Pipeline by stage"
      info="Where every active product sits right now. Click a stage to list its products."
    >
      {isLoading ? (
        <div className="flex h-36 w-full flex-col justify-center px-5 pt-6">
          <span role="status" className="sr-only">
            Loading…
          </span>
          <Skeleton aria-hidden="true" className="h-10 w-full rounded" />
        </div>
      ) : (
      <EChartsBarChart
        className="h-36 w-full p-3"
        data={[{ stage: "Products", ...data }]}
        config={STAGE_CHART_CONFIG}
        xDataKey="stage"
        layout="horizontal"
        stackType="stacked"
        barRadius={4}
        onItemClick={({ key }) =>
          router.push(analyticsDrillHref(filters, "status", key))
        }
      >
        {PIPELINE_STATUSES.map((status) => (
          <EChartsBarChart.Bar key={status} dataKey={status} isClickable />
        ))}
        <EChartsBarChart.XAxis />
        <EChartsBarChart.Tooltip />
        <EChartsBarChart.Legend align="left" />
      </EChartsBarChart>
      )}
    </AnalyticsChartPanel>
  );
}
