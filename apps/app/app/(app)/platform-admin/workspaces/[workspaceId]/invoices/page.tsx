"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  CheckListIcon,
  Invoice01Icon,
  ProfileIcon,
  Refresh04Icon,
} from "@hugeicons/core-free-icons";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAuditLogsSheet } from "@/features/platform-admin/PlatformAuditLogsSheet";
import { BillingInvoicesTable } from "@/features/billing/BillingInvoicesTable";
import { useGetPlatformBillingChargebee } from "@/hooks/platform-admin/useGetPlatformBillingChargebee";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export default function PlatformAdminWorkspaceInvoicesPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const router = useRouter();
  const {
    data: workspace,
    isPending: workspaceLoading,
    isError: workspaceError,
  } = useGetPlatformWorkspaceDetail(workspaceId);
  const {
    data: billing,
    isPending: billingLoading,
    isError: billingError,
    refetch,
  } = useGetPlatformBillingChargebee(workspaceId);

  const openInvoice = (invoiceId: string) => {
    router.push(
      `/platform-admin/workspaces/${workspaceId}/invoices/${encodeURIComponent(invoiceId)}`,
    );
  };

  const isLoading = workspaceLoading || billingLoading;
  const title = isLoading
    ? "Invoices"
    : (workspace?.workspace.workspaceName ?? "Invoices");
  const tooltip =
    workspaceError || !workspace
      ? "Chargebee invoices for this workspace."
      : `${workspace.workspace.companyName} · Open an invoice to view or download.`;

  return (
    <PlatformAdminGuard>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlatformAdminHeader
          title={title}
          tooltip={tooltip}
          actions={
            <>
              <PlatformAuditLogsSheet
                workspaceId={workspaceId}
                title="Workspace audit logs"
                tooltip="Admin and system activity for this workspace."
                trigger={
                  <Button type="button" variant="outline" size="sm">
                    <Icon icon={ProfileIcon} size={16} strokeWidth={2} />
                    Logs
                  </Button>
                }
              />
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/platform-admin/workspaces/${workspaceId}/usage-events`}
                >
                  <Icon icon={CheckListIcon} size={14} strokeWidth={2} />
                  Usage events
                </Link>
              </Button>
            </>
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Invoices</p>
                <InfoTooltip content="Billing invoices for this workspace. Open one to view details or download." />
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <Icon icon={Refresh04Icon} size={14} strokeWidth={2} />
                Refresh
              </Button>
            </div>

            {billingLoading ? (
              <div className="p-4">
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ) : billingError || !billing ? (
              <ErrorState
                variant="panel"
                embedded
                icon={Invoice01Icon}
                title="Failed to load invoices"
                onRetry={() => refetch()}
                className="min-h-48"
              />
            ) : billing.invoiceError ? (
              <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                <Icon
                  icon={AlertCircleIcon}
                  size={14}
                  strokeWidth={2}
                  className="shrink-0"
                />
                {billing.invoiceError}
              </div>
            ) : !billing.connection.customerId ? (
              <EmptyState
                embedded
                icon={Invoice01Icon}
                title="No billing set up yet"
                description="Invoices will appear once billing is set up for this workspace"
                className="min-h-48"
              />
            ) : billing.invoices.length === 0 ? (
              <EmptyState
                embedded
                icon={Invoice01Icon}
                title="No invoices found"
                className="min-h-48"
              />
            ) : (
              <BillingInvoicesTable
                invoices={billing.invoices}
                onInvoiceClick={openInvoice}
              />
            )}
          </div>
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
