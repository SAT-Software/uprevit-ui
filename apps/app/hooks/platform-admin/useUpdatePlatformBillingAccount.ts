import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";
import type { BillingAccount } from "@/types/billing";
import type { UpdatePlatformBillingAccountInput } from "@/types/platform-admin";

export function useUpdatePlatformBillingAccount(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePlatformBillingAccountInput) =>
      fetchPlatformAdmin<BillingAccount>(
        `/api/platform-admin/workspaces/${workspaceId}/billing-account`,
        { auth, method: "PUT", body: input },
      ),
    onSuccess: () => {
      toast.success("Billing account updated");
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update billing account"));
    },
  });
}
