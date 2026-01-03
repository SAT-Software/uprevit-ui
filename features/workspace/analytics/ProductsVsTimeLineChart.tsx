"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeData {
  date: string; // Format: YYYY-MM-DD
  products: number;
}

interface Department {
  _id: string;
  department_name: string;
}

interface Project {
  _id: string;
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

// Time range options
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

  if (isLoading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b p-4 sm:flex-row">
          <div className="grid flex-1 gap-0">
            <CardTitle className="text-base">Products Over Time</CardTitle>
            <CardDescription>
              Track product creation trends over time
            </CardDescription>
          </div>
          <div className="h-9 w-[160px] bg-muted animate-pulse rounded-lg" />
        </CardHeader>
        <CardContent className="px-2 pt-2 pb-0">
          <div className="h-[250px] relative overflow-hidden">
            {/* Area chart skeleton with wavy gradient */}
            <svg
              className="w-full h-full animate-pulse"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="skeletonGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--muted))"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--muted))"
                    stopOpacity="0.1"
                  />
                </linearGradient>
              </defs>
              <path
                d="M0,180 L0,120 C40,100 60,140 100,110 C140,80 160,130 200,90 C240,50 260,100 300,70 C340,40 360,80 400,60 L400,180 Z"
                fill="url(#skeletonGradient)"
              />
              <path
                d="M0,120 C40,100 60,140 100,110 C140,80 160,130 200,90 C240,50 260,100 300,70 C340,40 360,80 400,60"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
            </svg>
            {/* X-axis labels skeleton */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-10 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-base">Products Over Time</CardTitle>
            <CardDescription>Track product creation trends</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
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
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[250px]">
          <p className="text-sm text-muted-foreground">
            No data available for this period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b p-4 sm:flex-row">
        <div className="grid flex-1 gap-0">
          <CardTitle className="text-base">Products Over Time</CardTitle>
          <CardDescription>
            Track product creation trends over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg"
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
      </CardHeader>
      <CardContent className="px-2 pt-2 pb-0">
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
      </CardContent>
    </Card>
  );
}
