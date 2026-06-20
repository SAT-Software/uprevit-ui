"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PiArrowLeftDuotone, PiClockDuotone } from "react-icons/pi";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformAuditLogsTable } from "@/features/platform-admin/PlatformAuditLogsTable";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export default function PlatformAdminWorkspaceLogsPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const { data, isLoading, isError } = useGetPlatformWorkspaceDetail(workspaceId);

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        {/* Context header for the workspace logs view */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mb-1 -ml-2 h-8 gap-1.5 px-2 text-muted-foreground"
              >
                <Link href={`/platform-admin/workspaces/${workspaceId}`}>
                  <PiArrowLeftDuotone className="h-4 w-4" />
                  Back to workspace
                </Link>
              </Button>

              {isLoading ? (
                <Skeleton className="h-8 w-56" />
              ) : (
                <div>
                  <h1 className="text-base font-semibold">
                    {data?.workspace.workspaceName ?? "Workspace activity"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isError || !data
                      ? "Audit events for this workspace"
                      : `${data.workspace.companyName} · Recent admin and system activity`}
                  </p>
                </div>
              )}

              <div className="mt-3">
                <PlatformAdminNav />
              </div>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-2 shrink-0">
              <Link href={`/platform-admin/audit-logs?workspaceId=${workspaceId}`}>
                <PiClockDuotone className="h-4 w-4" />
                All platform logs
              </Link>
            </Button>
          </div>
        </div>

        {/* Logs table (the table itself is intentionally kept as-is per requirements) */}
        <div className="border border-border bg-background rounded-xl p-5">
          <PlatformAuditLogsTable workspaceId={workspaceId} hideWorkspaceFilter />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
