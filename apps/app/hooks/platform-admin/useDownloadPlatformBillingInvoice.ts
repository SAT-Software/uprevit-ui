import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { BillingInvoiceDownloadResponse } from "@/types/billing";

export function useDownloadPlatformBillingInvoice(
  workspaceId: string,
  invoiceId: string,
) {
  const auth = useAuth();

  return useMutation({
    mutationFn: async () =>
      fetchPlatformAdmin<BillingInvoiceDownloadResponse>(
        `/api/platform-admin/workspaces/${workspaceId}/invoices/${encodeURIComponent(invoiceId)}/download`,
        { auth },
      ),
  });
}
