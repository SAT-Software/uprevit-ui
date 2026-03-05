import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import {
  ExportJobStatus,
  GetProductExportJobsResponse,
} from "@/types/export-job";

type GetProductExportJobsParams = {
  page?: number;
  status?: ExportJobStatus[];
};

async function getProductExportJobs({
  auth,
  signal,
  page = 1,
  status,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
  page?: number;
  status?: ExportJobStatus[];
}): Promise<GetProductExportJobsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (status?.length) {
    params.set("status", status.join(","));
  }

  const response = await fetch(`/api/products/exports/jobs?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch product export jobs");
  }

  return response.json();
}

export function useGetProductExportJobs(
  { page = 1, status }: GetProductExportJobsParams = {},
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["product-export-jobs", page, status?.join(",") || "all"],
    queryFn: ({ signal }) => getProductExportJobs({ auth, signal, page, status }),
    enabled: (options?.enabled ?? true) && auth.isAuthenticated,
    refetchInterval: options?.refetchInterval,
  });
}
