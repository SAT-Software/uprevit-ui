"use client";

import BillingInvoiceDetail from "@/features/workspace/settings/BillingInvoiceDetail";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { isAdminProfile } from "@/utils/isAdmin";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

export default function BillingInvoicePage() {
  const params = useParams<{ invoiceId: string }>();
  const invoiceId = params?.invoiceId ?? "";
  const auth = useAuth();
  const router = useRouter();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.isAuthenticated) return;

    if (!isAdmin) {
      toast.error("Insufficient privileges, contact Admin");
      router.replace("/settings?tab=profile");
    }
  }, [auth.isAuthenticated, auth.isLoading, isAdmin, router]);

  if (auth.isLoading || !auth.isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="rounded-xl border border-input bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        <div className="rounded-xl border border-input bg-background p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-36" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="border border-input bg-background rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Workspace not found.</p>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <Link href="/settings?tab=billing">Back to billing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="border border-input bg-background rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Invoice details</h1>
            <p className="text-sm text-muted-foreground">
              View line items, totals, and download the invoice PDF.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="border border-input bg-background rounded-xl p-4">
        <BillingInvoiceDetail workspaceId={workspaceId} invoiceId={invoiceId} />
      </div>
    </div>
  );
}
