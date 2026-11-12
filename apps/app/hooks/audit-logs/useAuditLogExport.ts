import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";
import {
  ExportEnqueueResponse,
  ExportJobPagination,
  ExportJobStatus,
  ExportJobSummary,
} from "@/types/export-job";

const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];
const AUDIT_LOG_EXPORT_JOBS_KEY = ["audit-log-export-jobs"];

export type AuditLogExportJob = ExportJobSummary & { downloadUrl?: string };

export type AuditLogExportFilters = {
  search?: string;
  actions?: string[];
  entityType?: string;
  actorUserId?: string;
  from?: string;
  to?: string;
};

type GetAuditLogExportJobsResponse = {
  message: string;
  result: {
    jobs: AuditLogExportJob[];
    hasActiveJobs: boolean;
    activeJobsCount: number;
    pagination: ExportJobPagination;
  };
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
      queryClient.invalidateQueries({ queryKey: AUDIT_LOG_EXPORT_JOBS_KEY });
    },
  });
}

export function useAuditLogExportJobs({ enabled = true } = {}) {
  const auth = useAuth();

  return useQuery({
    queryKey: AUDIT_LOG_EXPORT_JOBS_KEY,
    queryFn: async ({ signal }): Promise<GetAuditLogExportJobsResponse> => {
      const response = await fetch("/api/audit-logs/exports/jobs", {
        headers: {
          Authorization: `Bearer ${auth?.user?.access_token}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw await getResponseError(
          response,
          "Failed to fetch audit log export jobs",
        );
      }

      return response.json();
    },
    enabled: enabled && auth.isAuthenticated,
    refetchInterval: (query) =>
      (query.state.data?.result.jobs ?? []).some((job) =>
        ACTIVE_EXPORT_JOB_STATUSES.includes(job.status),
      )
        ? 5000
        : false,
  });
}
