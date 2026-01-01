import { useMutation } from "@tanstack/react-query";
import { useAuth, AuthContextProps } from "react-oidc-context";
import { ReportsQueryRequest } from "@/types/reports";

type ExportFormat = "pdf" | "excel";

interface ExportRequest extends Omit<ReportsQueryRequest, "pagination"> {
  format: ExportFormat;
}

async function exportReports({
  payload,
  auth,
  format,
}: {
  payload: ExportRequest;
  auth: AuthContextProps;
  format: ExportFormat;
}): Promise<Blob> {
  const response = await fetch(`/api/reports/export/${format}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      workspaceId: auth?.user?.profile?.workspaceId,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to export as ${format.toUpperCase()}`);
  }

  const base64Data = await response.text();

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const mimeType =
    format === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return new Blob([byteArray], { type: mimeType });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function useExportPDF() {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: Omit<ExportRequest, "format">) => {
      const blob = await exportReports({
        payload: { ...payload, format: "pdf" },
        auth,
        format: "pdf",
      });
      const timestamp = new Date().toISOString().split("T")[0];
      downloadBlob(blob, `reports-report-${timestamp}.pdf`);
      return blob;
    },
  });
}

export function useExportExcel() {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: Omit<ExportRequest, "format">) => {
      const blob = await exportReports({
        payload: { ...payload, format: "excel" },
        auth,
        format: "excel",
      });
      const timestamp = new Date().toISOString().split("T")[0];
      downloadBlob(blob, `reports-report-${timestamp}.xlsx`);
      return blob;
    },
  });
}
