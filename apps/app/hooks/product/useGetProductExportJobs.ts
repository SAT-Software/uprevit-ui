import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import {
  ExportJobStatus,
  GetProductExportJobsResponse,
} from "@/types/export-job";

const DEFAULT_ACTIVE_JOB_POLL_INTERVAL = 5000;
const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];

type GetProductExportJobsParams = {
  page?: number;
  status?: ExportJobStatus[];
  targetId?: string;
};

async function getProductExportJobs({
  auth,
  signal,
  page = 1,
  status,
  targetId,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
  page?: number;
  status?: ExportJobStatus[];
  targetId?: string;
}): Promise<GetProductExportJobsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (status?.length) {
    params.set("status", status.join(","));
  }
  if (targetId) {
    params.set("targetId", targetId);
  }

  const response = await fetch(
    `/api/products/exports/jobs?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch product export jobs");
  }

  return response.json();
}

export function useGetProductExportJobs(
  { page = 1, status, targetId }: GetProductExportJobsParams = {},
  options?: {
    enabled?: boolean;
    pollWhenActive?: boolean;
    activePollIntervalMs?: number;
    refetchInterval?: number | false;
  },
) {
  const auth = useAuth();

  return useQuery({
    queryKey: [
      "product-export-jobs",
      page,
      status?.join(",") || "all",
      targetId || "all-targets",
    ],
    queryFn: ({ signal }) =>
      getProductExportJobs({ auth, signal, page, status, targetId }),
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
