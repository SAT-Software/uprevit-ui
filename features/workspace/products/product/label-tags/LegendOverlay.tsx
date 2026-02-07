"use client";

import { LegendItem } from "./legendTypes";
import { LegendSwatch } from "./LegendSwatch";

type Props = {
  items: LegendItem[];
};

export function LegendOverlay({ items }: Props) {
  if (!items || items.length === 0) return null;

  const maxVisibleItems = 5;
  const visibleItems = items.slice(0, maxVisibleItems);
  const remainingCount = Math.max(items.length - maxVisibleItems, 0);

  return (
    <div
      className="absolute top-3 right-3 z-10 w-56 rounded-lg border border-border/80 bg-background/90 shadow-sm pointer-events-auto"
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-2.5 py-2">
        <span className="text-xs font-semibold text-foreground">Legend</span>
      </div>
      <div className="space-y-1 p-2">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground"
          >
            <LegendSwatch item={item} size={18} />
            <span className="truncate text-foreground/90">{item.text}</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="rounded-md bg-muted/60 px-1.5 py-1 text-[11px] text-muted-foreground">
            +{remainingCount} more legend{remainingCount > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
