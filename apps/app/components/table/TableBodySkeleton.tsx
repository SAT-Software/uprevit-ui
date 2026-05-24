"use client";

import { TableCell, TableRow } from "@uprevit/ui/components/ui/table";

type TableBodySkeletonProps = {
  columnCount: number;
  rowCount?: number;
};

export function TableBodySkeleton({
  columnCount,
  rowCount = 6,
}: TableBodySkeletonProps) {
  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columnCount)].map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
