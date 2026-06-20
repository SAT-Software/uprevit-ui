"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformAuditLogsTable } from "@/features/platform-admin/PlatformAuditLogsTable";
import { usePlatformAdminWorkspaceIdFilter } from "@/lib/platform-admin-list-query";

export default function PlatformAdminAuditLogsPage() {
  const { workspaceId, clearWorkspaceFilter } = usePlatformAdminWorkspaceIdFilter();

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        <PlatformAdminHeader
          title="Audit logs"
          subtitle="Track admin actions, access checks, and changes across the platform"
        >
          <PlatformAdminNav />
        </PlatformAdminHeader>

        <div className="rounded-xl border border-border bg-background p-5">
          <PlatformAuditLogsTable
            workspaceId={workspaceId}
            onClearWorkspaceFilter={clearWorkspaceFilter}
          />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
