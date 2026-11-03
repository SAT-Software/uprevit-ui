"use client";

import { useRouter } from "next/navigation";
import { EChartsAreaChart } from "@/components/evilcharts/charts/echarts-area-chart";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { AnalyticsDrillLinks } from "@/features/workspace/analytics/AnalyticsDrillLinks";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";

const config = {
  created: { label: "Created", colors: { light: ["#3b82f6"], dark: ["#60a5fa"] } },
  released: {
    label: "Released",
    colors: { light: ["#22c55e"], dark: ["#4ade80"] },
  },
};

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

export function AnalyticsCreatedReleasedChart({
  data = [],
  filters,
  isLoading,
}: {
  data?: AnalyticsData["created_vs_released"];
  filters: AnalyticsFilters;
  isLoading: boolean;
}) {
  const router = useRouter();

  return (
    <AnalyticsChartPanel
      title="Created vs released"
      info="Products created and versions released each month. Click a month to list the products in the nearer series."
    >
      <EChartsAreaChart
        className="min-h-72 w-full flex-1 p-3"
        data={data}
        config={config}
        xDataKey="month"
        curveType="monotone"
        isLoading={isLoading}
        onItemClick={({ index, value }) => {
          const row = data[index];
          if (!row) return;
          const metric =
            Math.abs(row.created - value) <= Math.abs(row.released - value)
              ? "created"
              : "released";
          router.push(analyticsDrillHref(filters, metric, row.month));
        }}
      >
        <EChartsAreaChart.Area dataKey="created" variant="gradient">
          <EChartsAreaChart.Dot />
        </EChartsAreaChart.Area>
        <EChartsAreaChart.Area dataKey="released" variant="gradient">
          <EChartsAreaChart.Dot />
        </EChartsAreaChart.Area>
        <EChartsAreaChart.XAxis tickFormatter={monthLabel} />
        <EChartsAreaChart.YAxis />
        <EChartsAreaChart.Grid />
        <EChartsAreaChart.Tooltip />
        <EChartsAreaChart.Legend align="left" />
      </EChartsAreaChart>
      <AnalyticsDrillLinks
        label="Created vs released products by month"
        links={data.flatMap((row) =>
          (["created", "released"] as const)
            .filter((metric) => row[metric] > 0)
            .map((metric) => ({
              href: analyticsDrillHref(filters, metric, row.month),
              label: `${config[metric].label} ${monthLabel(row.month)} ${row.month.slice(0, 4)}: ${row[metric]}`,
            })),
        )}
      />
    </AnalyticsChartPanel>
  );
}
