"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EChartsBarChart } from "@/components/evilcharts/charts/echarts-bar-chart";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { AnalyticsEmptyState } from "@/features/workspace/analytics/AnalyticsEmptyState";
import { AnalyticsShowMore } from "@/features/workspace/analytics/AnalyticsShowMore";
import { AnalyticsDrillLinks } from "@/features/workspace/analytics/AnalyticsDrillLinks";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";

const PAGE_SIZE = 6;

const config = {
  count: { label: "Pending", colors: { light: ["#f59e0b"], dark: ["#fbbf24"] } },
};

export function AnalyticsPendingApprovalsChart({
  data = [],
  filters,
  isLoading,
}: {
  data?: AnalyticsData["pending_by_approver"];
  filters: AnalyticsFilters;
  isLoading: boolean;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const rows = data.slice(0, visible);

  return (
    <AnalyticsChartPanel
      title="Pending approvals"
      info="Products waiting on each approver in active reviews. Click an approver to list those products."
      footer={
        <AnalyticsShowMore
          total={data.length}
          visible={visible}
          step={PAGE_SIZE}
          onChange={setVisible}
        />
      }
    >
      {!isLoading && !rows.length ? (
        <AnalyticsEmptyState message="No reviews are waiting on anyone." />
      ) : (
        <div style={{ height: Math.max(rows.length, 2) * 44 + 60 }}>
        <EChartsBarChart
          className="h-full w-full p-3"
          data={rows}
          config={config}
          xDataKey="name"
          layout="horizontal"
          barRadius={4}
          isLoading={isLoading}
          onItemClick={({ index }) =>
            rows[index] &&
            router.push(
              analyticsDrillHref(filters, "approver", rows[index].user_id),
            )
          }
        >
          <EChartsBarChart.Bar dataKey="count" isClickable />
          <EChartsBarChart.YAxis />
          <EChartsBarChart.XAxis />
          <EChartsBarChart.Grid />
          <EChartsBarChart.Tooltip />
        </EChartsBarChart>
        </div>
      )}
      <AnalyticsDrillLinks
        label="Pending approvals by approver"
        links={rows.map((row) => ({
          href: analyticsDrillHref(filters, "approver", row.user_id),
          label: `${row.name}: ${row.count}`,
        }))}
      />
    </AnalyticsChartPanel>
  );
}
