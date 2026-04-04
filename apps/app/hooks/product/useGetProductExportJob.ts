import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { GetProductExportJobResponse } from "@/types/export-job";

async function getProductExportJob({
  auth,
  signal,
  jobId,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
  jobId: string;
}): Promise<GetProductExportJobResponse> {
  const response = await fetch(`/api/products/exports/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch product export job");
  }

  return response.json();
}

export function useGetProductExportJob(
  jobId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["product-export-job", jobId],
    queryFn: ({ signal }) =>
      getProductExportJob({ auth, signal, jobId: jobId as string }),
    enabled: (options?.enabled ?? true) && auth.isAuthenticated && Boolean(jobId),
    refetchInterval: options?.refetchInterval,
  });
}
