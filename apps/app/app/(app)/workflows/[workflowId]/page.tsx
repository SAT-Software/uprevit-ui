"use client";

import { useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Blockchain03Icon,
  DashboardSquare01Icon,
  Delete02Icon,
  ValidationApprovalIcon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { DeleteWorkflowDialog } from "@/features/workspace/workflows/DeleteWorkflowDialog";
import { WorkflowApprovalsTab } from "@/features/workspace/workflows/WorkflowApprovalsTab";
import { WorkflowProductsTab } from "@/features/workspace/workflows/WorkflowProductsTab";
import { WorkflowStatusBadge } from "@/features/workspace/workflows/WorkflowStatusBadge";
import { WorkflowSummaryTab } from "@/features/workspace/workflows/WorkflowSummaryTab";
import { WorkflowsFeatureGate } from "@/features/workspace/workflows/WorkflowsFeatureGate";
import { useWorkflow } from "@/hooks/workflow/useWorkflows";

const WORKFLOW_TABS = ["summary", "products", "approvals"] as const;
type WorkflowTab = (typeof WORKFLOW_TABS)[number];

function WorkflowDetail() {
  const params = useParams<{ workflowId: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data, isPending, isError, error } = useWorkflow(params.workflowId);
  const workflow = data?.workflow;

  const tabParam = searchParams.get("tab");
  const activeTab: WorkflowTab = WORKFLOW_TABS.includes(tabParam as WorkflowTab)
    ? (tabParam as WorkflowTab)
    : "summary";

  const handleTabChange = (value: string) => {
    router.replace(
      value === "summary" ? pathname : `${pathname}?tab=${value}`,
    );
  };

  if (isPending) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !workflow) {
    return (
      <DashboardErrorState
        variant="panel"
        icon={WorkflowIcon}
        title="Failed to load workflow"
        description={error?.message}
        className="m-4"
      />
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-sm text-muted-foreground">
            {workflow.numberLabel}
          </span>
          <p className="truncate text-sm font-medium">{workflow.name}</p>
          <WorkflowStatusBadge status={workflow.status} />
        </div>
        {workflow.canEdit ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Icon icon={Delete02Icon} size={16} />
            Delete Draft
          </Button>
        ) : null}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
      >
        <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
          <TabsList variant="line">
            <TabsTrigger value="summary">
              <Icon icon={DashboardSquare01Icon} size={14} strokeWidth={2} />
              Summary
            </TabsTrigger>
            <TabsTrigger value="products">
              <Icon icon={Blockchain03Icon} size={14} strokeWidth={2} />
              Products
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-none tabular-nums text-muted-foreground">
                {workflow.products.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approvals">
              <Icon icon={ValidationApprovalIcon} size={14} strokeWidth={2} />
              Approvals
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-none tabular-nums text-muted-foreground">
                {workflow.assignments.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl p-4">
            <TabsContent value="summary">
              <WorkflowSummaryTab workflow={workflow} />
            </TabsContent>
            <TabsContent value="products">
              <WorkflowProductsTab workflow={workflow} />
            </TabsContent>
            <TabsContent value="approvals">
              <WorkflowApprovalsTab workflow={workflow} />
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {workflow.canEdit ? (
        <DeleteWorkflowDialog
          workflow={workflow}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      ) : null}
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <WorkflowsFeatureGate>
      <WorkflowDetail />
    </WorkflowsFeatureGate>
  );
}
