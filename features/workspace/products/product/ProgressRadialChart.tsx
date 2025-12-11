"use client";

import { cn } from "@/lib/utils";

const PROGRESS_STATES = [
  {
    min: 100,
    label: "Ready to submit",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
    bar: "from-emerald-400 via-emerald-500 to-emerald-600",
  },
  {
    min: 70,
    label: "On track",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-300",
    bar: "from-sky-400 via-sky-500 to-sky-600",
  },
  {
    min: 40,
    label: "In progress",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
    bar: "from-amber-400 via-amber-500 to-amber-600",
  },
  {
    min: 0,
    label: "Getting started",
    dot: "bg-slate-400",
    text: "text-slate-600 dark:text-slate-300",
    bar: "from-slate-400 via-slate-500 to-slate-600",
  },
] as const;

// State for when product is already submitted
const SUBMITTED_STATE = {
  min: 100,
  label: "Submitted",
  dot: "bg-violet-500",
  text: "text-violet-600 dark:text-violet-300",
  bar: "from-violet-400 via-violet-500 to-violet-600",
} as const;

const getProgressState = (value: number) => {
  for (const state of PROGRESS_STATES) {
    if (value >= state.min) return state;
  }
  return PROGRESS_STATES[PROGRESS_STATES.length - 1];
};

interface ProgressRadialChartProps {
  completionPercentage: number;
  completedTabsCount: number;
  totalTabs: number;
  productStatus?: string;
}

export function ProgressRadialChart({
  completionPercentage,
  completedTabsCount,
  totalTabs,
  productStatus,
}: ProgressRadialChartProps) {
  const clampedPercentage = Math.max(
    0,
    Math.min(100, Math.round(completionPercentage || 0))
  );

  // Use submitted state if product is submitted, otherwise determine based on percentage
  const progressState =
    productStatus === "submitted"
      ? SUBMITTED_STATE
      : getProgressState(clampedPercentage);

  return (
    <div className="flex items-center gap-4 py-1 px-2 rounded-lg border bg-accent">
      <div className="flex flex-col justify-center leading-tight">
        {/* <span className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
          Progress
        </span> */}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-foreground">
            {clampedPercentage}
          </span>
          <span className="text-[0.65rem] font-medium text-muted-foreground">
            %
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div className="flex items-center gap-4 justify-between text-[0.7rem] font-medium leading-none">
          <span
            className={cn(
              "flex items-center gap-1 text-muted-foreground",
              progressState.text
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full", progressState.dot)}
            />
            {progressState.label}
          </span>
          <span className="text-[0.65rem] text-muted-foreground">
            {completedTabsCount}/{totalTabs} tabs
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full bg-linear-to-r transition-[width] duration-300 ease-out z-55",
              progressState.bar
            )}
            style={{ width: `${clampedPercentage}%` }}
          />
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-border transition-[width] duration-300 ease-out z-40"
            style={{ width: `${100}%` }}
          ></span>
        </div>
      </div>
    </div>
  );
}
