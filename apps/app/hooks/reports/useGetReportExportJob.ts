import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { GetReportExportJobResponse } from "@/types/export-job";

async function getReportExportJob({
  auth,
  signal,
  jobId,
}: {
  auth: AuthContextProps;
  signal: AbortSignal;
  jobId: string;
}): Promise<GetReportExportJobResponse> {
  const response = await fetch(`/api/reports/exports/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch report export job");
  }

  return response.json();
}

export function useGetReportExportJob(
  jobId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["report-export-job", jobId],
    queryFn: ({ signal }) =>
      getReportExportJob({ auth, signal, jobId: jobId as string }),
    enabled: (options?.enabled ?? true) && auth.isAuthenticated && Boolean(jobId),
    refetchInterval: options?.refetchInterval,
  });
}
