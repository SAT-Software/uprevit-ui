"use client";

import { useGetPlatformSummary } from "@/hooks/platform-admin/useGetPlatformSummary";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function PlatformSummaryCards() {
  const { data, isLoading } = useGetPlatformSummary();

  if (isLoading) {
    return (
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Workspaces" value={data?.totalWorkspaces ?? 0} />
      <StatCard label="Active users" value={data?.activeUsers ?? 0} />
      <StatCard label="Invited users" value={data?.invitedUsers ?? 0} />
      <StatCard label="Workspace admins" value={data?.workspaceAdmins ?? 0} />
    </div>
  );
}
