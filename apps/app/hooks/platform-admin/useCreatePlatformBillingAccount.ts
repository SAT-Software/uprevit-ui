import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { PlatformBillingDetail } from "@/types/billing";
import type { PlatformWorkspaceDetail } from "@/types/platform-admin";
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
    onSuccess: (data) => {
      toast.success("Billing account created");
      queryClient.setQueryData(
        ["platform-admin", "billing-account", workspaceId],
        data,
      );
      queryClient.setQueryData(
        ["platform-admin", "workspace", workspaceId],
        (current: PlatformWorkspaceDetail | undefined) => {
          if (!current) return current;
          const { account } = data;
          return {
            ...current,
            billing: {
              status: account.status,
              limitsEnabled: account.limitsEnabled,
              billingCadence: account.billingCadence,
              currency: account.currency,
              pastDue: account.pastDue,
            },
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create billing account"));
    },
  });
}
