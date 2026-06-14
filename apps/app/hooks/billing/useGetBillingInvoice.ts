import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { ChargebeeInvoiceDetail } from "@/types/billing";

export function useGetBillingInvoice(workspaceId: string, invoiceId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["billing", "invoice", workspaceId, invoiceId],
    queryFn: async ({ signal }) => {
      const token = auth.user?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `/api/billing/invoices/${encodeURIComponent(invoiceId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal,
        },
      );

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to load invoice"),
        );
      }

      const json = await response.json();
      return json.data.invoice as ChargebeeInvoiceDetail;
    },
    enabled: auth.isAuthenticated && Boolean(workspaceId) && Boolean(invoiceId),
  });
}
