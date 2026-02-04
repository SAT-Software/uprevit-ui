"use client";

import { LegendItem } from "./legendTypes";
import { LegendSwatch } from "./LegendSwatch";

type Props = {
  items: LegendItem[];
};

export function LegendOverlay({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div className="absolute top-3 right-3 z-10 w-56 rounded-lg border border-border/80 bg-background/90 shadow-sm backdrop-blur pointer-events-auto">
      <div className="flex items-center justify-between border-b border-border/70 px-2.5 py-2">
        <span className="text-xs font-semibold text-foreground">Legend</span>
      </div>
      <div className="max-h-40 space-y-1 overflow-y-auto p-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground"
          >
            <LegendSwatch item={item} size={18} />
            <span className="truncate text-foreground/90">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
