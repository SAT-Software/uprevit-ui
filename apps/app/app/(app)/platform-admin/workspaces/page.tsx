"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformAuditLogsSheet } from "@/features/platform-admin/PlatformAuditLogsSheet";
import { PlatformWorkspacesTable } from "@/features/platform-admin/PlatformWorkspacesTable";
import { ProvisionInviteDialog } from "@/features/platform-admin/ProvisionInviteDialog";
import { ProfileIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";

export default function PlatformAdminWorkspacesPage() {
  return (
    <PlatformAdminGuard>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlatformAdminHeader
          title="Workspaces"
          tooltip="Browse and open any customer organization."
          actions={
            <>
              <PlatformAuditLogsSheet
                title="Platform audit logs"
                tooltip="Track admin actions, access checks, and changes across the platform."
                trigger={
                  <Button type="button" variant="outline" size="sm">
                    <Icon icon={ProfileIcon} size={16} strokeWidth={2} />
                    Logs
                  </Button>
                }
              />
              <ProvisionInviteDialog />
            </>
          }
        />
        <PlatformAdminNav />

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <PlatformWorkspacesTable />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
