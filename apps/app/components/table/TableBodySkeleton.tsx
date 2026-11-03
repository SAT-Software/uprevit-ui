"use client";

import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { TableCell, TableRow } from "@uprevit/ui/components/ui/table";
import { WORKSPACE_LIST_LIMIT } from "@/lib/workspace-list-query";

type TableBodySkeletonProps = {
  columnCount: number;
  rowCount?: number;
};

export function TableBodySkeleton({
  columnCount,
  rowCount = WORKSPACE_LIST_LIMIT,
}: TableBodySkeletonProps) {
  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columnCount)].map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              {rowIndex === 0 && cellIndex === 0 && (
                <span role="status" className="sr-only">
                  Loading…
                </span>
              )}
              <div aria-hidden="true" className="flex h-7 items-center">
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
