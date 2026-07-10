"use client";

import { useState, type ReactNode } from "react";
import { useCreateChargebeeCustomer } from "@/hooks/platform-admin/useCreateChargebeeCustomer";
import { useLinkChargebeeSubscription } from "@/hooks/platform-admin/useLinkChargebeeSubscription";
import { useRetryUsageEventSync } from "@/hooks/platform-admin/useRetryUsageEventSync";
import type { BillingAccount } from "@/types/billing";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import {
  AlertCircleIcon,
  IdVerifiedIcon,
  Link01Icon,
  Refresh01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import type { IconProps } from "@uprevit/ui/components/common/Icon";

function fieldCellClassName() {
  return cn(
    "group flex items-start gap-4 p-4",
    "border-b border-border last:border-b-0",
    "md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(odd)]:border-r",
  );
}

function ChargebeeFieldCell({
  icon,
  label,
  tooltip,
  value,
  mono,
}: {
  icon: IconProps["icon"];
  label: string;
  tooltip?: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className={fieldCellClassName()}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground">
        <Icon icon={icon} size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-normal text-muted-foreground/60">
            {label}
          </p>
          {tooltip ? <InfoTooltip content={tooltip} /> : null}
        </div>
        <div
          className={cn(
            "truncate text-sm font-medium text-foreground",
            mono && "font-mono text-xs",
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export function PlatformChargebeeSection({
  workspaceId,
  account,
  failedUsageEventSyncCount,
}: {
  workspaceId: string;
  account: BillingAccount;
  failedUsageEventSyncCount: number;
}) {
  const [subscriptionId, setSubscriptionId] = useState("");
  const createCustomer = useCreateChargebeeCustomer(workspaceId);
  const linkSubscription = useLinkChargebeeSubscription(workspaceId);
  const { retryAll } = useRetryUsageEventSync(workspaceId);

  const customerId = account.chargebee?.customerId;
  const linkedSubscriptionId = account.chargebee?.subscriptionId;
  const isLinked = Boolean(linkedSubscriptionId);
  const hasFailedSyncs = failedUsageEventSyncCount > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Chargebee</p>
          <InfoTooltip content="Customer and subscription linkage used for invoicing and usage sync." />
          <Badge variant={isLinked ? "green" : "outline"}>
            {isLinked ? "Linked" : "Not linked"}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => retryAll.mutate()}
          disabled={retryAll.isPending || !isLinked}
        >
          <Icon icon={Refresh01Icon} size={14} strokeWidth={2} />
          {retryAll.isPending ? "Retrying…" : "Retry failed syncs"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <ChargebeeFieldCell
          icon={UserAccountIcon}
          label="Customer ID"
          tooltip="Chargebee customer created for this workspace."
          value={customerId ?? "—"}
          mono={Boolean(customerId)}
        />
        <ChargebeeFieldCell
          icon={IdVerifiedIcon}
          label="Subscription ID"
          tooltip="Linked Chargebee subscription that drives billing period and invoices."
          value={linkedSubscriptionId ?? "—"}
          mono={Boolean(linkedSubscriptionId)}
        />
        <ChargebeeFieldCell
          icon={AlertCircleIcon}
          label="Failed / pending syncs"
          tooltip="Usage events that failed to sync to Chargebee and can be retried."
          value={
            <span className={cn(hasFailedSyncs && "text-destructive")}>
              {failedUsageEventSyncCount}
            </span>
          }
        />
        <div className={fieldCellClassName()}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
            <Icon icon={Link01Icon} size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {!customerId ? (
              <>
                <div className="space-y-0.5">
                  <p className="text-sm font-normal text-muted-foreground/60">
                    Setup
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create a Chargebee customer before linking a subscription.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => createCustomer.mutate({})}
                  disabled={createCustomer.isPending}
                >
                  {createCustomer.isPending ? "Creating…" : "Create customer"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-0.5">
                  <Label
                    htmlFor="subscription-id"
                    className="text-sm font-normal text-muted-foreground/60"
                  >
                    Link subscription
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Paste a Chargebee subscription ID to connect this workspace.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    id="subscription-id"
                    value={subscriptionId}
                    onChange={(event) => setSubscriptionId(event.target.value)}
                    placeholder="sub_..."
                    className="h-9 font-mono text-xs"
                    disabled={linkSubscription.isPending}
                  />
                  <Button
                    size="sm"
                    className="shrink-0"
                    onClick={() =>
                      linkSubscription.mutate({
                        subscriptionId: subscriptionId.trim(),
                      })
                    }
                    disabled={
                      !subscriptionId.trim() || linkSubscription.isPending
                    }
                  >
                    {linkSubscription.isPending
                      ? "Linking…"
                      : "Link subscription"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
