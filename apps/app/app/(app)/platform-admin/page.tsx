"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformAuditLogsSheet } from "@/features/platform-admin/PlatformAuditLogsSheet";
import { PlatformSummaryCards } from "@/features/platform-admin/PlatformSummaryCards";
import { PlatformOperatorSetupDialog } from "@/features/platform-admin/PlatformOperatorSetupDialog";
import { ProvisionInviteDialog } from "@/features/platform-admin/ProvisionInviteDialog";
import { PlatformWorkspacesTable } from "@/features/platform-admin/PlatformWorkspacesTable";
import { ArrowUpRight01Icon, ProfileIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import Link from "next/link";

export default function PlatformAdminDashboardPage() {
  return (
    <PlatformAdminGuard>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlatformAdminHeader
          title="Platform admin"
          tooltip="Manage workspaces, billing, and platform activity."
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
              <PlatformOperatorSetupDialog />
              <ProvisionInviteDialog />
            </>
          }
        />
        <PlatformAdminNav />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <PlatformSummaryCards />
          <div className="p-2">
            <PlatformWorkspacesTable
              headerActions={
                <Button asChild size="sm" variant="secondary">
                  <Link href="/platform-admin/workspaces">
                    Show all
                    <Icon icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
                  </Link>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
