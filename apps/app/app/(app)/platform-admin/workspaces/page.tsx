"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformWorkspacesTable } from "@/features/platform-admin/PlatformWorkspacesTable";
import { ProvisionInviteDialog } from "@/features/platform-admin/ProvisionInviteDialog";

export default function PlatformAdminWorkspacesPage() {
  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        <PlatformAdminHeader
          title="Workspaces"
          subtitle="Browse and open any customer organization"
          actions={<ProvisionInviteDialog />}
        >
          <PlatformAdminNav />
        </PlatformAdminHeader>

        <div className="rounded-xl border border-border bg-background p-5">
          <PlatformWorkspacesTable />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
