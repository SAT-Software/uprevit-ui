"use client";

import { WorkflowIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";

export function WorkflowsFeatureGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending, isError } = useGetWorkspace();

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <DashboardErrorState
        variant="panel"
        icon={WorkflowIcon}
        title="Failed to load workspace"
        className="m-4"
      />
    );
  }

  if (data?.workspace?.approvalWorkflowsEnabled !== true) {
    return (
      <div className="m-4 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center">
        <div className="flex items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm">
          <Icon icon={WorkflowIcon} className="text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Approval workflows are off</p>
          <p className="text-xs text-muted-foreground">
            They are not enabled for this workspace yet.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
