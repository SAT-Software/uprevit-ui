"use client";

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
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-7 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <div className="flex shrink-0 items-end border-b border-border px-2 py-2">
        <div className="flex gap-0.5">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-7 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="grid grid-cols-2 min-[1200px]:grid-cols-3 2xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-r border-border p-4"
                >
                  <div className="hidden size-10 shrink-0 animate-pulse rounded-lg bg-muted sm:block" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-12 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex h-10 items-center border-b border-border pl-3 pr-2">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </div>
            <div className="p-2">
              <div className="mb-2 h-8 w-full max-w-sm animate-pulse rounded-md bg-muted" />
              <div className="overflow-hidden border-b border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="h-10 hover:bg-transparent">
                      {Array.from({ length: TABLE_COLUMN_COUNT }).map(
                        (_, index) => (
                          <TableHead key={index} className="h-10">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
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
