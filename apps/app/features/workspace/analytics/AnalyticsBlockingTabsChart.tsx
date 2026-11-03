"use client";

import { TaskDone01Icon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/EmptyState";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EChartsPieChart } from "@/components/evilcharts/charts/echarts-pie-chart";
import { TAB_COLORS, TAB_LABELS } from "@/data/analytics-config";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";

const config = Object.fromEntries(
  Object.entries(TAB_LABELS).map(([tab, label]) => [
    tab,
    {
      label,
      colors: {
        light: [TAB_COLORS[tab as keyof typeof TAB_COLORS][0]],
        dark: [TAB_COLORS[tab as keyof typeof TAB_COLORS][1]],
      },
    },
  ]),
);

export function AnalyticsBlockingTabsChart({
  data = [],
  draftCount = 0,
  filters,
  isLoading,
}: {
  data?: AnalyticsData["incomplete_tabs"];
  draftCount?: number;
  filters: AnalyticsFilters;
  isLoading: boolean;
}) {
  const router = useRouter();
  const sectors = data.filter((item) => item.count > 0);

  return (
    <AnalyticsChartPanel
      title="What blocks submission"
      info="How many drafts still have each tab incomplete. A draft can count under several tabs. Click a tab to list those drafts."
    >
      {!isLoading && !sectors.length ? (
        <EmptyState
          embedded
          icon={TaskDone01Icon}
          title="No drafts have incomplete tabs"
          className="min-h-60"
        />
      ) : (
        <div className="relative">
          <EChartsPieChart
            className="h-60 w-full p-3"
            data={sectors}
            config={config}
            dataKey="count"
            nameKey="tab"
            isLoading={isLoading}
            onSelectionChange={(selection) =>
              selection &&
              router.push(analyticsDrillHref(filters, "tab", selection.dataKey))
            }
          >
            <EChartsPieChart.Pie
              innerRadius="58%"
              outerRadius="82%"
              cornerRadius={4}
              paddingAngle={2}
              isClickable
            />
            <EChartsPieChart.Tooltip />
          </EChartsPieChart>
          {!isLoading && (
            <div className="pointer-events-none absolute inset-x-0 top-[calc(0.75rem+6.75rem)] flex -translate-y-1/2 flex-col items-center">
              <span className="text-2xl font-semibold tabular-nums">
                {draftCount}
              </span>
              <span className="text-xs text-muted-foreground">drafts</span>
            </div>
          )}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 pb-3 text-xs">
            {sectors.map((item) => (
              <li key={item.tab}>
                <Link
                  href={analyticsDrillHref(filters, "tab", item.tab)}
                  className="flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors duration-150 ease-out hover:bg-muted"
                >
                  <span
                    className="size-2 shrink-0 rounded-[2px] bg-(--swatch-light) dark:bg-(--swatch-dark)"
                    style={
                      {
                        "--swatch-light": TAB_COLORS[item.tab][0],
                        "--swatch-dark": TAB_COLORS[item.tab][1],
                      } as React.CSSProperties
                    }
                  />
                  <span className="truncate text-muted-foreground">
                    {TAB_LABELS[item.tab]}
                  </span>
                  <span className="ml-auto tabular-nums">{item.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AnalyticsChartPanel>
  );
}
