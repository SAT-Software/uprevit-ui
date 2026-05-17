import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { EnqueueProductExportResponse } from "@/types/export-job";
import { getResponseErrorMessage } from "@/lib/api-error";

async function exportProductExcel({
  auth,
  productId,
}: {
  auth: AuthContextProps;
  productId: string;
}): Promise<EnqueueProductExportResponse> {
  const response = await fetch(`/api/products/${productId}/exports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ format: "excel" }),
  });

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, "Failed to queue product Excel export")
    );
  }

  return response.json();
}

export function useExportProductExcel() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      exportProductExcel({ auth, productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-export-jobs"] });
    },
  });
}
