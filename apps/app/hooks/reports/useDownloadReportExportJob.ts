import { useMutation } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { DownloadReportExportJobResponse } from "@/types/export-job";

async function getReportExportDownloadUrl({
  auth,
  jobId,
}: {
  auth: AuthContextProps;
  jobId: string;
}): Promise<DownloadReportExportJobResponse> {
  const response = await fetch(`/api/reports/exports/jobs/${jobId}/download`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch report export download URL");
  }

  return response.json();
}

export function useDownloadReportExportJob() {
  const auth = useAuth();

  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) =>
      getReportExportDownloadUrl({ auth, jobId }),
  });
}
