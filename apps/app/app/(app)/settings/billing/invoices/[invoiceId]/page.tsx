"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import BillingInvoiceDetail from "@/features/workspace/settings/BillingInvoiceDetail";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { isManagerProfile } from "@/utils/isAdmin";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

export default function BillingInvoicePage() {
  const params = useParams<{ invoiceId: string }>();
  const invoiceId = params?.invoiceId ?? "";
  const auth = useAuth();
  const router = useRouter();
  const isManager = isManagerProfile(auth.user?.profile);
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;
  const ready = !auth.isLoading && auth.isAuthenticated && isManager;

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthenticated || isManager) return;
    toast.error("Only Managers can view invoices.");
    router.replace("/settings?tab=profile");
  }, [auth.isAuthenticated, auth.isLoading, isManager, router]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium">Invoice details</h1>
          <InfoTooltip content="Line items, totals, and the invoice PDF." />
        </div>
        <ThemeToggle />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!ready ? (
          <div className="flex flex-col">
            <Skeleton className="h-20 w-full rounded-none" />
            <Skeleton className="h-56 w-full rounded-none" />
          </div>
        ) : workspaceId ? (
          <BillingInvoiceDetail
            workspaceId={workspaceId}
            invoiceId={invoiceId}
            showBackLink={false}
            edgeConnected
          />
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            Workspace not found. Sign out and sign in again.
          </p>
        )}
      </div>
    </div>
  );
}
