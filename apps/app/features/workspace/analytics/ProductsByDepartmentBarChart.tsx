"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
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
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

export function ProductsByDepartmentChart({
  data,
  isLoading,
}: ProductsByDepartmentChartProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col col-span-3">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Products by Department</CardTitle>
          <CardDescription>Distribution across departments</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="h-[250px] flex flex-col justify-around gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="h-10 bg-muted animate-pulse rounded"
                  style={{ width: `${70 - i * 10}%` }}
                />
                <div className="h-4 w-8 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="flex flex-col col-span-3">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Products by Department</CardTitle>
          <CardDescription>Distribution across departments</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 flex items-center justify-center min-h-[250px]">
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const displayData = data.slice(0, 5);

  return (
    <Card className="flex flex-col col-span-3">
      <CardHeader className="p-4">
        <CardTitle className="text-base">Products by Department</CardTitle>
        <CardDescription>Distribution across departments</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4">
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
              radius={4}
            >
              <LabelList
                dataKey="department"
                position="insideLeft"
                offset={8}
                className="fill-background"
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
      </CardContent>
    </Card>
  );
}
