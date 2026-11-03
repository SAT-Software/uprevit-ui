"use client";

import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";

const TABLE_COLUMN_COUNT = 4;

export function PlatformAdminLoadingShell() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-7 w-28 rounded-md" />
        </div>
      </div>

      <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
        <div className="flex gap-0.5">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 border-b border-border min-[1200px]:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4">
              <Skeleton className="hidden size-10 shrink-0 rounded-lg sm:block" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-10" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 p-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex h-10 items-center border-b border-border bg-muted/60 pl-3 pr-2">
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <div className="p-2">
              <Skeleton className="mb-2 h-8 w-full max-w-sm rounded-md" />
              <div className="overflow-hidden border-b border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="h-10 hover:bg-transparent">
                      {Array.from({ length: TABLE_COLUMN_COUNT }).map(
                        (_, index) => (
                          <TableHead key={index} className="h-10">
                            <Skeleton className="h-4 w-24 rounded" />
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableBodySkeleton columnCount={TABLE_COLUMN_COUNT} />
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
