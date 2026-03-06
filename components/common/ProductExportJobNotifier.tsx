"use client";

import { useEffect, useRef } from "react";
import { useGetProductExportJobs } from "@/hooks/product/useGetProductExportJobs";
import { ExportJobStatus } from "@/types/export-job";
import { toast } from "sonner";

export function ProductExportJobNotifier() {
  const { data, refetch } = useGetProductExportJobs(
    { page: 1 },
    { enabled: true, refetchInterval: false },
  );

  const initializedRef = useRef(false);
  const previousStatusesRef = useRef<Record<string, ExportJobStatus>>({});

  useEffect(() => {
    const jobs = data?.result?.jobs;
    const hasInProgressJobs =
      jobs?.some((job) => job.status === "queued" || job.status === "processing") ||
      false;

    if (!hasInProgressJobs) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refetch();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [data, refetch]);

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
        toast.success(
          `${job.format.toUpperCase()} export is ready to download.`,
        );
      }

      if (job.status === "failed") {
        toast.error(job.errorMessage || "Export failed.");
      }
    }

    previousStatusesRef.current = {
      ...previousStatusesRef.current,
      ...currentStatuses,
    };
  }, [data]);

  return null;
}
