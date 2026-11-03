"use client";

import { NewOfficeIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EChartsBarChart } from "@/components/evilcharts/charts/echarts-bar-chart";
import { PIPELINE_STATUSES, STAGE_CHART_CONFIG } from "@/data/analytics-config";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { AnalyticsShowMore } from "@/features/workspace/analytics/AnalyticsShowMore";
import type { AnalyticsData } from "@/types/analytics";

const PAGE_SIZE = 10;

export function AnalyticsDepartmentsChart({
  data = [],
  isLoading,
}: {
  data?: AnalyticsData["departments"];
  isLoading: boolean;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const rows = data.slice(0, visible);

  return (
    <AnalyticsChartPanel
      title="Departments by stage"
      info="Active products in each department, split by stage. Click a department to open it."
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
        <EmptyState
          embedded
          icon={NewOfficeIcon}
          title="No products in any department yet"
        />
      ) : (
        <div style={{ height: Math.max(rows.length, 3) * 40 + 70 }}>
        <EChartsBarChart
          className="h-full w-full p-3"
          data={rows}
          config={STAGE_CHART_CONFIG}
          xDataKey="name"
          layout="horizontal"
          stackType="stacked"
          barRadius={4}
          isLoading={isLoading}
          onItemClick={({ index }) =>
            rows[index] &&
            router.push(`/departments/${rows[index].department_id}`)
          }
        >
          {PIPELINE_STATUSES.map((status) => (
            <EChartsBarChart.Bar key={status} dataKey={status} isClickable />
          ))}
          <EChartsBarChart.YAxis />
          <EChartsBarChart.XAxis />
          <EChartsBarChart.Grid />
          <EChartsBarChart.Tooltip />
          <EChartsBarChart.Legend align="left" />
        </EChartsBarChart>
        </div>
      )}
    </AnalyticsChartPanel>
  );
}
