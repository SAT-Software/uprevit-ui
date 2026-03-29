"use client";

import { useEffect, useRef } from "react";
import { useGetReportExportJobs } from "@/hooks/reports/useGetReportExportJobs";
import { ExportJobStatus } from "@/types/export-job";
import { toast } from "sonner";

const TERMINAL_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["completed", "failed"];

export function ReportExportJobNotifier() {
  const { data } = useGetReportExportJobs(
    { page: 1 },
    { enabled: true, pollWhenActive: true },
  );

  const initializedRef = useRef(false);
  const mountedAtRef = useRef<number | null>(null);
  const previousStatusesRef = useRef<Record<string, ExportJobStatus>>({});

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    const jobs = data?.result?.jobs;
    if (!jobs?.length) return;

    const currentStatuses: Record<string, ExportJobStatus> = {};
    for (const job of jobs) {
      currentStatuses[job.jobId] = job.status;
    }

    for (const job of jobs) {
      const previousStatus = previousStatusesRef.current[job.jobId];
      const mountedAt = mountedAtRef.current;
      const wasFirstObservedAfterMount =
        !previousStatus &&
        mountedAt !== null &&
        TERMINAL_EXPORT_JOB_STATUSES.includes(job.status) &&
        Date.parse(job.updatedAt) >= mountedAt;

      if (
        !wasFirstObservedAfterMount &&
        (!previousStatus || previousStatus === job.status)
      ) {
        continue;
      }

      if (job.status === "completed") {
        toast.success(`${job.format.toUpperCase()} report export is ready.`);
      }

      if (job.status === "failed") {
        toast.error(job.errorMessage || "Report export failed.");
      }
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
    }

    previousStatusesRef.current = {
      ...previousStatusesRef.current,
      ...currentStatuses,
    };
  }, [data]);

  return null;
}
