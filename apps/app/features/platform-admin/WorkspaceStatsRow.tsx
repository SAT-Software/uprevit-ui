"use client";

import type { IconProps } from "@uprevit/ui/components/common/Icon";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { getBillingStatusLabel } from "@/utils/billingStatusDisplay";
import type { WorkspaceBillingPreview } from "@/types/platform-admin";
import {
  CreditCardIcon,
  UserQuestion01Icon,
  UserCheck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

function BillingStatusDisplay({
  billing,
}: {
  billing: WorkspaceBillingPreview;
}) {
  const label = getBillingStatusLabel(billing.status, billing.pastDue);
  const isPastDue = billing.pastDue || billing.status === "past_due";

  return (
    <p
      className={cn(
        "text-2xl font-semibold capitalize tabular-nums",
        isPastDue
          ? "text-destructive"
          : billing.status === "not_set"
            ? "text-muted-foreground"
            : "text-foreground",
      )}
    >
      {label}
    </p>
  );
}

export function WorkspaceStatsRow({
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
  const items: Array<{
    label: string;
    value: number | null;
    icon: IconProps["icon"];
    isBilling?: boolean;
  }> = [
    {
      label: "Total users",
      value: members,
      icon: UserGroupIcon,
    },
    {
      label: "Active users",
      value: active,
      icon: UserCheck01Icon,
    },
    {
      label: "Pending invites",
      value: invited,
      icon: UserQuestion01Icon,
    },
    {
      label: "Billing status",
      value: null,
      icon: CreditCardIcon,
      isBilling: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 border-b border-border min-[900px]:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="relative group flex w-full items-center justify-between p-4 before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-border last:before:hidden"
        >
          <div className="relative flex items-center gap-4">
            <div
              className={cn(
                "hidden size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-accent-foreground/60 sm:flex",
                "transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground",
              )}
            >
              <Icon
                className="text-muted-foreground/60 group-hover:text-muted-foreground"
                icon={item.icon}
                size={16}
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="text-sm font-normal text-muted-foreground/60">
                {item.label}
              </p>
              {item.isBilling ? (
                <BillingStatusDisplay billing={billing} />
              ) : (
                <p className="text-2xl font-semibold tabular-nums">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
