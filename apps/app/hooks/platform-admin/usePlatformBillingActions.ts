import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";
import type { BillingUsageMetric } from "@/types/billing";

export function usePlatformBillingActions(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
  };

  const updateFreezes = useMutation({
    mutationFn: (input: { usageFreezeEnabled?: boolean; accessFreezeEnabled?: boolean }) =>
      fetchPlatformAdmin(
        `/api/platform-admin/workspaces/${workspaceId}/freezes`,
        { auth, method: "POST", body: input },
      ),
    onSuccess: () => {
      toast.success("Workspace freezes updated");
      invalidate();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update freezes"));
    },
  });

  const createAdjustment = useMutation({
    mutationFn: (input: { metric: BillingUsageMetric; quantityDelta: number }) =>
      fetchPlatformAdmin(
        `/api/platform-admin/workspaces/${workspaceId}/usage-adjustments`,
        { auth, method: "POST", body: input },
      ),
    onSuccess: () => {
      toast.success("Usage adjustment created");
      invalidate();
      queryClient.invalidateQueries({
        queryKey: ["platform-admin", "usage-events", workspaceId],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create usage adjustment"));
    },
  });

  return {
    updateFreezes,
    createAdjustment,
  };
}
