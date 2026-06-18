import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";

export function useLinkChargebeeSubscription(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { subscriptionId: string }) =>
      fetchPlatformAdmin<{ subscriptionId: string; retriedUsageEvents: number }>(
        `/api/platform-admin/workspaces/${workspaceId}/chargebee/subscription/link`,
        { auth, method: "POST", body: input },
      ),
    onSuccess: (data) => {
      toast.success(
        data.retriedUsageEvents > 0
          ? `Subscription linked; retried ${data.retriedUsageEvents} usage events`
          : "Subscription linked",
      );
      queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to link subscription"));
    },
  });
}
