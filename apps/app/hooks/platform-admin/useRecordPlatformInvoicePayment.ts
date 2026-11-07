import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";
import type { ChargebeeInvoiceDetail } from "@/types/billing";

export function useRecordPlatformInvoicePayment(
  workspaceId: string,
  invoiceId: string,
) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { referenceNumber?: string }) =>
      fetchPlatformAdmin<{ invoice: ChargebeeInvoiceDetail }>(
        `/api/platform-admin/workspaces/${workspaceId}/invoices/${encodeURIComponent(invoiceId)}/record-payment`,
        { auth, method: "POST", body: input },
      ),
    onSuccess: () => {
      toast.success("Invoice marked as paid");
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to mark the invoice as paid"));
    },
  });
}
