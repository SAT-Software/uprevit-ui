"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with text";

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ProgressRadialChart({
  completionPercentage,
}: {
  completionPercentage: number;
}) {
  const radius = (completionPercentage / 100) * 360;

  return (
    <div className="w-12 h-12">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-12"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={radius}
          innerRadius={17}
          outerRadius={24}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-border/60 last:fill-accent"
            polarRadius={[18, 16]}
          />
          <RadialBar dataKey="visitors" background cornerRadius={4} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xs font-normal"
                      >
                        {completionPercentage}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
