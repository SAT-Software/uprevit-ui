"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PiArrowLeftDuotone } from "react-icons/pi";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import BillingInvoiceDetail from "@/features/workspace/settings/BillingInvoiceDetail";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export default function PlatformAdminWorkspaceInvoiceDetailPage() {
  const params = useParams<{ workspaceId: string; invoiceId: string }>();
  const workspaceId = params.workspaceId;
  const invoiceId = params.invoiceId ?? "";
  const { data, isLoading, isError } = useGetPlatformWorkspaceDetail(workspaceId);

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        <div className="rounded-xl border border-border bg-background p-5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-1 -ml-2 h-8 gap-1.5 px-2 text-muted-foreground"
          >
            <Link href={`/platform-admin/workspaces/${workspaceId}/invoices`}>
              <PiArrowLeftDuotone className="h-4 w-4" />
              Back to invoices
            </Link>
          </Button>

          {isLoading ? (
            <Skeleton className="h-8 w-56" />
          ) : (
            <div>
              <h1 className="text-base font-semibold">
                {data?.workspace.workspaceName ?? "Invoice"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isError || !data
                  ? "Invoice details"
                  : `${data.workspace.companyName} · ${invoiceId}`}
              </p>
            </div>
          )}

          <div className="mt-3">
            <PlatformAdminNav />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <BillingInvoiceDetail
            workspaceId={workspaceId}
            invoiceId={invoiceId}
            apiScope="platform-admin"
            backHref={`/platform-admin/workspaces/${workspaceId}/invoices`}
          />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
