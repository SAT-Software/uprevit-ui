"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CloudUploadIcon,
  DatabaseExportIcon,
  Download04Icon,
  FilterVerticalIcon,
  Pdf01Icon,
  Refresh04Icon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { useDownloadReportExportJob } from "@/hooks/reports/useDownloadReportExportJob";
import { useGetReportExportJobs } from "@/hooks/reports/useGetReportExportJobs";
import {
  ExportJobFormat,
  ExportJobStatus,
  ExportJobSummary,
} from "@/types/export-job";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@uprevit/ui/components/ui/sheet";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";
import { toast } from "sonner";

const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];

const STATUS_FILTERS: Array<{ label: string; value: "all" | ExportJobStatus }> =
  [
    { label: "All", value: "all" },
    { label: "Queued", value: "queued" },
    { label: "Processing", value: "processing" },
    { label: "Completed", value: "completed" },
    { label: "Failed", value: "failed" },
  ];

type ReportExportsSheetProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
};

function getJobLabel(job: ExportJobSummary) {
  if (job.fileName) return job.fileName;
  return `${job.format.toUpperCase()} report export`;
}

function FormatIcon({ format }: { format: ExportJobFormat }) {
  const icon = format === "pdf" ? Pdf01Icon : Xls01Icon;
  const colorClass =
    format === "pdf"
      ? "text-red-500 dark:text-red-400"
      : "text-emerald-600 dark:text-emerald-500";

  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-accent",
        colorClass,
      )}
    >
      <Icon icon={icon} size={18} strokeWidth={2} />
    </div>
  );
}

