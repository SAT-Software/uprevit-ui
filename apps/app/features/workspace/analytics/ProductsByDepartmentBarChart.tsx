"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { AnalyticsChartPanel } from "@/features/workspace/analytics/AnalyticsChartPanel";
import { BarChartLoadingSkeleton } from "@/features/workspace/analytics/ChartLoadingSkeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@uprevit/ui/components/ui/chart";

interface DepartmentData {
  department: string;
  products: number;
}

interface ProductsByDepartmentChartProps {
  data: DepartmentData[];
  isLoading?: boolean;
}

const chartConfig = {
  products: {
    label: "Products",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ProductsByDepartmentChart({
  data,
  isLoading,
}: ProductsByDepartmentChartProps) {
  if (isLoading) {
    return (
      <AnalyticsChartPanel
        title="Products by Department"
        info="Distribution of products across departments in your workspace"
      >
        <div className="p-4 pt-2">
          <BarChartLoadingSkeleton />
        </div>
      </AnalyticsChartPanel>
    );
  }

  if (data.length === 0) {
    return (
      <AnalyticsChartPanel
        title="Products by Department"
        info="Distribution of products across departments in your workspace"
      >
        <div className="flex min-h-[250px] items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      </AnalyticsChartPanel>
    );
  }

  const displayData = data.slice(0, 5);

  return (
    <AnalyticsChartPanel
      title="Products by Department"
      info="Distribution of products across departments in your workspace"
    >
      <div className="p-4 pt-2">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={displayData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="products" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="products"
              layout="vertical"
              fill="var(--color-products)"
              radius={12}
            >
              <LabelList
                dataKey="department"
                position="insideLeft"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="products"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </AnalyticsChartPanel>
  );
}
