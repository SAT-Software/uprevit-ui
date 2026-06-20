import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { BillingInvoiceDownloadResponse } from "@/types/billing";

export function useDownloadBillingInvoice(workspaceId: string, invoiceId: string) {
  const auth = useAuth();

  return useMutation({
    mutationKey: ["billing", "invoice", "download", workspaceId, invoiceId],
    mutationFn: async () => {
      const token = auth.user?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `/api/billing/invoices/${encodeURIComponent(invoiceId)}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to download invoice"),
        );
      }

      const json = await response.json();
      return json.data as BillingInvoiceDownloadResponse;
    },
  });
}
