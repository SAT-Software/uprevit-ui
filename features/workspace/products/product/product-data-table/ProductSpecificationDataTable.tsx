"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

const COLUMN_COUNT = 150;
const ROW_COUNT = 5000;
const COL_WIDTH = 120;
const ROW_HEIGHT = 34;
const ROW_NUMBER_WIDTH = 50;

function getColumnName(index: number): string {
  let name = "";
  let i = index;
  while (i >= 0) {
    name = String.fromCharCode((i % 26) + 65) + name;
    i = Math.floor(i / 26) - 1;
  }
  return name;
}

export function ProductSpecificationDataTable() {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const atLeft = el.scrollLeft === 0;
      const atRight = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      const scrollingLeft = e.deltaX < 0;
      const scrollingRight = e.deltaX > 0;

      if ((atLeft && scrollingLeft) || (atRight && scrollingRight)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: ROW_COUNT,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const colVirtualizer = useVirtualizer({
    count: COLUMN_COUNT,
    getScrollElement: () => parentRef.current,
    estimateSize: () => COL_WIDTH,
    horizontal: true,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="flex-1 min-h-0 overflow-auto overscroll-contain"
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize() + ROW_HEIGHT,
          width: colVirtualizer.getTotalSize() + ROW_NUMBER_WIDTH,
          position: "relative",
        }}
      >
        <div
          className="sticky top-0 z-20 bg-muted flex"
          style={{ height: ROW_HEIGHT }}
        >
          <div
            className="sticky left-0 z-30 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
            style={{
              width: ROW_NUMBER_WIDTH,
              height: ROW_HEIGHT,
              minWidth: ROW_NUMBER_WIDTH,
            }}
          ></div>

          <div
            className="relative"
            style={{ width: colVirtualizer.getTotalSize(), height: ROW_HEIGHT }}
          >
            {colVirtualizer.getVirtualItems().map((col) => (
              <div
                key={col.key}
                className="border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted"
                style={{
                  position: "absolute",
                  left: col.start,
                  width: col.size,
                  height: ROW_HEIGHT,
                }}
              >
                {getColumnName(col.index)}
              </div>
            ))}
          </div>
        </div>

        {rowVirtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            className="flex"
            style={{
              position: "absolute",
              top: row.start + ROW_HEIGHT,
              height: row.size,
              width: colVirtualizer.getTotalSize() + ROW_NUMBER_WIDTH,
            }}
          >
            <div
              className="sticky left-0 z-10 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
              style={{
                width: ROW_NUMBER_WIDTH,
                minWidth: ROW_NUMBER_WIDTH,
                height: row.size,
              }}
            >
              {row.index + 1}
            </div>

            <div
              className="relative"
              style={{ width: colVirtualizer.getTotalSize(), height: row.size }}
            >
              {colVirtualizer.getVirtualItems().map((col) => (
                <div
                  key={col.key}
                  className="border-r border-b border-border"
                  style={{
                    position: "absolute",
                    left: col.start,
                    width: col.size,
                    height: row.size,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
