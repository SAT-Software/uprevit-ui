"use client";

import type { ComponentType } from "react";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { Progress } from "@uprevit/ui/components/ui/progress";
import { cn } from "@uprevit/ui/lib/utils";

export function UsageMetricCard({
  label,
  icon: Icon,
  used,
  included,
  unit,
  usedValue,
  limitValue,
  secondaryUsed,
  isOverLimit,
  isAtLimit,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  used: number | string;
  included: number;
  unit: string;
  usedValue?: number;
  limitValue?: number;
  secondaryUsed?: string;
  isOverLimit?: boolean;
  isAtLimit?: boolean;
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
    <Card className="shadow-none">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-muted p-2 shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Badge variant={exceeded ? "destructive" : "secondary"}>
              {typeof used === "number" ? used.toLocaleString() : used} /{" "}
              {included.toLocaleString()} {unit}
            </Badge>
          </div>
          <Progress
            value={percent}
            className={cn(exceeded && "[&>div]:bg-destructive")}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          {overLimit ? (
            <span className="text-destructive">Over usage limit</span>
          ) : atLimit ? (
            <span className="text-destructive">At usage limit</span>
          ) : (
            <span className="text-muted-foreground">Within usage limit</span>
          )}
          <span className="text-muted-foreground">
            {secondaryUsed ? `${secondaryUsed} · ${percent}%` : `${percent}%`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
