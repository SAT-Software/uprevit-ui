"use client";

import { Button } from "@uprevit/ui/components/ui/button";

export function AnalyticsShowMore({
  total,
  visible,
  step,
  onChange,
}: {
  total: number;
  visible: number;
  step: number;
  onChange: (visible: number) => void;
}) {
  if (total <= step) return null;

  return (
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border px-3 py-2">
      <span className="text-xs tabular-nums text-muted-foreground">
        Showing {Math.min(visible, total)} of {total}
      </span>
      <div className="flex gap-2">
        {visible < total ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange(visible + step)}
            >
              Show {Math.min(step, total - visible)} more
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onChange(total)}>
              Show all
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onChange(step)}>
            Show fewer
          </Button>
        )}
      </div>
    </div>
  );
}
