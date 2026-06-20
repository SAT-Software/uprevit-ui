"use client";

import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformSummaryCards } from "@/features/platform-admin/PlatformSummaryCards";
import { PlatformOperatorSetupDialog } from "@/features/platform-admin/PlatformOperatorSetupDialog";
import { ProvisionInviteDialog } from "@/features/platform-admin/ProvisionInviteDialog";
import { PlatformWorkspacesTable } from "@/features/platform-admin/PlatformWorkspacesTable";
import Link from "next/link";
import { Button } from "@uprevit/ui/components/ui/button";
import { PiArrowCircleUpRightDuotone } from "react-icons/pi";

export default function PlatformAdminDashboardPage() {
  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        <PlatformAdminHeader
          title="Platform overview"
          subtitle="Manage workspaces, billing, and platform activity"
          actions={
            <>
              <PlatformOperatorSetupDialog />
              <ProvisionInviteDialog />
            </>
          }
        >
          <PlatformAdminNav />
        </PlatformAdminHeader>

        <PlatformSummaryCards />

        <div className="flex w-full flex-col items-start justify-start gap-4 rounded-xl border border-border bg-background p-5">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Workspaces</p>
              <div className="hidden h-1 w-1 rounded-full border border-border bg-border sm:block" />
              <p className="hidden text-xs font-medium text-muted-foreground sm:block">
                Search, inspect, and open any organization workspace
              </p>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link href="/platform-admin/workspaces" className="gap-1.5">
                <PiArrowCircleUpRightDuotone />
                View all
              </Link>
            </Button>
          </div>
          <div className="w-full">
            <PlatformWorkspacesTable />
          </div>
        </div>
      </div>
    </PlatformAdminGuard>
  );
}
