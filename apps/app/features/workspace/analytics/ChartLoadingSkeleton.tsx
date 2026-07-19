"use client";

import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";

const AREA_CHART_BARS = [32, 48, 36, 56, 44, 64, 40, 52, 38, 60, 46, 54];

export function AreaChartLoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex h-[250px] flex-col px-2 pb-2", className)}>
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="flex w-8 shrink-0 flex-col justify-between py-1">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-3 w-6" />
          ))}
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col justify-end rounded-lg border border-border/50 bg-muted/10 p-3">
          <div className="flex h-full items-end gap-1.5">
            {AREA_CHART_BARS.map((height, index) => (
              <Skeleton
                key={index}
                className="flex-1 rounded-t-sm"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-between pl-11 pr-2">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-3 w-10" />
        ))}
      </div>
    </div>
  );
}

export function BarChartLoadingSkeleton({ className }: { className?: string }) {
  const barWidths = [88, 72, 58, 44, 32];

  return (
    <div
      className={cn(
        "flex h-[250px] flex-col justify-center gap-4 px-4 py-2",
        className,
      )}
    >
      {barWidths.map((width, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-7 rounded-md" style={{ width: `${width}%` }} />
          <Skeleton className="h-4 w-6 shrink-0" />
        </div>
      ))}
    </div>
  );
}
