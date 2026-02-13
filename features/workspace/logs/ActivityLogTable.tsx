"use client";

import { Fragment, useState } from "react";
import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  PiCalendarDuotone,
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleDownDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiCircleNotchDuotone,
  PiInfoDuotone,
  PiMapPinDuotone,
  PiUserCircleGearDuotone,
} from "react-icons/pi";

import { AuditLogV2 } from "@/types/audit-log";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ActivityLogTableProps = {
  logs: AuditLogV2[];
  page: number;
  totalPages: number;
  totalCount: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  isInitialLoading?: boolean;
  isRefreshing?: boolean;
  onPageChange: (page: number) => void;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") {
    return value.length > 140 ? `${value.slice(0, 137)}...` : value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  const serialized = JSON.stringify(value);
  return serialized.length > 120
    ? `${serialized.slice(0, 117)}...`
    : serialized;
};

const formatDateTime = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const SortableHeader = ({
  column,
  title,
  icon,
}: {
  column: Column<AuditLogV2, unknown>;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  const Icon = icon;

  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-8 w-full flex items-center justify-between gap-2 hover:bg-muted/50 rounded-md px-2"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{title}</span>
      </div>
      {column.getIsSorted() === "desc" ? (
        <PiCaretDownDuotone className="h-3.5 w-3.5" />
      ) : column.getIsSorted() === "asc" ? (
        <PiCaretUpDuotone className="h-3.5 w-3.5" />
      ) : (
        <PiCaretUpDownDuotone className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
};

const columns: ColumnDef<AuditLogV2>[] = [
  {
    id: "expand",
    header: () => <span className="sr-only">Expand</span>,
    cell: () => null,
    size: 40,
  },
  {
    id: "user",
    accessorFn: (row) => row.actor?.name || "Unknown",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="User"
        icon={PiUserCircleGearDuotone}
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">
          {row.original.actor?.name || "Unknown"}
        </p>
        {row.original.actor?.role ? (
          <Badge variant="outline" className="w-fit text-[0.65rem] capitalize">
            {row.original.actor.role}
          </Badge>
        ) : null}
      </div>
    ),
    size: 180,
  },
  {
    id: "action",
    accessorFn: (row) => row.action,
    header: ({ column }) => (
      <SortableHeader column={column} title="Action" icon={PiInfoDuotone} />
    ),
    cell: ({ row }) => (
      <p className="text-sm leading-5 text-foreground line-clamp-2 break-words">
        {row.original.summary}
      </p>
    ),
    size: 280,
  },
  {
    accessorKey: "occurredAt",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Date & Time"
        icon={PiCalendarDuotone}
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDateTime(row.original.occurredAt)}
      </span>
    ),
    size: 190,
  },
  {
    id: "context",
    accessorFn: (row) => `${row.where.module}:${row.where.tab ?? ""}`,
    header: ({ column }) => (
      <SortableHeader column={column} title="Context" icon={PiMapPinDuotone} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="capitalize">
          {row.original.where.module.replace("-", " ")}
        </span>
        {row.original.where.tab ? (
          <span className="text-muted-foreground">
            {row.original.where.tab}
          </span>
        ) : null}
      </div>
    ),
    size: 180,
  },
  {
    id: "changes",
    accessorFn: (row) => row.changes?.length ?? 0,
    header: ({ column }) => (
      <SortableHeader column={column} title="Changes" icon={PiInfoDuotone} />
    ),
    cell: ({ row }) => {
      const changes = row.original.changes ?? [];

      if (!changes.length) {
        return (
          <span className="text-xs text-muted-foreground">No field diff</span>
        );
      }

      return (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground break-all">
          <p className="break-all">
            <span className="font-medium text-foreground break-all">
              {changes[0].path}
            </span>
            : {formatValue(changes[0].from)} -&gt; {formatValue(changes[0].to)}
          </p>
          {changes.length > 1 ? (
            <p className="text-[0.7rem]">+{changes.length - 1} more changes</p>
          ) : null}
        </div>
      );
    },
    size: 260,
  },
];

