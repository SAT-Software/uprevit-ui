import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { EnqueueProductExportResponse } from "@/types/export-job";

async function exportProductPDF({
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
    body: JSON.stringify({ format: "pdf" }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to queue product PDF export");
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
      queryClient.invalidateQueries({ queryKey: ["product-export-jobs"] });
    },
  });
}
