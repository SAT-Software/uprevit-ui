"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EChartsHeatmapChart } from "@/components/evilcharts/charts/echarts-heatmap-chart";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { AnalyticsDrillLinks } from "@/features/workspace/analytics/AnalyticsDrillLinks";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";

const DAY_MS = 24 * 60 * 60 * 1000;
const LABEL_SPACE = 36;
const MIN_CELL = 10;
const MAX_CELL = 40;

function calendarStart(from: string) {
  const date = new Date(`${from}T00:00:00Z`);
  const nextMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1),
  );
  return nextMonth.getTime() - date.getTime() < 7 * DAY_MS
    ? from.slice(0, 8) + "01"
    : from;
}

const RAMPS = {
  due: {
    light: ["#a5b4fc", "#6366f1", "#4338ca"],
    dark: ["#3730a3", "#6366f1", "#a5b4fc"],
  },
  overdue: {
    light: ["#fca5a5", "#f87171", "#dc2626"],
    dark: ["#991b1b", "#ef4444", "#fca5a5"],
  },
};

const config = {
  due: { label: "Due", colors: RAMPS.due },
  overdue: { label: "Overdue", colors: RAMPS.overdue },
};

function LegendRamp({ label, colors }: { label: string; colors: typeof RAMPS.due }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        {colors.light.map((color, index) => (
          <span
            key={color}
            className="size-3 rounded-[3px] bg-(--swatch-light) dark:bg-(--swatch-dark)"
            style={
              {
                "--swatch-light": color,
                "--swatch-dark": colors.dark[index],
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsDueCalendarChart({
  data,
  filters,
  isLoading,
}: {
  data?: AnalyticsData["due_calendar"];
  filters: AnalyticsFilters;
  isLoading: boolean;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const from = data && calendarStart(data.from);
  const weeks = data && from
    ? Math.ceil(
        (new Date(data.to).getTime() - new Date(from).getTime()) /
          DAY_MS /
          7,
      ) + 1
    : 13;
  const cellSize = Math.min(
    MAX_CELL,
    Math.max(MIN_CELL, Math.floor((width - LABEL_SPACE) / weeks)),
  );
  const cellGap = cellSize >= 20 ? 4 : 3;

  useEffect(() => {
    const element = containerRef.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, [cellSize, weeks]);

  return (
    <AnalyticsChartPanel
      title="Due-date calendar"
      info="Unreleased products by target date, from the start of the selected period to 8 weeks ahead. Days before today are overdue. Click a day to list its products."
      headerActions={
        <div className="flex items-center gap-4">
          <LegendRamp label="Overdue" colors={RAMPS.overdue} />
          <LegendRamp label="Due" colors={RAMPS.due} />
        </div>
      }
    >
      <div ref={containerRef} className="overflow-x-auto p-3">
        <div
          style={{
            height: cellSize * 7 + 54,
            width: Math.max(width, weeks * cellSize + LABEL_SPACE),
          }}
        >
        <EChartsHeatmapChart
          className="h-full w-full"
          cellSize={cellSize}
          data={(data?.days ?? []).map(({ date, count }) => ({
            date,
            value: count,
          }))}
          config={config}
          range={data && from ? [from, data.to] : undefined}
          weekStart="monday"
          isLoading={isLoading}
          onSelectionChange={(selection) =>
            selection &&
            router.push(analyticsDrillHref(filters, "due", selection.date))
          }
        >
          <EChartsHeatmapChart.Cell
            dataKey="due"
            pastDataKey="overdue"
            splitDate={data?.today}
            radius={Math.min(6, Math.round(cellSize / 5))}
            gap={cellGap}
            isClickable
          />
          <EChartsHeatmapChart.MonthLabel />
          <EChartsHeatmapChart.DayLabel
            labels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          />
          <EChartsHeatmapChart.Tooltip
            valueFormatter={(value) =>
              `${value} ${value === 1 ? "product" : "products"}`
            }
          />
        </EChartsHeatmapChart>
        </div>
      </div>
      <AnalyticsDrillLinks
        label="Products due by day"
        links={(data?.days ?? [])
          .filter((day) => day.count > 0)
          .map((day) => ({
            href: analyticsDrillHref(filters, "due", day.date),
            label: `${day.date < (data?.today ?? "") ? "Overdue" : "Due"} ${formatToLocalDate(`${day.date}T00:00:00`)}: ${day.count}`,
          }))}
      />
    </AnalyticsChartPanel>
  );
}
