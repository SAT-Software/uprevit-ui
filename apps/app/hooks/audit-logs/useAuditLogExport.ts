import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { exportJobsQueryKey } from "@/hooks/exports/useExportJobs";
import { getResponseError } from "@/lib/api-error";
import { ExportEnqueueResponse } from "@/types/export-job";

export type AuditLogExportFilters = {
  search?: string;
  actions?: string[];
  entityType?: string;
  actorUserId?: string;
  from?: string;
  to?: string;
};

export function useEnqueueAuditLogExport() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      filters: AuditLogExportFilters,
    ): Promise<ExportEnqueueResponse> => {
      const response = await fetch("/api/audit-logs/exports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.user?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw await getResponseError(
          response,
          "Failed to queue audit log export",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exportJobsQueryKey("audit-logs") });
    },
  });
}
