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
    <div className="flex flex-col gap-2 p-2">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-36 rounded bg-muted animate-pulse" />
            <div className="h-4 w-72 max-w-full rounded bg-muted animate-pulse" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-8 w-16 rounded bg-muted animate-pulse" />
            <div className="mt-2 h-3 w-32 rounded bg-muted/80 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex flex-col gap-2">
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
          <div className="h-3 w-56 rounded bg-muted/80 animate-pulse" />
        </div>
        <div className="mb-3 h-8 w-full max-w-sm rounded-md bg-muted animate-pulse" />
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                {Array.from({ length: TABLE_COLUMN_COUNT }).map((_, index) => (
                  <TableHead key={index}>
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableBodySkeleton columnCount={TABLE_COLUMN_COUNT} />
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
