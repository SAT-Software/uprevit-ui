"use client";

import { useParams } from "next/navigation";
import { ProfileIcon } from "@hugeicons/core-free-icons";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAuditLogsSheet } from "@/features/platform-admin/PlatformAuditLogsSheet";
import { PlatformUsageEventsTable } from "@/features/platform-admin/PlatformUsageEventsTable";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";

export default function PlatformAdminWorkspaceUsageEventsPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const { data, isLoading, isError } =
    useGetPlatformWorkspaceDetail(workspaceId);

  const title = isLoading
    ? "Usage events"
    : (data?.workspace.workspaceName ?? "Usage events");

  const tooltip =
    isError || !data
      ? "Ledger entries from exports, uploads, and adjustments."
      : `${data.workspace.companyName} · Chargebee sync status for usage events.`;

  return (
    <PlatformAdminGuard>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlatformAdminHeader
          title={title}
          tooltip={tooltip}
          actions={
            <PlatformAuditLogsSheet
              workspaceId={workspaceId}
              title="Workspace audit logs"
              tooltip="Admin and system activity for this workspace."
              trigger={
                <Button type="button" variant="outline" size="sm">
                  <Icon icon={ProfileIcon} size={16} strokeWidth={2} />
                  Logs
                </Button>
              }
            />
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <PlatformUsageEventsTable workspaceId={workspaceId} />
          </div>
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
