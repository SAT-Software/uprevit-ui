"use client";

import { useEffect, useRef } from "react";
import { useGetReportExportJobs } from "@/hooks/reports/useGetReportExportJobs";
import { ExportJobStatus } from "@/types/export-job";
import { toast } from "sonner";

export function ReportExportJobNotifier() {
  const { data } = useGetReportExportJobs(
    { page: 1 },
    { enabled: true, pollWhenActive: true },
  );

  const initializedRef = useRef(false);
  const previousStatusesRef = useRef<Record<string, ExportJobStatus>>({});

  useEffect(() => {
    const jobs = data?.result?.jobs;
    if (!jobs?.length) return;

    const currentStatuses: Record<string, ExportJobStatus> = {};
    for (const job of jobs) {
      currentStatuses[job.jobId] = job.status;
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      previousStatusesRef.current = currentStatuses;
      return;
    }

    for (const job of jobs) {
      const previousStatus = previousStatusesRef.current[job.jobId];
      if (!previousStatus || previousStatus === job.status) continue;

      if (job.status === "completed") {
        toast.success(`${job.format.toUpperCase()} report export is ready.`);
      }

      if (job.status === "failed") {
        toast.error(job.errorMessage || "Report export failed.");
      }
    }

    previousStatusesRef.current = {
      ...previousStatusesRef.current,
      ...currentStatuses,
    };
  }, [data]);

  return null;
}
