"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PiBuildingsDuotone } from "react-icons/pi";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminNav } from "@/features/platform-admin/PlatformAdminNav";
import { WorkspaceAdminInviteDialog } from "@/features/platform-admin/WorkspaceAdminInviteDialog";
import { useGetPlatformWorkspaceDetail } from "@/hooks/platform-admin/useGetPlatformWorkspaceDetail";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
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
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
        <PiBuildingsDuotone className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-destructive">
          We couldn&apos;t load the platform workspace detail
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
        Try Again
      </Button>
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
      <div className="flex flex-col gap-2 p-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : hasLoadError ? (
                <>
                  <h1 className="text-base font-semibold">Workspace</h1>
                  <p className="text-sm text-muted-foreground">
                    Platform workspace detail
                  </p>
                </>
              ) : data ? (
                <>
                  <h1 className="text-base font-semibold">
                    {data.workspace.workspaceName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {data.workspace.companyName}
                  </p>
                </>
              ) : null}
              <div className="mt-3">
                <PlatformAdminNav />
              </div>
            </div>
            {!hasLoadError && workspaceId ? (
              <WorkspaceAdminInviteDialog workspaceId={workspaceId} />
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : hasLoadError ? (
          <WorkspaceDetailErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-2xl font-semibold">{data?.counts.members ?? 0}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold">
                  {data?.counts.activeMembers ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Invited</p>
                <p className="text-2xl font-semibold">
                  {data?.counts.invitedMembers ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Billing</p>
                <p className="text-2xl font-semibold">Not set</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <h2 className="mb-3 text-sm font-semibold">Workspace admins</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent platform audit events</h2>
                <Link
                  href={`/platform-admin/audit-logs?workspaceId=${workspaceId}`}
                  className="text-xs text-primary hover:underline"
                >
                  All logs
                </Link>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.recentAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(log.occurredAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">{log.action}</TableCell>
                      <TableCell>{log.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </PlatformAdminGuard>
  );
}
