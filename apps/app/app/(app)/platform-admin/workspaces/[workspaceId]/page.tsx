"use client";

import { useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  AlertCircleIcon,
  TimelineEventIcon,
  DashboardBrowsingIcon,
  Invoice01Icon,
  Wallet01Icon,
  NewOfficeIcon,
  ProfileIcon,
  Timer01Icon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminHeader } from "@/features/platform-admin/PlatformAdminHeader";
import { PlatformAuditLogsSheet } from "@/features/platform-admin/PlatformAuditLogsSheet";
import {
  PlatformBillingChargebeeTab,
  PlatformBillingOverviewSection,
  PlatformBillingUsageSection,
} from "@/features/platform-admin/PlatformBillingSection";
import { WorkspaceAdminInviteDialog } from "@/features/platform-admin/WorkspaceAdminInviteDialog";
import { WorkspaceStatsRow } from "@/features/platform-admin/WorkspaceStatsRow";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import type { PlatformWorkspaceAdmin } from "@/types/platform-admin";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import Link from "next/link";

const WORKSPACE_TABS = ["overview", "usage", "chargebee", "admins"] as const;
type WorkspaceTab = (typeof WORKSPACE_TABS)[number];

function isWorkspaceTab(value: string | null): value is WorkspaceTab {
  return (
    value !== null && (WORKSPACE_TABS as readonly string[]).includes(value)
  );
}

function WorkspaceDetailErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 py-10">
      <div className="flex size-10 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
        <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
      </div>
      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          We couldn&apos;t load the workspace details
        </p>
        <p className="text-sm text-muted-foreground">
          Please try again in a moment
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function WorkspaceAdminsTab({ admins }: { admins: PlatformWorkspaceAdmin[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <p className="text-sm font-medium">Organization admins</p>
        <InfoTooltip content="Users who can manage this workspace." />
      </div>
      <div className="overflow-hidden border-b border-border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            <TableRow className="h-10 hover:bg-transparent">
              <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
                Name
              </TableHead>
              <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
                Email
              </TableHead>
              <TableHead className="h-10 border-r border-border text-xs font-medium text-muted-foreground/60 last:border-r-0">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length ? (
              admins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {admin.name || "—"}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="capitalize text-sm text-muted-foreground">
                    {admin.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icon
                      icon={NewOfficeIcon}
                      size={24}
                      strokeWidth={2}
                      className="text-muted-foreground/30"
                    />
                    <p className="text-sm">
                      No organization admins yet. Use invite to add one.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function PlatformAdminWorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError, refetch } =
    useGetPlatformWorkspaceDetail(workspaceId);
  const hasLoadError = !isLoading && (isError || !data);

  const tabParam = searchParams.get("tab");
  const activeTab: WorkspaceTab = isWorkspaceTab(tabParam)
    ? tabParam
    : "overview";
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [syncedActiveTab, setSyncedActiveTab] = useState(activeTab);

  if (activeTab !== syncedActiveTab) {
    setSyncedActiveTab(activeTab);
    setPendingTab(null);
  }

  const tabValue = pendingTab ?? activeTab;

  const handleTabChange = (value: string) => {
    const nextTab = isWorkspaceTab(value) ? value : "overview";
    const nextParams = new URLSearchParams(searchParams.toString());
    setPendingTab(nextTab);
    nextParams.set("tab", nextTab);
    const next = nextParams.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  const title = isLoading
    ? "Workspace"
    : (data?.workspace.workspaceName ?? "Workspace");

  return (
    <PlatformAdminGuard>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlatformAdminHeader
          title={title}
          tooltip={
            data?.workspace.companyName
              ? `${data.workspace.companyName}`
              : "Inspect billing, admins, and activity for this workspace."
          }
          actions={
            !hasLoadError && workspaceId ? (
              <>
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
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/platform-admin/workspaces/${workspaceId}/usage-events`}
                  >
                    <Icon icon={TimelineEventIcon} size={14} strokeWidth={2} />
                    Usage events
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/platform-admin/workspaces/${workspaceId}/invoices`}
                  >
                    <Icon icon={Invoice01Icon} size={14} strokeWidth={2} />
                    Invoices
                  </Link>
                </Button>
                <WorkspaceAdminInviteDialog workspaceId={workspaceId} />
              </>
            ) : null
          }
        />

        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : hasLoadError ? (
          <div className="p-2">
            <WorkspaceDetailErrorState onRetry={() => refetch()} />
          </div>
        ) : (
          <Tabs
            value={tabValue}
            onValueChange={handleTabChange}
            className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
          >
            <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
              <TabsList variant="line">
                <TabsTrigger value="overview">
                  <Icon
                    icon={DashboardBrowsingIcon}
                    size={14}
                    strokeWidth={2}
                  />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="usage">
                  <Icon icon={Timer01Icon} size={14} strokeWidth={2} />
                  Usage
                </TabsTrigger>
                <TabsTrigger value="chargebee">
                  <Icon icon={Wallet01Icon} size={14} strokeWidth={2} />
                  Chargebee
                </TabsTrigger>
                <TabsTrigger value="admins">
                  <Icon icon={UserShield01Icon} size={14} strokeWidth={2} />
                  Admins
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <TabsContent value="overview" className="mt-0">
                {activeTab === "overview" ? (
                  <>
                    <WorkspaceStatsRow
                      members={data?.counts.members ?? 0}
                      active={data?.counts.activeMembers ?? 0}
                      invited={data?.counts.invitedMembers ?? 0}
                      billing={
                        data?.billing ?? {
                          status: "not_set",
                          limitsEnabled: null,
                          billingCadence: null,
                          currency: null,
                          pastDue: null,
                        }
                      }
                    />
                    <div className="flex flex-col gap-2 p-2">
                      <PlatformBillingOverviewSection
                        workspaceId={workspaceId}
                        billingStatus={data?.billing.status}
                      />
                    </div>
                  </>
                ) : null}
              </TabsContent>

              <TabsContent value="usage" className="mt-0 p-2">
                {activeTab === "usage" ? (
                  <PlatformBillingUsageSection
                    workspaceId={workspaceId}
                    billingStatus={data?.billing.status}
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="chargebee" className="mt-0 p-2">
                {activeTab === "chargebee" ? (
                  <PlatformBillingChargebeeTab
                    workspaceId={workspaceId}
                    billingStatus={data?.billing.status}
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="admins" className="mt-0 p-2">
                {activeTab === "admins" ? (
                  <WorkspaceAdminsTab admins={data?.admins ?? []} />
                ) : null}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </PlatformAdminGuard>
  );
}
