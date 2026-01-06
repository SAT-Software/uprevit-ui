"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [cellData, setCellData] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const rows: { rowIndex: number }[] = useMemo(() => {
    return Array.from({ length: ROW_COUNT }, (_, i) => ({
      rowIndex: i,
    }));
  }, []);

  const columns: ColumnDef<{ rowIndex: number }>[] = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }, (_, colIndex) => ({
      id: `col-${colIndex}`,
      header: () => getColumnName(colIndex),
      size: COL_WIDTH,
    }));
  }, []);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, rowIndex: number, colIndex: number) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      const pastedRows = text.split("\n").map((r) => r.split("\t"));
      setCellData((d) => {
        const updated = { ...d };
        pastedRows.forEach((cols, ri) => {
          cols.forEach((val, ci) => {
            updated[`${rowIndex + ri},${colIndex + ci}`] = val;
          });
        });
        return updated;
      });
    },
    []
  );

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

  const tableRows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const visibleColumns = table.getVisibleLeafColumns();

  const colVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => visibleColumns[index]?.getSize() ?? COL_WIDTH,
    horizontal: true,
    overscan: 5,
  });

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div
      ref={parentRef}
      className="flex-1 min-h-0 overflow-auto overscroll-contain"
    >
      <table
        style={{
          height: rowVirtualizer.getTotalSize() + ROW_HEIGHT,
          width: colVirtualizer.getTotalSize() + ROW_NUMBER_WIDTH,
          position: "relative",
        }}
      >
        <thead
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
          />

          <tr
            className="relative"
            style={{ width: colVirtualizer.getTotalSize(), height: ROW_HEIGHT }}
          >
            {colVirtualizer.getVirtualItems().map((virtualCol) => {
              const header = headerGroup?.headers[virtualCol.index];
              if (!header) return null;

              return (
                <div
                  key={header.id}
                  className="border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted"
                  style={{
                    position: "absolute",
                    left: virtualCol.start,
                    width: header.getSize(),
                    height: ROW_HEIGHT,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </div>
              );
            })}
          </tr>
        </thead>

        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = tableRows[virtualRow.index];
          if (!row) return null;
          const rowIndex = row.original.rowIndex;

          return (
            <tbody
              key={row.id}
              className="flex"
              style={{
                position: "absolute",
                top: virtualRow.start + ROW_HEIGHT,
                height: virtualRow.size,
                width: colVirtualizer.getTotalSize() + ROW_NUMBER_WIDTH,
              }}
            >
              <div
                className="sticky left-0 z-10 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
                style={{
                  width: ROW_NUMBER_WIDTH,
                  minWidth: ROW_NUMBER_WIDTH,
                  height: virtualRow.size,
                }}
              >
                {rowIndex + 1}
              </div>

              <tr
                className="relative"
                style={{
                  width: colVirtualizer.getTotalSize(),
                  height: virtualRow.size,
                }}
              >
                {colVirtualizer.getVirtualItems().map((virtualCol) => {
                  const colIndex = virtualCol.index;
                  const cellKey = `${rowIndex},${colIndex}`;

                  return (
                    <input
                      key={cellKey}
                      className="border-r border-b border-border outline-none px-2 text-sm bg-background"
                      style={{
                        position: "absolute",
                        left: virtualCol.start,
                        width: virtualCol.size,
                        height: virtualRow.size,
                      }}
                      value={cellData[cellKey] ?? ""}
                      onChange={(e) =>
                        setCellData((d) => ({
                          ...d,
                          [cellKey]: e.target.value,
                        }))
                      }
                      onFocus={() =>
                        setActiveCell({ row: rowIndex, col: colIndex })
                      }
                      onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                    />
                  );
                })}
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
