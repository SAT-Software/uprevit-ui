"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@uprevit/ui/lib/utils";
import { EChartsHeatmapChart } from "@/components/evilcharts/charts/echarts-heatmap-chart";
import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { AnalyticsDrillLinks } from "@/features/workspace/analytics/AnalyticsDrillLinks";
import { analyticsDrillHref } from "@/features/workspace/analytics/analyticsLinks";
import type { AnalyticsData, AnalyticsFilters } from "@/types/analytics";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";

const DAY_MS = 24 * 60 * 60 * 1000;
const LABEL_SPACE = 36;
const MONTH_SPACE = 26;
const MIN_CELL = 10;
const MAX_CELL = 40;
const DEFAULT_PERIOD_DAYS = 90;
const WEEKS_AHEAD = 8;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COMPACT_DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const toIsoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

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

function LegendSwatches({
  label,
  colors,
}: {
  label: string;
  colors: { light: string[]; dark: string[] };
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {colors.light.map((color, index) => (
          <span
            key={color}
            className="size-2 rounded-[2px] bg-(--swatch-light) dark:bg-(--swatch-dark)"
            style={
              {
                "--swatch-light": color,
                "--swatch-dark": colors.dark[index],
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      {label}
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

  const now = Date.now();
  const filterFrom = filters.from?.match(ISO_DAY) ? filters.from : undefined;
  const from = calendarStart(
    data?.from ?? filterFrom ?? toIsoDay(now - DEFAULT_PERIOD_DAYS * DAY_MS),
  );
  const to = data?.to ?? toIsoDay(now + (WEEKS_AHEAD * 7 - 1) * DAY_MS);
  const weeks =
    Math.ceil(
      (new Date(to).getTime() - new Date(from).getTime()) / DAY_MS / 7,
    ) + 1;
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
    >
      <div
        className={cn(
          "flex items-center gap-4 px-4 pt-3 text-xs",
          isLoading && "invisible",
        )}
      >
        <LegendSwatches label="Overdue" colors={RAMPS.overdue} />
        <LegendSwatches label="Due" colors={RAMPS.due} />
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-[2px] bg-muted-foreground/50" />
          Today
        </div>
      </div>
      <div className="flex min-h-40 flex-1 flex-col justify-center p-3">
        <div ref={containerRef} className="overflow-x-auto">
          <div
            style={{
              height: cellSize * 7 + MONTH_SPACE,
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
              range={[from, to]}
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
                labels={cellSize < 16 ? COMPACT_DAY_LABELS : DAY_LABELS}
              />
              <EChartsHeatmapChart.Tooltip
                valueFormatter={(value) =>
                  `${value} ${value === 1 ? "product" : "products"}`
                }
              />
            </EChartsHeatmapChart>
          </div>
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
