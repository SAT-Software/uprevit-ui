"use client";

import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import type { IconType } from "react-icons";
import {
  PiArrowClockwiseDuotone,
  PiCalendarDuotone,
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
  PiCheckCircleDuotone,
  PiClockDuotone,
  PiDownloadDuotone,
  PiFilePdfDuotone,
  PiFileXlsDuotone,
  PiHashDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@uprevit/ui/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { useDownloadReportExportJob } from "@/hooks/reports/useDownloadReportExportJob";
import { useGetReportExportJobs } from "@/hooks/reports/useGetReportExportJobs";
import { ExportJobStatus, ExportJobSummary } from "@/types/export-job";
import { toast } from "sonner";

const STATUS_FILTERS: Array<{ label: string; value: "all" | ExportJobStatus }> = [
  { label: "All", value: "all" },
  { label: "Queued", value: "queued" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const getStatusBadgeVariant = (status: ExportJobStatus) => {
  if (status === "completed") return "default" as const;
  if (status === "failed") return "destructive" as const;
  return "secondary" as const;
};

const formatDateTime = (value: string): string => {
  try {
    return format(new Date(value), "MMM d, yyyy • h:mm a");
  } catch {
    return value;
  }
};

function StaticHeader({
  title,
  icon: Icon,
}: {
  title: string;
  icon: IconType;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{title}</span>
    </div>
  );
}

export function ReportExportsTable() {
  const [statusFilter, setStatusFilter] = useState<"all" | ExportJobStatus>(
    "all",
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [downloadingJobIds, setDownloadingJobIds] = useState<Set<string>>(
    new Set(),
  );

  const statuses = useMemo(
    () => (statusFilter === "all" ? undefined : [statusFilter]),
    [statusFilter],
  );

  const page = pagination.pageIndex + 1;

  const { data, isLoading, isFetching, refetch, error } = useGetReportExportJobs(
    {
      page,
      status: statuses,
    },
    { enabled: true, pollWhenActive: true },
  );

  const { mutate: requestDownload } = useDownloadReportExportJob();

  const jobs = data?.result.jobs ?? [];
  const paginationInfo = data?.result.pagination;
  const totalCount = paginationInfo?.totalCount ?? jobs.length;
  const currentLimit = paginationInfo?.limit ?? pagination.pageSize;
  const startItem =
    totalCount === 0 ? 0 : pagination.pageIndex * currentLimit + 1;
  const endItem =
    totalCount === 0
      ? 0
      : Math.min(pagination.pageIndex * currentLimit + jobs.length, totalCount);

  const handleDownload = useCallback(
    (jobId: string) => {
      setDownloadingJobIds((prev) => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });

      requestDownload(
        { jobId },
        {
          onSuccess: (response) => {
            const link = document.createElement("a");
            link.href = response.result.downloadUrl;
            link.download =
              response.result.fileName || `report-export-${response.result.jobId}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
          },
          onError: (downloadError) => {
            toast.error(
              downloadError instanceof Error
                ? downloadError.message
                : "Failed to prepare download",
            );
          },
          onSettled: () => {
            setDownloadingJobIds((prev) => {
              const next = new Set(prev);
              next.delete(jobId);
              return next;
            });
          },
        },
      );
    },
    [requestDownload],
  );

  const columns = useMemo<ColumnDef<ExportJobSummary>[]>(
    () => [
      {
        accessorKey: "format",
        header: () => <StaticHeader title="Format" icon={PiFilePdfDuotone} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm font-medium">
            {row.original.format === "pdf" ? (
              <PiFilePdfDuotone className="size-4 text-red-500" />
            ) : (
              <PiFileXlsDuotone className="size-4 text-green-600" />
            )}
            {row.original.format.toUpperCase()}
          </div>
        ),
        size: 140,
      },
      {
        accessorKey: "status",
        header: () => <StaticHeader title="Status" icon={PiClockDuotone} />,
        cell: ({ row }) => (
          <Badge variant={getStatusBadgeVariant(row.original.status)}>
            <span className="flex items-center gap-1.5 capitalize">
              {row.original.status === "completed" ? (
                <PiCheckCircleDuotone className="size-3" />
              ) : row.original.status === "failed" ? (
                <PiWarningCircleDuotone className="size-3" />
              ) : (
                <PiClockDuotone className="size-3" />
              )}
              {row.original.status}
            </span>
          </Badge>
        ),
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: () => <StaticHeader title="Created" icon={PiCalendarDuotone} />,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
        size: 210,
      },
      {
        accessorKey: "attempts",
        header: () => <StaticHeader title="Attempts" icon={PiHashDuotone} />,
        cell: ({ row }) => <span className="text-sm">{row.original.attempts}</span>,
        size: 110,
      },
      {
        accessorKey: "errorMessage",
        header: () => (
          <StaticHeader title="Error" icon={PiWarningCircleDuotone} />
        ),
        cell: ({ row }) => (
          <div title={row.original.errorMessage || undefined}>
            <p className="line-clamp-2 break-words text-left text-sm text-destructive">
              {row.original.errorMessage || "-"}
            </p>
          </div>
        ),
        size: 320,
      },
      {
        id: "actions",
        header: () => <StaticHeader title="Action" icon={PiDownloadDuotone} />,
        cell: ({ row }) => (
          <Button
            variant="secondary"
            size="sm"
            disabled={
              row.original.status !== "completed" ||
              downloadingJobIds.has(row.original.jobId)
            }
            onClick={() => handleDownload(row.original.jobId)}
          >
            {downloadingJobIds.has(row.original.jobId) ? (
              <Spinner className="size-3" />
            ) : (
              <PiDownloadDuotone />
            )}
            Download
          </Button>
        ),
        size: 140,
      },
    ],
    [downloadingJobIds, handleDownload],
  );

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 1,
    rowCount: totalCount,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center justify-start w-full gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as "all" | ExportJobStatus);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Spinner className="size-3" />
            ) : (
              <PiArrowClockwiseDuotone />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-background overflow-hidden rounded-xl border">
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="inline-flex items-center gap-2">
                    <Spinner className="size-4" />
                    Loading export jobs...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive"
                >
                  {error instanceof Error
                    ? error.message
                    : "Failed to load report export jobs"}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No export jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationInfo ? (
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
                    variant="secondary"
                    size="sm"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to first page"
                  >
                    <PiCaretCircleDoubleLeftDuotone aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    <PiCaretCircleLeftDuotone aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                  >
                    <PiCaretCircleRightDuotone aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to last page"
                  >
                    <PiCaretCircleDoubleRightDuotone aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      ) : null}
    </div>
  );
}
