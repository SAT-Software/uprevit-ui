"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import {
  PiArrowClockwiseDuotone,
  PiCheckCircleDuotone,
  PiClockDuotone,
  PiDownloadDuotone,
  PiFilePdfDuotone,
  PiFileXlsDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { useGetProductExportJobs } from "@/hooks/product/useGetProductExportJobs";
import { useDownloadProductExportJob } from "@/hooks/product/useDownloadProductExportJob";
import { ExportJobStatus } from "@/types/export-job";
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

export default function ProductExportsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | ExportJobStatus>(
    "all",
  );

  const statuses = useMemo(
    () => (statusFilter === "all" ? undefined : [statusFilter]),
    [statusFilter],
  );

  const { data, isLoading, isFetching, refetch, error } = useGetProductExportJobs(
    {
      page,
      status: statuses,
    },
    { enabled: true, pollWhenActive: true },
  );

  const { mutate: requestDownload } = useDownloadProductExportJob();
  const [downloadingJobIds, setDownloadingJobIds] = useState<Set<string>>(
    new Set(),
  );

  const jobs = data?.result?.jobs || [];
  const pagination = data?.result?.pagination;

  const handleDownload = (jobId: string) => {
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
            response.result.fileName || `product-export-${response.result.jobId}`;
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
  };

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Product Exports</h1>
            <div className="hidden h-1 w-1 rounded-full border border-border bg-border sm:block" />
            <p className="hidden text-xs font-medium text-muted-foreground sm:block">
              Track queued exports and download completed files
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as "all" | ExportJobStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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
              {isFetching ? <Spinner className="size-3" /> : <PiArrowClockwiseDuotone />}
              Refresh
            </Button>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border bg-background">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Error</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Spinner className="size-4" />
                      Loading export jobs...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-destructive">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load export jobs"}
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No export jobs found.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.jobId}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        {job.format === "pdf" ? (
                          <PiFilePdfDuotone className="size-4 text-red-500" />
                        ) : (
                          <PiFileXlsDuotone className="size-4 text-green-600" />
                        )}
                        {job.format.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        <span className="flex items-center gap-1">
                          {job.status === "completed" ? (
                            <PiCheckCircleDuotone className="size-3" />
                          ) : job.status === "failed" ? (
                            <PiWarningCircleDuotone className="size-3" />
                          ) : (
                            <PiClockDuotone className="size-3" />
                          )}
                          {job.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(job.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">{job.attempts}</TableCell>
                    <TableCell className="max-w-72 truncate text-sm text-destructive">
                      {job.errorMessage || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={
                          job.status !== "completed" ||
                          downloadingJobIds.has(job.jobId)
                        }
                        onClick={() => handleDownload(job.jobId)}
                      >
                        {downloadingJobIds.has(job.jobId) ? (
                          <Spinner className="size-3" />
                        ) : (
                          <PiDownloadDuotone />
                        )}
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && (
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
