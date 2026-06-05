"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformSummaryCards } from "@/features/platform-admin/PlatformSummaryCards";
import { PlatformOperatorSetupDialog } from "@/features/platform-admin/PlatformOperatorSetupDialog";
import { ProvisionInviteDialog } from "@/features/platform-admin/ProvisionInviteDialog";
import { PlatformWorkspacesTable } from "@/features/platform-admin/PlatformWorkspacesTable";

export default function PlatformAdminDashboardPage() {
  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-2 p-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-base font-semibold">Platform admin</h1>
              <p className="text-sm text-muted-foreground">
                Cross-workspace operations for Uprevit operators.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PlatformOperatorSetupDialog />
              <ProvisionInviteDialog />
            </div>
          </div>
          <div className="mt-4">
            <PlatformAdminNav />
          </div>
        </div>

        <PlatformSummaryCards />

        <div className="rounded-xl border border-border bg-background p-4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold">Recent workspaces</h2>
            <p className="text-xs text-muted-foreground">
              Billing columns show not set until Phase 2.
            </p>
          </div>
          <PlatformWorkspacesTable />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
