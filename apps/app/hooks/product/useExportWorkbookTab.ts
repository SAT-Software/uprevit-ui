import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { EnqueueProductExportResponse } from "@/types/export-job";
import { getResponseError } from "@/lib/api-error";

export type WorkbookTabExportTarget = "product_specifications" | "operational_parameters";

async function exportWorkbookTab({
  auth,
  productId,
  target,
  format,
}: {
  auth: AuthContextProps;
  productId: string;
  target: WorkbookTabExportTarget;
  format: "pdf" | "excel";
}): Promise<EnqueueProductExportResponse> {
  const response = await fetch(`/api/products/${productId}/exports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ format, target }),
  });

  if (!response.ok) {
    throw await getResponseError(response, "Failed to queue export");
  }

  return response.json();
}

export function useExportWorkbookTab() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { productId: string; target: WorkbookTabExportTarget; format: "pdf" | "excel" }) =>
      exportWorkbookTab({ auth, ...input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-export-jobs"] });
    },
  });
}