function ExportStatusBadge({ status }: { status: ExportJobStatus }) {
  if (status === "completed") {
    return (
      <Badge className="gap-1 bg-emerald-500 text-white hover:bg-emerald-500">
        <Icon icon={BadgeCheckIcon} size={12} strokeWidth={2} />
        Ready
      </Badge>
    );
  }

  if (status === "failed") {
    return (
      <Badge variant="destructive" className="gap-1">
        <Icon icon={AlertCircleIcon} size={12} strokeWidth={2} />
        Failed
      </Badge>
    );
  }

  if (status === "processing") {
    return (
      <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
        <Spinner className="size-3 text-white" />
        Processing
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Icon icon={CloudUploadIcon} size={12} strokeWidth={2} />
      Queued
    </Badge>
  );
}

function ReportExportJobCard({
  job,
  isDownloading,
  onDownload,
}: {
  job: ExportJobSummary;
  isDownloading: boolean;
  onDownload: (jobId: string) => void;
}) {
  const createdAt = formatToLocalDateTime(job.createdAt);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/60 p-3">
      <FormatIcon format={job.format} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {getJobLabel(job)}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <ExportStatusBadge status={job.status} />
          {createdAt ? (
            <span className="text-xs text-muted-foreground">{createdAt}</span>
          ) : null}
        </div>
        {job.status === "failed" && job.errorMessage ? (
          <p className="mt-1 line-clamp-2 text-xs text-destructive">
            {job.errorMessage}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">
        {job.status === "completed" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                disabled={isDownloading}
                aria-label="Download export"
                onClick={() => onDownload(job.jobId)}
              >
                {isDownloading ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <Icon icon={Download04Icon} size={14} strokeWidth={2} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        ) : ACTIVE_EXPORT_JOB_STATUSES.includes(job.status) ? (
          <Spinner className="size-4 text-muted-foreground" />
        ) : null}
      </div>
    </div>
  );
}

export function ReportExportsSheet({
  trigger,
  open,
  onOpenChange,
  showTrigger = true,
}: ReportExportsSheetProps) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | ExportJobStatus>(
    "all",
  );
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [downloadingJobIds, setDownloadingJobIds] = useState<Set<string>>(
    new Set(),
  );

  const isControlled = open !== undefined;
  const sheetOpen = isControlled ? open : internalOpen;

  const setSheetOpen = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const statuses = useMemo(
    () => (statusFilter === "all" ? undefined : [statusFilter]),
    [statusFilter],
  );

  const { data: badgeData } = useGetReportExportJobs(
    { page: 1 },
    { enabled: true, pollWhenActive: true },
  );

  const { data, isLoading, isFetching, error } = useGetReportExportJobs(
    { page: 1, status: statuses },
    { enabled: sheetOpen, pollWhenActive: true },
  );

  const { mutate: requestDownload } = useDownloadReportExportJob();

  const jobs = data?.result.jobs ?? [];
  const badgeJobs = badgeData?.result.jobs ?? [];
  const activeCount =
    typeof badgeData?.result.activeJobsCount === "number"
      ? badgeData.result.activeJobsCount
      : badgeJobs.filter((job) =>
          ACTIVE_EXPORT_JOB_STATUSES.includes(job.status),
        ).length;
  const latestJob = badgeJobs[0];

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["report-export-jobs"] });
  };

  const handleDownload = useCallback(
    (jobId: string) => {
      setDownloadingJobIds((prev) => new Set(prev).add(jobId));

      requestDownload(
        { jobId },
        {
          onSuccess: (response) => {
            const link = document.createElement("a");
            link.href = response.result.downloadUrl;
            link.download =
              response.result.fileName ||
              `report-export-${response.result.jobId}`;
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

  const renderIndicator = () => {
    if (activeCount > 0) {
      return (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {activeCount}
        </span>
      );
    }

    if (latestJob?.status === "failed") {
      return <span className="h-2 w-2 rounded-full bg-destructive" />;
    }

    if (latestJob?.status === "completed") {
      return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
    }

    return null;
  };

  const defaultTrigger = (
    <Button type="button" variant="outline" size="sm" className="gap-1.5 group">
      <Icon
        icon={DatabaseExportIcon}
        size={16}
        strokeWidth={2}
        className="text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-foreground"
      />
      Exports
      {renderIndicator()}
    </Button>
  );

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      {showTrigger ? (
        <SheetTrigger>
          <Tooltip>
            <TooltipTrigger asChild>{trigger ?? defaultTrigger}</TooltipTrigger>
            <TooltipContent>View report export jobs</TooltipContent>
          </Tooltip>
        </SheetTrigger>
      ) : null}
      <SheetContent
        className="flex flex-col gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Report Exports</SheetTitle>
          <InfoTooltip
            className="mt-0.5"
            ContentClassName="z-105"
            content="Track queued report PDF and Excel exports and download generated files when ready."
          />
        </SheetHeader>
        <div
          ref={setPortalContainer}
          className="flex min-h-0 flex-1 flex-col pt-10"
        >
          <div className="flex h-10 shrink-0 items-center justify-start gap-2 border-b bg-background px-2">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | ExportJobStatus)
              }
            >
              <SelectTrigger className="w-auto shrink-0 truncate group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex min-w-0 items-center gap-1">
                      <Icon
                        icon={FilterVerticalIcon}
                        size={14}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-foreground"
                      />
                      <SelectValue placeholder="Status" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Filter by status</TooltipContent>
                </Tooltip>
              </SelectTrigger>
              <SelectContent container={portalContainer} className="z-110">
                {STATUS_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={handleRefresh}
                  disabled={isFetching}
                  aria-label="Refresh exports"
                >
                  <Icon icon={Refresh04Icon} size={14} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh exports</TooltipContent>
            </Tooltip>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Loading exports...
              </div>
            ) : error ? (
              <DashboardErrorState
                variant="panel"
                embedded
                icon={AlertCircleIcon}
                title="Failed to load exports"
                description={
                  error instanceof Error
                    ? error.message
                    : "Reload the page or try again"
                }
                className="min-h-48"
              />
            ) : jobs.length ? (
              <div className="flex flex-col gap-2">
                {jobs.map((job) => (
                  <ReportExportJobCard
                    key={job.jobId}
                    job={job}
                    isDownloading={downloadingJobIds.has(job.jobId)}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground">
                No export jobs found
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ReportExportsSheet;
