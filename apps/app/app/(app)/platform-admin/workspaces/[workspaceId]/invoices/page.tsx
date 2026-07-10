"use client";

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
    isLoading: workspaceLoading,
    isError: workspaceError,
  } = useGetPlatformWorkspaceDetail(workspaceId);
  const {
    data: billing,
    isLoading: billingLoading,
    isError: billingError,
    error,
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
            <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
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
              <div className="flex items-center gap-4 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
                  <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Unable to load invoices."}
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
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
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                <Icon
                  icon={Invoice01Icon}
                  size={24}
                  strokeWidth={2}
                  className="text-muted-foreground/30"
                />
                <p className="text-sm text-muted-foreground">
                  Invoices will appear once billing is set up for this
                  workspace.
                </p>
              </div>
            ) : billing.invoices.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                <Icon
                  icon={Invoice01Icon}
                  size={24}
                  strokeWidth={2}
                  className="text-muted-foreground/30"
                />
                <p className="text-sm text-muted-foreground">
                  No invoices found.
                </p>
              </div>
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
