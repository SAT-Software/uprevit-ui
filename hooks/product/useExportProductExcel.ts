import { useMutation } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function exportProductExcel({
  auth,
  productId,
  productName,
}: {
  auth: AuthContextProps;
  productId: string;
  productName?: string;
}) {
  const response = await fetch(`/api/products/${productId}/export/excel`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to export product");
  }

  const base64Data = await response.text();

  // Decode base64 to binary
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Trigger download
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${productName || "Product"}_Export.xlsx`;
  link.click();

  // Cleanup
  window.URL.revokeObjectURL(link.href);

  return blob;
}

export function useExportProductExcel() {
  const auth = useAuth();

  return useMutation({
    mutationFn: ({
      productId,
      productName,
    }: {
      productId: string;
      productName?: string;
    }) => exportProductExcel({ auth, productId, productName }),
  });
}