export function ActivityLogTable({
  logs,
  page,
  totalPages,
  totalCount,
  hasPrevPage,
  hasNextPage,
  isInitialLoading = false,
  isRefreshing = false,
  onPageChange,
}: ActivityLogTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "occurredAt",
      desc: true,
    },
  ]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  const startItem = totalCount === 0 ? 0 : (page - 1) * 10 + 1;
  const endItem = totalCount === 0 ? 0 : Math.min(page * 10, totalCount);
  const canGoPrev = hasPrevPage ?? page > 1;
  const canGoNext = hasNextPage ?? page < totalPages;

  return (
    <div className="space-y-2 h-full min-h-0 flex flex-col">
      <div
        className="bg-background overflow-auto rounded-xl border relative flex-1 min-h-0"
        aria-busy={isInitialLoading || isRefreshing}
      >
        {isRefreshing ? (
          <div className="absolute inset-0 z-10 bg-background/70 backdrop-blur-[1px] flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
              <PiCircleNotchDuotone className="h-3.5 w-3.5 animate-spin" />
              Updating logs...
            </div>
          </div>
        ) : null}
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="h-11 border-r border-border last:border-r-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isInitialLoading ? (
              <TableRow>
                {columns.map((column, index) => {
                  const columnId =
                    column.id ??
                    String(
                      ("accessorKey" in column ? column.accessorKey : null) ??
                        index,
                    );

                  if (columnId === "expand") {
                    return (
                      <TableCell key={columnId} className="align-top">
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </TableCell>
                    );
                  }

                  if (columnId === "user") {
                    return (
                      <TableCell key={columnId} className="align-top">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </TableCell>
                    );
                  }

                  if (columnId === "action") {
                    return (
                      <TableCell key={columnId} className="align-top">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-full max-w-56" />
                          <Skeleton className="h-4 w-full max-w-48" />
                        </div>
                      </TableCell>
                    );
                  }

                  if (columnId === "occurredAt") {
                    return (
                      <TableCell key={columnId} className="align-top">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                    );
                  }

                  if (columnId === "context") {
                    return (
                      <TableCell key={columnId} className="align-top">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={columnId} className="align-top">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full max-w-64" />
                        <Skeleton className="h-4 w-full max-w-56" />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ) : rows.length ? (
              rows.map((row) => {
                const isExpanded = expandedRowId === row.original._id;
                return (
                  <Fragment key={row.id}>
                    <TableRow key={row.id} className="hover:bg-muted/30">
                      {row.getVisibleCells().map((cell) => {
                        if (cell.column.id === "expand") {
                          const hasChanges =
                            (row.original.changes?.length ?? 0) > 0;

                          return (
                            <TableCell
                              key={cell.id}
                              className="last:py-0 [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                            >
                              {hasChanges ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 shadow-none text-muted-foreground"
                                  onClick={() =>
                                    setExpandedRowId((current) =>
                                      current === row.original._id
                                        ? null
                                        : row.original._id,
                                    )
                                  }
                                  aria-expanded={isExpanded}
                                  aria-label={
                                    isExpanded
                                      ? "Collapse changes"
                                      : "Expand changes"
                                  }
                                >
                                  {isExpanded ? (
                                    <PiCaretCircleDownDuotone
                                      className="opacity-60"
                                      size={16}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PiCaretCircleRightDuotone
                                      className="opacity-60"
                                      size={16}
                                      aria-hidden="true"
                                    />
                                  )}
                                </Button>
                              ) : null}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={cell.id} className="align-top">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {isExpanded ? (
                      <TableRow
                        key={`${row.id}-expanded`}
                        className="bg-muted/20"
                      >
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <div className="flex flex-col gap-2 p-2">
                            <p className="text-xs font-semibold text-foreground">
                              All Changes
                            </p>
                            {row.original.changes?.length ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {row.original.changes.map((change, index) => (
                                  <div
                                    key={`${row.original._id}-${change.path}-${index}`}
                                    className="border border-border rounded-lg bg-background p-2"
                                  >
                                    <p className="text-xs font-medium text-foreground mb-1">
                                      {change.path}
                                    </p>
                                    <p className="text-xs text-muted-foreground break-all">
                                      {formatValue(change.from)} -&gt;{" "}
                                      {formatValue(change.to)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                No field-level changes captured for this event.
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {startItem}-{endItem}
            </span>{" "}
            of <span className="text-foreground">{totalCount}</span>
          </p>
        </div>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => onPageChange(1)}
                  disabled={!canGoPrev}
                  aria-label="Go to first page"
                >
                  <PiCaretCircleDoubleLeftDuotone
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => onPageChange(page - 1)}
                  disabled={!canGoPrev}
                  aria-label="Go to previous page"
                >
                  <PiCaretCircleLeftDuotone size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => onPageChange(page + 1)}
                  disabled={!canGoNext}
                  aria-label="Go to next page"
                >
                  <PiCaretCircleRightDuotone size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="secondary"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => onPageChange(totalPages)}
                  disabled={!canGoNext}
                  aria-label="Go to last page"
                >
                  <PiCaretCircleDoubleRightDuotone
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
