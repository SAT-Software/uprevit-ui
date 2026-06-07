import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { PlatformBillingDetail } from "@/types/billing";
import { getErrorMessage } from "@/lib/api-error";

export function useCreatePlatformBillingAccount(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchPlatformAdmin<PlatformBillingDetail>(
        `/api/platform-admin/workspaces/${workspaceId}/billing-account`,
        { auth, method: "POST" },
      ),
    onSuccess: () => {
      toast.success("Billing account created");
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create billing account"));
    },
  });
}
