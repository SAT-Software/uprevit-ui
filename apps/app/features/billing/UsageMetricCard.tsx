"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";

const SEGMENT_COUNT = 30;

function SegmentedProgressBar({
  percent,
  colorClass,
  overLimit,
}: {
  percent: number;
  colorClass: string;
  overLimit?: boolean;
}) {
  const barToHighlight = Math.ceil((SEGMENT_COUNT * percent) / 100);
  const activeColorClass = overLimit
    ? "from-red-400 via-red-500 to-red-600"
    : colorClass;

  return (
    <div className="flex h-5 items-stretch gap-1">
      {Array.from({ length: SEGMENT_COUNT }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "min-w-0 flex-1 rounded-lg",
            index < barToHighlight
              ? `bg-linear-to-r ${activeColorClass}`
              : "bg-accent",
          )}
        />
      ))}
    </div>
  );
}

export function UsageMetricCard({
  label,
  info,
  used,
  included,
  unit,
  usedValue,
  limitValue,
  secondaryUsed,
  isOverLimit,
  isAtLimit,
  colorClass,
}: {
  label: string;
  info?: string;
  used: number | string;
  included: number;
  unit: string;
  usedValue?: number;
  limitValue?: number;
  secondaryUsed?: string;
  isOverLimit?: boolean;
  isAtLimit?: boolean;
  colorClass: string;
}) {
  const numericUsed =
    usedValue ?? (typeof used === "number" ? used : Number(used));
  const numericLimit = limitValue ?? included;
  const overLimit =
    typeof isOverLimit === "boolean"
      ? isOverLimit
      : Number.isFinite(numericUsed) && numericUsed > numericLimit;
  const atLimit =
    typeof isAtLimit === "boolean"
      ? isAtLimit
      : !overLimit &&
        numericLimit > 0 &&
        Number.isFinite(numericUsed) &&
        numericUsed >= numericLimit;

  const exceeded = overLimit || atLimit;
  const percent =
    numericLimit > 0 && Number.isFinite(numericUsed)
      ? Math.min(100, Math.round((numericUsed / numericLimit) * 100))
      : 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border pl-3 pr-2">
        <p className="text-sm font-medium">{label}</p>
        {info ? <InfoTooltip content={info} /> : null}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-normal text-muted-foreground/60">
            {overLimit
              ? "Over usage limit"
              : atLimit
                ? "At usage limit"
                : "Within usage limit"}
          </p>
          <Badge variant={exceeded ? "destructive" : "outline"}>
            {typeof used === "number" ? used.toLocaleString() : used} /{" "}
            {included.toLocaleString()} {unit}
          </Badge>
        </div>

        <SegmentedProgressBar
          percent={percent}
          colorClass={colorClass}
          overLimit={overLimit}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{secondaryUsed ?? "Usage this period"}</span>
          <span className="font-medium text-foreground">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
