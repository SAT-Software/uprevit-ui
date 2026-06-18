"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PiArrowLeftDuotone, PiClockDuotone, PiListChecksDuotone } from "react-icons/pi";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformUsageEventsTable } from "@/features/platform-admin/PlatformUsageEventsTable";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export default function PlatformAdminWorkspaceUsageEventsPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const { data, isLoading, isError } = useGetPlatformWorkspaceDetail(workspaceId);

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
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
                    {data?.workspace.workspaceName ?? "Workspace usage events"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isError || !data
                      ? "Ledger entries from exports, uploads, and adjustments"
                      : `${data.workspace.companyName} · Chargebee sync status for usage events`}
                  </p>
                </div>
              )}

              <div className="mt-3">
                <PlatformAdminNav />
              </div>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-2 shrink-0">
              <Link href={`/platform-admin/workspaces/${workspaceId}/logs`}>
                <PiClockDuotone className="h-4 w-4" />
                View logs
              </Link>
            </Button>
          </div>
        </div>

        <div className="border border-border bg-background rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <PiListChecksDuotone className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Usage events</p>
            <div className="h-1 w-1 rounded-full border border-border bg-border" />
            <p className="text-xs text-muted-foreground">
              Exports, uploads, seat activations, and manual adjustments
            </p>
          </div>
          <PlatformUsageEventsTable workspaceId={workspaceId} />
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
