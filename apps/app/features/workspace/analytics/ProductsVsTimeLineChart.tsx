"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { AreaChartLoadingSkeleton } from "@/features/workspace/analytics/ChartLoadingSkeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@uprevit/ui/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

interface TimeData {
  date: string;
  products: number;
}

interface Department {
  _id?: string;
  department_name: string;
}

interface Project {
  _id?: string;
  project_name: string;
}

interface ProductsOverTimeChartProps {
  data: TimeData[];
  departments?: Department[];
  projects?: Project[];
  isLoading?: boolean;
}

const chartConfig = {
  products: {
    label: "Products",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

const TIME_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "15d", label: "Last 15 days" },
  { value: "20d", label: "Last 20 days" },
  { value: "30d", label: "Last 1 month" },
  { value: "90d", label: "Last 3 months" },
  { value: "180d", label: "Last 6 months" },
  { value: "270d", label: "Last 9 months" },
  { value: "365d", label: "Last 1 year" },
];

function TimeRangeSelect({
  timeRange,
  onTimeRangeChange,
}: {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}) {
  return (
    <Select value={timeRange} onValueChange={onTimeRangeChange}>
      <SelectTrigger
        className="h-7 w-[160px] shrink-0 rounded-lg"
        aria-label="Select time range"
      >
        <SelectValue placeholder="Last 1 month" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {TIME_RANGE_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ProductsOverTimeChart({
  data,
  isLoading,
}: ProductsOverTimeChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 30;

    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "15d") {
      daysToSubtract = 15;
    } else if (timeRange === "20d") {
      daysToSubtract = 20;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "180d") {
      daysToSubtract = 180;
    } else if (timeRange === "270d") {
      daysToSubtract = 270;
    } else if (timeRange === "365d") {
      daysToSubtract = 365;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const formatDate = (dateKey: string) => {
    const date = new Date(dateKey);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const headerActions = isLoading ? (
    <Skeleton className="h-7 w-[160px] shrink-0 rounded-lg" />
  ) : (
    <TimeRangeSelect timeRange={timeRange} onTimeRangeChange={setTimeRange} />
  );

  if (isLoading) {
    return (
      <AnalyticsChartPanel
        title="Products Over Time"
        info="Track product creation trends over time"
        headerActions={headerActions}
      >
        <div className="px-2 pb-4 pt-2">
          <AreaChartLoadingSkeleton />
        </div>
      </AnalyticsChartPanel>
    );
  }

  if (filteredData.length === 0) {
    return (
      <AnalyticsChartPanel
        title="Products Over Time"
        info="Track product creation trends over time"
        headerActions={headerActions}
      >
        <div className="flex min-h-[250px] items-center justify-center px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            No data available for this period
          </p>
        </div>
      </AnalyticsChartPanel>
    );
  }

  return (
    <AnalyticsChartPanel
      title="Products Over Time"
      info="Track product creation trends over time"
      headerActions={headerActions}
    >
      <div className="px-2 pb-4 pt-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] -ml-10 w-[calc(100%+40px)]"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProducts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-products)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-products)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              tickCount={5}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="products"
              type="natural"
              fill="url(#fillProducts)"
              stroke="var(--color-products)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </AnalyticsChartPanel>
  );
}
