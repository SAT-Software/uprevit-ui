"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  PiArrowLeftDuotone,
  PiClockDuotone,
  PiListChecksDuotone,
  PiReceiptDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { BillingInvoicesTable } from "@/features/billing/BillingInvoicesTable";
import { useGetPlatformBillingChargebee } from "@/hooks/platform-admin/useGetPlatformBillingChargebee";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export default function PlatformAdminWorkspaceInvoicesPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const router = useRouter();
  const { data: workspace, isLoading: workspaceLoading, isError: workspaceError } =
    useGetPlatformWorkspaceDetail(workspaceId);
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

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mb-1 -ml-2 h-8 gap-1.5 px-2 text-muted-foreground"
              >
                <Link href={`/platform-admin/workspaces/${workspaceId}`}>
                  <PiArrowLeftDuotone className="h-4 w-4" />
                  Back to workspace
                </Link>
              </Button>

              {isLoading ? (
                <Skeleton className="h-8 w-56" />
              ) : (
                <div>
                  <h1 className="text-base font-semibold">
                    {workspace?.workspace.workspaceName ?? "Workspace invoices"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {workspaceError || !workspace
                      ? "Chargebee invoices for this workspace"
                      : `${workspace.workspace.companyName} · Open an invoice to view or download`}
                  </p>
                </div>
              )}

              <div className="mt-3">
                <PlatformAdminNav />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button asChild size="sm" variant="outline" className="gap-2">
                <Link href={`/platform-admin/workspaces/${workspaceId}/logs`}>
                  <PiClockDuotone className="h-4 w-4" />
                  View logs
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-2">
                <Link href={`/platform-admin/workspaces/${workspaceId}/usage-events`}>
                  <PiListChecksDuotone className="h-4 w-4" />
                  Usage events
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="border border-border bg-background rounded-xl p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <PiReceiptDuotone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Invoices</p>
              <div className="h-1 w-1 rounded-full border border-border bg-border" />
              <p className="text-xs text-muted-foreground">
                Refreshed when you open this page
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {billingLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : billingError || !billing ? (
            <div className="flex items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <PiWarningCircleDuotone className="h-5 w-5 shrink-0 text-destructive" />
              <div className="flex-1 text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Unable to load invoices."}
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : billing.invoiceError ? (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <PiWarningCircleDuotone className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
              {billing.invoiceError}
            </div>
          ) : null}

          {!billingLoading && billing && !billing.connection.customerId ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <PiReceiptDuotone className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Invoices will appear once billing is set up for this workspace.
              </p>
            </div>
          ) : null}

          {!billingLoading && billing && billing.connection.customerId && billing.invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <PiReceiptDuotone className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No invoices found.</p>
            </div>
          ) : null}

          {!billingLoading && billing && billing.invoices.length > 0 ? (
            <BillingInvoicesTable
              invoices={billing.invoices}
              onInvoiceClick={openInvoice}
            />
          ) : null}
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
