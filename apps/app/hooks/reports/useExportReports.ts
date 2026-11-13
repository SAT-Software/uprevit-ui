import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, AuthContextProps } from "react-oidc-context";
import { ExportEnqueueResponse } from "@/types/export-job";
import { ReportsQueryRequest } from "@/types/reports";
import { exportJobsQueryKey } from "@/hooks/exports/useExportJobs";
import { getResponseError } from "@/lib/api-error";

type ExportFormat = "pdf" | "excel";

type ExportRequest = Omit<ReportsQueryRequest, "pagination">;
type QueueableExportRequest = Omit<ExportRequest, "workspaceId">;

async function enqueueReportExport({
  payload,
  auth,
  format,
}: {
  payload: ExportRequest;
  auth: AuthContextProps;
  format: ExportFormat;
}): Promise<ExportEnqueueResponse> {
  const response = await fetch("/api/reports/exports", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      workspaceId: auth?.user?.profile?.workspaceId,
      format,
    }),
  });

  if (!response.ok) {
    throw await getResponseError(response, `Failed to queue ${format.toUpperCase()} export`);
  }

  return response.json();
}

export function useExportPDF() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: QueueableExportRequest) =>
      enqueueReportExport({
        payload: {
          ...payload,
          workspaceId: auth?.user?.profile?.workspaceId as string,
        },
        auth,
        format: "pdf",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exportJobsQueryKey("reports") });
    },
  });
}

export function useExportExcel() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: QueueableExportRequest) =>
      enqueueReportExport({
        payload: {
          ...payload,
          workspaceId: auth?.user?.profile?.workspaceId as string,
        },
        auth,
        format: "excel",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exportJobsQueryKey("reports") });
    },
  });
}
