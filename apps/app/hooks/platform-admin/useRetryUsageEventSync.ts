import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";
import type { UsageEvent } from "@/types/billing";

export function useRetryUsageEventSync(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
    queryClient.invalidateQueries({
      queryKey: ["platform-admin", "usage-events", workspaceId],
    });
  };

  const retryEvent = useMutation({
    mutationFn: (eventId: string) =>
      fetchPlatformAdmin<UsageEvent>(
        `/api/platform-admin/workspaces/${workspaceId}/usage-events/${eventId}/retry-sync`,
        { auth, method: "POST" },
      ),
    onSuccess: () => {
      toast.success("Usage event sync retried");
      invalidate();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to retry usage event sync"));
    },
  });

  const retryAll = useMutation({
    mutationFn: () =>
      fetchPlatformAdmin<{ retried: number }>(
        `/api/platform-admin/workspaces/${workspaceId}/billing/retry-usage-sync`,
        { auth, method: "POST" },
      ),
    onSuccess: (data) => {
      toast.success(`Retried ${data.retried} usage events`);
      invalidate();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to retry usage sync"));
    },
  });

  return { retryEvent, retryAll };
}
