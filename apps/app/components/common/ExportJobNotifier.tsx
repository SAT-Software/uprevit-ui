"use client";

import { useEffect, useRef } from "react";
import {
  ExportJobResource,
  useGetExportJobs,
} from "@/hooks/exports/useExportJobs";
import { ExportJobStatus } from "@/types/export-job";
import { toast } from "sonner";

const TERMINAL_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["completed", "failed"];

export function ExportJobNotifier({
  resource,
}: {
  resource: Exclude<ExportJobResource, "audit-logs">;
}) {
  const { data } = useGetExportJobs(resource);
  const noun = resource === "reports" ? "report export" : "export";

  const mountedAtRef = useRef<number | null>(null);
  const previousStatusesRef = useRef<Record<string, ExportJobStatus>>({});

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    const jobs = data?.result?.jobs;
    if (!jobs?.length) return;

    for (const job of jobs) {
      const previousStatus = previousStatusesRef.current[job.jobId];
      const mountedAt = mountedAtRef.current;
      const finishedAfterMount =
        !previousStatus &&
        mountedAt !== null &&
        TERMINAL_EXPORT_JOB_STATUSES.includes(job.status) &&
        Date.parse(job.updatedAt) >= mountedAt;

      if (
        !finishedAfterMount &&
        (!previousStatus || previousStatus === job.status)
      ) {
        continue;
      }

      if (job.status === "completed") {
        toast.success(`${job.format.toUpperCase()} ${noun} is ready to download.`);
      }

      if (job.status === "failed") {
        toast.error(job.errorMessage || "Export failed.");
      }
    }

    previousStatusesRef.current = {
      ...previousStatusesRef.current,
      ...Object.fromEntries(jobs.map((job) => [job.jobId, job.status])),
    };
  }, [data, noun]);

  return null;
}
