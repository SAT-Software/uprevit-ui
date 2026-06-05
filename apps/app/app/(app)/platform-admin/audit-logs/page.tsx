"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformAuditLogsTable } from "@/features/platform-admin/PlatformAuditLogsTable";
import { usePlatformAdminWorkspaceIdFilter } from "@/lib/platform-admin-list-query";

export default function PlatformAdminAuditLogsPage() {
  const { workspaceId, clearWorkspaceFilter } = usePlatformAdminWorkspaceIdFilter();

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-2 p-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <h1 className="text-base font-semibold">Platform audit logs</h1>
          <p className="text-sm text-muted-foreground">
            Mutations, workspace detail views, and failed allowlist checks.
          </p>
          <div className="mt-4">
            <PlatformAdminNav />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <PlatformAuditLogsTable
            workspaceId={workspaceId}
            onClearWorkspaceFilter={clearWorkspaceFilter}
          />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
