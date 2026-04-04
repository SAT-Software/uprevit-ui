import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import {
  ExportJobStatus,
  GetReportExportJobsResponse,
} from "@/types/export-job";

const DEFAULT_ACTIVE_JOB_POLL_INTERVAL = 5000;
const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];

type GetReportExportJobsParams = {
  page?: number;
  status?: ExportJobStatus[];
};

async function getReportExportJobs({
  auth,
  signal,
  page = 1,
  status,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
  page?: number;
  status?: ExportJobStatus[];
}): Promise<GetReportExportJobsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (status?.length) {
    params.set("status", status.join(","));
  }

  const response = await fetch(`/api/reports/exports/jobs?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch report export jobs");
  }

  return response.json();
}

export function useGetReportExportJobs(
  { page = 1, status }: GetReportExportJobsParams = {},
  options?: {
    enabled?: boolean;
    pollWhenActive?: boolean;
    activePollIntervalMs?: number;
    refetchInterval?: number | false;
  },
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["report-export-jobs", page, status?.join(",") || "all"],
    queryFn: ({ signal }) => getReportExportJobs({ auth, signal, page, status }),
    enabled: (options?.enabled ?? true) && auth.isAuthenticated,
    refetchInterval: options?.pollWhenActive
      ? (query) => {
          const data = query.state.data;
          const hasActiveJobs =
            typeof data?.result.hasActiveJobs === "boolean"
              ? data.result.hasActiveJobs
              : (data?.result.jobs ?? []).some((job) =>
                  ACTIVE_EXPORT_JOB_STATUSES.includes(job.status),
                );

          return hasActiveJobs
            ? options?.activePollIntervalMs ?? DEFAULT_ACTIVE_JOB_POLL_INTERVAL
            : false;
        }
      : options?.refetchInterval,
  });
}
