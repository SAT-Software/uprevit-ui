import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { ExportEnqueueResponse } from "@/types/export-job";
import { exportJobsQueryKey } from "@/hooks/exports/useExportJobs";
import { getResponseError } from "@/lib/api-error";

async function exportProductPDF({
  auth,
  productId,
}: {
  auth: AuthContextProps;
  productId: string;
}): Promise<ExportEnqueueResponse> {
  const response = await fetch(`/api/products/${productId}/exports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ format: "pdf" }),
  });

  if (!response.ok) {
    throw await getResponseError(response, "Failed to queue product PDF export");
  }

  return response.json();
}

export function useExportProductPDF() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      exportProductPDF({ auth, productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exportJobsQueryKey("products") });
    },
  });
}
