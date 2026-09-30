"use client";

import { WorkflowSquare03Icon } from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useUpdatePlatformWorkspaceFeatures } from "@/hooks/platform-admin/useUpdatePlatformWorkspaceFeatures";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Label } from "@uprevit/ui/components/ui/label";
import { Switch } from "@uprevit/ui/components/ui/switch";

export function PlatformWorkspaceFeaturesCard({
  workspaceId,
  approvalWorkflowsEnabled,
}: {
  workspaceId: string;
  approvalWorkflowsEnabled: boolean;
}) {
  const { mutate, isPending } =
    useUpdatePlatformWorkspaceFeatures(workspaceId);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <p className="text-sm font-medium">Workspace features</p>
        <InfoTooltip content="Features that are rolled out to this workspace ahead of general availability." />
      </div>
      <div className="flex items-center gap-4 p-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
          <Icon icon={WorkflowSquare03Icon} size={18} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <Label htmlFor="approval-workflows" className="text-sm font-medium">
            Approval workflows
          </Label>
          <p className="text-xs text-muted-foreground">
            When on, submitting a product marks it ready for approval instead
            of releasing it immediately.
          </p>
        </div>
        <Switch
          id="approval-workflows"
          checked={approvalWorkflowsEnabled}
          disabled={isPending}
          onCheckedChange={(checked) =>
            mutate({ approvalWorkflowsEnabled: checked })
          }
        />
      </div>
    </section>
  );
}
