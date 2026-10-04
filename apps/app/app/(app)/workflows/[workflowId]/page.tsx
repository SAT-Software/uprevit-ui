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
  BubbleChatIcon,
  CheckmarkBadge01Icon,
  DashboardSquare01Icon,
  Delete02Icon,
  StopCircleIcon,
  ValidationApprovalIcon,
  WorkHistoryIcon,
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
import { CancelWorkflowDialog } from "@/features/workspace/workflows/CancelWorkflowDialog";
import { CompleteWorkflowDialog } from "@/features/workspace/workflows/CompleteWorkflowDialog";
import { DeleteWorkflowDialog } from "@/features/workspace/workflows/DeleteWorkflowDialog";
import { WorkflowApprovalsTab } from "@/features/workspace/workflows/WorkflowApprovalsTab";
import { WorkflowDiscussionTab } from "@/features/workspace/workflows/WorkflowDiscussionTab";
import { WorkflowHistoryTab } from "@/features/workspace/workflows/WorkflowHistoryTab";
import { WorkflowProductsTab } from "@/features/workspace/workflows/WorkflowProductsTab";
import { WorkflowStatusBadge } from "@/features/workspace/workflows/WorkflowStatusBadge";
import { WorkflowSummaryTab } from "@/features/workspace/workflows/WorkflowSummaryTab";
import { WorkflowsFeatureGate } from "@/features/workspace/workflows/WorkflowsFeatureGate";
import { useWorkflow } from "@/hooks/workflow/useWorkflows";

const WORKFLOW_TABS = [
  "summary",
  "products",
  "approvals",
  "discussion",
  "history",
] as const;
type WorkflowTab = (typeof WORKFLOW_TABS)[number];

function WorkflowDetail() {
  const params = useParams<{ workflowId: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const { data, isPending, isError, error } = useWorkflow(params.workflowId);
  const workflow = data?.workflow;
  const openRequests =
    workflow?.assignments.reduce(
      (count, assignment) => count + (assignment.openChangeRequestCount ?? 0),
      0,
    ) ?? 0;

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
        ) : workflow.canCancel ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              <Icon icon={StopCircleIcon} size={16} />
              Cancel Workflow
            </Button>
            {workflow.canComplete ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setCompleteOpen(true)}
              >
                <Icon icon={CheckmarkBadge01Icon} size={16} />
                Complete Workflow
              </Button>
            ) : null}
          </div>
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
            <TabsTrigger value="discussion">
              <Icon icon={BubbleChatIcon} size={14} strokeWidth={2} />
              Discussion
              {openRequests ? (
                <span
                  className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[11px] leading-none tabular-nums text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                  title="Open change requests"
                >
                  {openRequests}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon icon={WorkHistoryIcon} size={14} strokeWidth={2} />
              History
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
            <TabsContent value="discussion">
              <WorkflowDiscussionTab workflow={workflow} />
            </TabsContent>
            <TabsContent value="history">
              <WorkflowHistoryTab workflow={workflow} />
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
      {workflow.canCancel ? (
        <CancelWorkflowDialog
          workflow={workflow}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
        />
      ) : null}
      {workflow.canComplete ? (
        <CompleteWorkflowDialog
          workflow={workflow}
          open={completeOpen}
          onOpenChange={setCompleteOpen}
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
