import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { ChargebeeInvoiceDetail } from "@/types/billing";

export function useGetPlatformBillingInvoice(
  workspaceId: string,
  invoiceId: string,
  enabled = true,
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "invoice", workspaceId, invoiceId],
    queryFn: async ({ signal }) => {
      const data = await fetchPlatformAdmin<{ invoice: ChargebeeInvoiceDetail }>(
        `/api/platform-admin/workspaces/${workspaceId}/invoices/${encodeURIComponent(invoiceId)}`,
        { auth, signal },
      );
      return data.invoice;
    },
    enabled: enabled && auth.isAuthenticated && Boolean(workspaceId) && Boolean(invoiceId),
  });
}
