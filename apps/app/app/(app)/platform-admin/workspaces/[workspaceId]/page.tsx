"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  PiBuildingsDuotone,
  PiClockDuotone,
  PiUsersDuotone,
  PiUserCheckDuotone,
  PiUserPlusDuotone,
  PiCreditCardDuotone,
  PiArrowLeftDuotone,
  PiListChecksDuotone,
  PiReceiptDuotone,
} from "react-icons/pi";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { PlatformBillingSection } from "@/features/platform-admin/PlatformBillingSection";
import { WorkspaceAdminInviteDialog } from "@/features/platform-admin/WorkspaceAdminInviteDialog";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { getBillingStatusLabel } from "@/utils/billingStatusDisplay";
import type { WorkspaceBillingPreview } from "@/types/platform-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";

function WorkspaceDetailErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-10 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
        <PiBuildingsDuotone className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-destructive">
          We couldn&apos;t load the workspace details
        </p>
        <p className="text-xs text-muted-foreground">Please try again in a moment</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
        Try again
      </Button>
    </div>
  );
}

function BillingStatusDisplay({ billing }: { billing: WorkspaceBillingPreview }) {
  const label = getBillingStatusLabel(billing.status, billing.pastDue);
  const isPastDue = billing.pastDue || billing.status === "past_due";

  return (
    <div
      className={`text-2xl font-semibold tabular-nums capitalize ${
        isPastDue ? "text-destructive" : billing.status === "not_set" ? "text-muted-foreground" : "text-primary"
      }`}
    >
      {label}
    </div>
  );
}

function WorkspaceStatsRow({
  members,
  active,
  invited,
  billing,
}: {
  members: number;
  active: number;
  invited: number;
  billing: WorkspaceBillingPreview;
}) {
  const items = [
    { label: "Total members", value: members, icon: PiUsersDuotone, isBilling: false },
    { label: "Active now", value: active, icon: PiUserCheckDuotone, isBilling: false },
    { label: "Pending invites", value: invited, icon: PiUserPlusDuotone, isBilling: false },
    { label: "Billing status", value: null, icon: PiCreditCardDuotone, isBilling: true },
  ];

  return (
    <div className="grid grid-cols-2 border border-border rounded-xl bg-linear-to-br from-background/90 to-background min-[900px]:grid-cols-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="relative flex w-full items-center gap-4 p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-linear-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden"
          >
            <div className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-border bg-accent/80 text-accent-foreground sm:flex">
              <Icon className="size-4.5" />
            </div>
            <div>
              <div className="font-medium text-xs uppercase text-muted-foreground">
                {item.label}
              </div>
              {item.isBilling ? (
                <BillingStatusDisplay billing={billing} />
              ) : (
                <div className="text-2xl font-semibold tabular-nums">{item.value}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PlatformAdminWorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const { data, isLoading, isError, refetch } =
    useGetPlatformWorkspaceDetail(workspaceId);
  const hasLoadError = !isLoading && (isError || !data);

  return (
    <PlatformAdminGuard>
      <div className="flex flex-col gap-4 p-2">
        {/* Workspace context header */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mb-1 -ml-2 h-8 gap-1.5 px-2 text-muted-foreground"
              >
                <Link href="/platform-admin/workspaces">
                  <PiArrowLeftDuotone className="h-4 w-4" />
                  All workspaces
                </Link>
              </Button>

              {isLoading ? (
                <Skeleton className="h-8 w-56" />
              ) : hasLoadError ? (
                <div>
                  <h1 className="text-base font-semibold">Workspace</h1>
                  <p className="text-sm text-muted-foreground">Unable to load details</p>
                </div>
              ) : data ? (
                <div>
                  <h1 className="text-base font-semibold truncate">
                    {data.workspace.workspaceName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {data.workspace.companyName}
                  </p>
                </div>
              ) : null}

              <div className="mt-3">
                <PlatformAdminNav />
              </div>
            </div>

            {!hasLoadError && workspaceId ? (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button asChild size="sm" variant="secondary" className="gap-2">
                  <Link href={`/platform-admin/workspaces/${workspaceId}/logs`}>
                    <PiClockDuotone className="h-4 w-4" />
                    View logs
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary" className="gap-2">
                  <Link href={`/platform-admin/workspaces/${workspaceId}/usage-events`}>
                    <PiListChecksDuotone className="h-4 w-4" />
                    Usage events
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary" className="gap-2">
                  <Link href={`/platform-admin/workspaces/${workspaceId}/invoices`}>
                    <PiReceiptDuotone className="h-4 w-4" />
                    Invoices
                  </Link>
                </Button>
                <WorkspaceAdminInviteDialog workspaceId={workspaceId} />
              </div>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : hasLoadError ? (
          <WorkspaceDetailErrorState onRetry={() => refetch()} />
        ) : (
          <>
            {/* At-a-glance stats — clean grouped row */}
            <WorkspaceStatsRow
              members={data?.counts.members ?? 0}
              active={data?.counts.activeMembers ?? 0}
              invited={data?.counts.invitedMembers ?? 0}
              billing={data?.billing ?? { status: "not_set", limitsEnabled: null, billingCadence: null, currency: null, pastDue: null }}
            />

            {/* Billing & freezes & operations — the heavy section, improved internally */}
            <PlatformBillingSection
              workspaceId={workspaceId}
              billingStatus={data?.billing.status}
            />

            {/* Workspace admins table — wrapped cleanly like other tables */}
            <div className="border border-border bg-background rounded-xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-semibold">Organization admins</p>
                <div className="w-1 h-1 bg-border border border-border rounded-full" />
                <p className="text-xs text-muted-foreground">
                  Users who can manage this workspace
                </p>
              </div>
              <div className="bg-background overflow-hidden rounded-xl border">
                <Table className="table-fixed">
                  <TableHeader className="bg-muted">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-11 border-r border-border last:border-r-0">Name</TableHead>
                      <TableHead className="h-11 border-r border-border last:border-r-0">Email</TableHead>
                      <TableHead className="h-11 border-r border-border last:border-r-0">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.admins ?? []).length ? (
                      data?.admins.map((admin) => (
                        <TableRow key={admin.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{admin.name || "—"}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell className="capitalize text-sm text-muted-foreground">{admin.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-20 text-center text-sm text-muted-foreground">
                          No organization admins yet. Use the invite button above to add one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </PlatformAdminGuard>
  );
}
