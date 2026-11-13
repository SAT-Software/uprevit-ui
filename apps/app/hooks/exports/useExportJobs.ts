import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";
import {
  DownloadExportJobResponse,
  ExportJobStatus,
  GetExportJobsResponse,
} from "@/types/export-job";

export type ExportJobResource = "products" | "reports" | "audit-logs";

export const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = [
  "queued",
  "processing",
];

const DEFAULT_ACTIVE_JOB_POLL_INTERVAL = 5000;

export const exportJobsQueryKey = (resource: ExportJobResource) => [
  "export-jobs",
  resource,
];

export const isActiveExportJob = (status: ExportJobStatus) =>
  ACTIVE_EXPORT_JOB_STATUSES.includes(status);

export const countActiveExportJobs = (data?: GetExportJobsResponse) =>
  data?.result.activeJobsCount ??
  (data?.result.jobs ?? []).filter((job) => isActiveExportJob(job.status))
    .length;

export const hasActiveExportJobs = (data?: GetExportJobsResponse) =>
  data?.result.hasActiveJobs ?? countActiveExportJobs(data) > 0;

type ExportJobsParams = {
  page?: number;
  status?: ExportJobStatus[];
  targetId?: string;
};

export function useGetExportJobs(
  resource: ExportJobResource,
  { page = 1, status, targetId }: ExportJobsParams = {},
  options: { enabled?: boolean; activePollIntervalMs?: number } = {},
) {
  const auth = useAuth();

  return useQuery({
    queryKey: [
      ...exportJobsQueryKey(resource),
      page,
      status?.join(",") || "all",
      targetId || "all-targets",
    ],
    queryFn: async ({ signal }): Promise<GetExportJobsResponse> => {
      const params = new URLSearchParams({ page: String(page) });
      if (status?.length) params.set("status", status.join(","));
      if (targetId) params.set("targetId", targetId);

      const response = await fetch(
        `/api/${resource}/exports/jobs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.user?.access_token}`,
            "Content-Type": "application/json",
          },
          signal,
        },
      );

      if (!response.ok) {
        throw await getResponseError(response, "Failed to fetch export jobs");
      }

      return response.json();
    },
    enabled: (options.enabled ?? true) && auth.isAuthenticated,
    refetchInterval: (query) =>
      hasActiveExportJobs(query.state.data)
        ? (options.activePollIntervalMs ?? DEFAULT_ACTIVE_JOB_POLL_INTERVAL)
        : false,
  });
}

export function useDownloadExportJob(resource: ExportJobResource) {
  const auth = useAuth();

  return useMutation({
    mutationFn: async ({
      jobId,
    }: {
      jobId: string;
    }): Promise<DownloadExportJobResponse> => {
      const response = await fetch(
        `/api/${resource}/exports/jobs/${jobId}/download`,
        {
          headers: {
            Authorization: `Bearer ${auth?.user?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw await getResponseError(
          response,
          "Failed to fetch export download URL",
        );
      }

      return response.json();
    },
  });
}
