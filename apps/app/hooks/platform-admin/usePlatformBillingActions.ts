import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { getErrorMessage } from "@/lib/api-error";
import type { BillingUsageMetric, UsageSnapshot } from "@/types/billing";

export function usePlatformBillingActions(workspaceId: string) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["platform-admin"] });
  };

  const invalidateBillingAccount = () => {
    queryClient.invalidateQueries({
      queryKey: ["platform-admin", "billing-account", workspaceId],
    });
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

  const recomputeSnapshot = useMutation({
    mutationFn: () =>
      fetchPlatformAdmin<UsageSnapshot>(
        `/api/platform-admin/workspaces/${workspaceId}/usage-snapshots/recompute`,
        { auth, method: "POST" },
      ),
    onSuccess: (snapshot) => {
      toast.success(`Usage snapshot recomputed (${snapshot.reconciliationStatus})`);
      invalidate();
      invalidateBillingAccount();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to recompute snapshot"));
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
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create usage adjustment"));
    },
  });

  const runReconciliation = useMutation({
    mutationFn: () =>
      fetchPlatformAdmin<{ results: Array<{ workspaceId: string; status: string }> }>(
        "/api/platform-admin/billing/reconciliation-runs",
        { auth, method: "POST", body: { workspaceId } },
      ),
    onSuccess: () => {
      toast.success("Reconciliation completed");
      invalidate();
      invalidateBillingAccount();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to run reconciliation"));
    },
  });

  return {
    updateFreezes,
    recomputeSnapshot,
    createAdjustment,
    runReconciliation,
  };
}
