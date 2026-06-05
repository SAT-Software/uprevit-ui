"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformWorkspacesTable } from "@/features/platform-admin/PlatformWorkspacesTable";
import { ProvisionInviteDialog } from "@/features/platform-admin/ProvisionInviteDialog";

export default function PlatformAdminWorkspacesPage() {
  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-2 p-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-base font-semibold">Workspaces</h1>
              <p className="text-sm text-muted-foreground">
                Search and open any customer workspace.
              </p>
            </div>
            <ProvisionInviteDialog />
          </div>
          <div className="mt-4">
            <PlatformAdminNav />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <PlatformWorkspacesTable />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
