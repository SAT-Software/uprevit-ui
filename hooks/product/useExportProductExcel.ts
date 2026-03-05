import { useMutation } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { EnqueueProductExportResponse } from "@/types/export-job";

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
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to queue product Excel export");
  }

  return response.json();
}

export function useExportProductExcel() {
  const auth = useAuth();

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      exportProductExcel({ auth, productId }),
  });
}
