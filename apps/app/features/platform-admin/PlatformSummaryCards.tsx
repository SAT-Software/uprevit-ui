"use client";

import { useGetPlatformSummary } from "@/hooks/platform-admin/useGetPlatformSummary";
import {
  PiBuildingsDuotone,
  PiUsersDuotone,
  PiUserPlusDuotone,
  PiUserGearDuotone,
  PiCreditCardDuotone,
  PiGaugeDuotone,
} from "react-icons/pi";

interface PlatformStat {
  id: string;
  title: string;
  value: number | string;
  icon: React.ElementType;
  hint?: string;
}

function PlatformStatCard({ title, value, icon: Icon, hint }: Omit<PlatformStat, "id">) {
  return (
    <div className="relative flex w-full items-center justify-between p-4 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-linear-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-accent/80 text-accent-foreground sm:flex">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="font-medium text-xs uppercase text-muted-foreground">
            {title}
          </div>
          <div className="text-2xl font-semibold tabular-nums">{value}</div>
          {hint ? (
            <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PlatformStatCardSkeleton({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="relative flex w-full items-center justify-between p-4 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-linear-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-accent/80 text-accent-foreground sm:flex">
          <Icon className="size-5 animate-pulse" />
        </div>
        <div>
          <div className="font-medium text-xs uppercase text-muted-foreground">
            {title}
          </div>
          <div className="h-8 w-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function PlatformSummaryCards() {
  const { data, isLoading } = useGetPlatformSummary();

  const stats: PlatformStat[] = [
    {
      id: "workspaces",
      title: "Workspaces",
      value: data?.totalWorkspaces ?? 0,
      icon: PiBuildingsDuotone,
    },
    {
      id: "active",
      title: "Active users",
      value: data?.activeUsers ?? 0,
      icon: PiUsersDuotone,
    },
    {
      id: "invited",
      title: "Invited users",
      value: data?.invitedUsers ?? 0,
      icon: PiUserPlusDuotone,
    },
    {
      id: "admins",
      title: "Workspace admins",
      value: data?.workspaceAdmins ?? 0,
      icon: PiUserGearDuotone,
    },
    {
      id: "billing",
      title: "Billing accounts",
      value: data?.billing.accountsLinked ?? 0,
      icon: PiCreditCardDuotone,
    },
    {
      id: "limits",
      title: "Limits enabled",
      value: data?.billing.limitsEnabledWorkspaces ?? 0,
      icon: PiGaugeDuotone,
      hint: data ? `${data.billing.pastDueWorkspaces ?? 0} past due` : undefined,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 border border-border rounded-xl bg-linear-to-br from-background/90 to-background min-[1200px]:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat) => (
          <PlatformStatCardSkeleton key={stat.id} title={stat.title} icon={stat.icon} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 border border-border rounded-xl bg-linear-to-br from-background/90 to-background min-[1200px]:grid-cols-3 2xl:grid-cols-6">
      {stats.map(({ id, ...stat }) => (
        <PlatformStatCard key={id} {...stat} />
      ))}
    </div>
  );
}
