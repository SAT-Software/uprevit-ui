import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, AuthContextProps } from "react-oidc-context";
import { EnqueueReportExportResponse } from "@/types/export-job";
import { ReportsQueryRequest } from "@/types/reports";

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
}): Promise<EnqueueReportExportResponse> {
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
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to queue ${format.toUpperCase()} export`);
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
      queryClient.invalidateQueries({ queryKey: ["report-export-jobs"] });
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
      queryClient.invalidateQueries({ queryKey: ["report-export-jobs"] });
    },
  });
}
