"use client";

import { useState } from "react";
import { useCreateChargebeeCustomer } from "@/hooks/platform-admin/useCreateChargebeeCustomer";
import { useLinkChargebeeSubscription } from "@/hooks/platform-admin/useLinkChargebeeSubscription";
import { useRetryUsageEventSync } from "@/hooks/platform-admin/useRetryUsageEventSync";
import type { BillingAccount } from "@/types/billing";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";

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

  return (
    <section className="space-y-4 rounded-xl border border-border bg-background p-5">
      <div>
        <h2 className="text-sm font-semibold">Chargebee</h2>
        <p className="mt-0.5 text-xs text-muted-foreground max-w-prose">
          Link a customer and subscription, then retry failed usage event syncs.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Connection</span>
            <Badge variant={isLinked ? "default" : "secondary"}>
              {isLinked ? "Linked" : "Not linked"}
            </Badge>
          </div>
          <dl className="space-y-1 text-xs">
            <div>
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="font-mono">{customerId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subscription</dt>
              <dd className="font-mono">{linkedSubscriptionId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Failed / pending syncs</dt>
              <dd>{failedUsageEventSyncCount}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border p-4 space-y-3">
          {!customerId ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Create a Chargebee customer for this workspace before linking a subscription.
              </p>
              <Button
                size="sm"
                onClick={() => createCustomer.mutate({})}
                disabled={createCustomer.isPending}
              >
                {createCustomer.isPending ? "Creating…" : "Create customer"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="subscription-id">Subscription ID</Label>
                <Input
                  id="subscription-id"
                  value={subscriptionId}
                  onChange={(event) => setSubscriptionId(event.target.value)}
                  placeholder="sub_..."
                  disabled={linkSubscription.isPending}
                />
              </div>
              <Button
                size="sm"
                onClick={() =>
                  linkSubscription.mutate({ subscriptionId: subscriptionId.trim() })
                }
                disabled={!subscriptionId.trim() || linkSubscription.isPending}
              >
                {linkSubscription.isPending ? "Linking…" : "Link subscription"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => retryAll.mutate()}
          disabled={retryAll.isPending || !isLinked}
        >
          {retryAll.isPending ? "Retrying…" : "Retry failed syncs"}
        </Button>
      </div>
    </section>
  );
}
