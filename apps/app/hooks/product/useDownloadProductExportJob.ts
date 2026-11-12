import { useMutation } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { DownloadProductExportJobResponse } from "@/types/export-job";
import { getResponseError } from "@/lib/api-error";

async function getProductExportDownloadUrl({
  auth,
  jobId,
}: {
  auth: AuthContextProps;
  jobId: string;
}): Promise<DownloadProductExportJobResponse> {
  const response = await fetch(`/api/products/exports/jobs/${jobId}/download`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw await getResponseError(response, "Failed to fetch export download URL");
  }

  return response.json();
}

export function useDownloadProductExportJob() {
  const auth = useAuth();

  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) =>
      getProductExportDownloadUrl({ auth, jobId }),
  });
}
