"use client";

import { useParams } from "next/navigation";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import BillingInvoiceDetail from "@/features/workspace/settings/BillingInvoiceDetail";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";

export default function PlatformAdminWorkspaceInvoiceDetailPage() {
  const params = useParams<{ workspaceId: string; invoiceId: string }>();
  const workspaceId = params.workspaceId;
  const invoiceId = params.invoiceId ?? "";
  const { data, isLoading, isError } =
    useGetPlatformWorkspaceDetail(workspaceId);

  const title = isLoading
    ? "Invoice"
    : (data?.workspace.workspaceName ?? "Invoice");
  const tooltip =
    isError || !data
      ? "Invoice details"
      : `${data.workspace.companyName} · ${invoiceId}`;

  return (
    <PlatformAdminGuard>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlatformAdminHeader title={title} tooltip={tooltip} />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <BillingInvoiceDetail
            workspaceId={workspaceId}
            invoiceId={invoiceId}
            apiScope="platform-admin"
            backHref={`/platform-admin/workspaces/${workspaceId}/invoices`}
            showBackLink={false}
            edgeConnected
          />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
