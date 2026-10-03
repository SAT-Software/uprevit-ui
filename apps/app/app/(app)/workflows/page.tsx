"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "react-oidc-context";
import {
  CheckListIcon,
  Search01Icon,
  UserIcon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ProductCombobox } from "@/components/common/ProductCombobox";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { CreateWorkflowDialog } from "@/features/workspace/workflows/WorkflowDetailsDialog";
import { WorkflowDecisionBadge } from "@/features/workspace/workflows/WorkflowDecisionBadge";
import { WorkflowStatusBadge } from "@/features/workspace/workflows/WorkflowStatusBadge";
import { WorkflowsFeatureGate } from "@/features/workspace/workflows/WorkflowsFeatureGate";
import { useWorkflows } from "@/hooks/workflow/useWorkflows";
import { WORKSPACE_LIST_LIMIT } from "@/lib/workspace-list-query";
import type {
  Workflow,
  WorkflowDecision,
  WorkflowStatus,
  WorkflowView,
} from "@/types/workflow";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { WORKFLOW_STATUS_LABELS } from "@/utils/workflow/workflow-labels";

const WORKFLOW_VIEWS: WorkflowView[] = ["all", "created-by-me", "my-tasks"];
const ALL_STATUSES = "all";

const getMyDecision = (
  workflow: Workflow,
  userId: string | undefined,
): WorkflowDecision => {
  const decisions = workflow.assignments
    .filter((assignment) => assignment.userId === userId)
    .map((assignment) => assignment.decision);
  if (decisions.includes("rejected")) return "rejected";
  if (decisions.includes("pending")) return "pending";
  return "approved";
};

function WorkflowsList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const userId = auth.user?.profile?.userId as string | undefined;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<WorkflowStatus | undefined>();
  const [product, setProduct] = useState<{ id: string; lineageId: string }>();

  const tabParam = searchParams.get("tab");
  const view: WorkflowView = WORKFLOW_VIEWS.includes(tabParam as WorkflowView)
    ? (tabParam as WorkflowView)
    : "all";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isPending, isFetching, isError } = useWorkflows({
    view,
    page,
    limit: WORKSPACE_LIST_LIMIT,
    search: debouncedSearch || undefined,
    status,
    productLineageId: product?.lineageId,
  });
  const workflows = data?.result.workflows ?? [];
  const hasFilters = !!debouncedSearch || !!status || !!product;
  const isMyTasks = view === "my-tasks";

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Workflows</p>
          <InfoTooltip content="Approval workflows package the latest version of one or more Products for review and release." />
        </div>
        <CreateWorkflowDialog />
      </div>

      <Tabs
        value={view}
        onValueChange={(value) => {
          setPage(1);
          router.replace(value === "all" ? pathname : `${pathname}?tab=${value}`);
        }}
        className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
      >
        <div className="flex min-h-10 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-2 py-1">
          <TabsList variant="line">
            <TabsTrigger value="all">
              <Icon icon={WorkflowIcon} size={14} strokeWidth={2} />
              All Workflows
            </TabsTrigger>
            <TabsTrigger value="created-by-me">
              <Icon icon={UserIcon} size={14} strokeWidth={2} />
              Created by Me
            </TabsTrigger>
            <TabsTrigger value="my-tasks">
              <Icon icon={CheckListIcon} size={14} strokeWidth={2} />
              My Tasks
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-2">
            <InputGroup size="sm" className="w-56 bg-background">
              <InputGroupAddon>
                <Icon icon={Search01Icon} size={14} />
              </InputGroupAddon>
              <InputGroupInput
                aria-label="Search workflows"
                placeholder="Search number or name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </InputGroup>
            <Select
              value={status ?? ALL_STATUSES}
              onValueChange={(value) => {
                setPage(1);
                setStatus(
                  value === ALL_STATUSES ? undefined : (value as WorkflowStatus),
                );
              }}
            >
              <SelectTrigger size="sm" className="w-40" aria-label="Status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                {Object.entries(WORKFLOW_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-52">
              <ProductCombobox
                value={product?.id ?? ""}
                allowNone
                noneLabel="All Products"
                className="h-7 px-2 py-1 has-[>svg]:px-2"
                onValueChange={(productId, item) => {
                  setPage(1);
                  setProduct(
                    productId
                      ? {
                          id: productId,
                          lineageId: item?.product_lineage_id ?? productId,
                        }
                      : undefined,
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isError ? (
            <DashboardErrorState
              variant="panel"
              icon={WorkflowIcon}
              title="Failed to load workflows"
              className="m-4"
            />
          ) : !isPending && workflows.length === 0 ? (
            <div className="m-4 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center">
              <div className="flex items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm">
                <Icon
                  icon={WorkflowIcon}
                  className="text-muted-foreground"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No workflows found</p>
                <p className="text-xs text-muted-foreground">
                  {hasFilters
                    ? "Try a different search or filter."
                    : isMyTasks
                      ? "Workflows you are asked to approve will show up here."
                      : "Create a workflow to send Products for approval."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full border-b border-border">
                <Table className="min-w-250">
                  <TableHeader className="bg-muted">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[14%]">Number</TableHead>
                      <TableHead className="w-[32%]">Name</TableHead>
                      <TableHead className="w-[14%]">Status</TableHead>
                      {isMyTasks ? (
                        <TableHead className="w-[12%]">Your Decision</TableHead>
                      ) : null}
                      <TableHead className="w-[8%]">Products</TableHead>
                      <TableHead className="w-[14%]">Initiator</TableHead>
                      <TableHead className="w-[18%]">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      <TableBodySkeleton columnCount={isMyTasks ? 7 : 6} />
                    ) : (
                      workflows.map((workflow) => (
                        <TableRow
                          key={workflow._id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/workflows/${workflow._id}`)}
                        >
                          <TableCell className="font-mono text-sm">
                            {workflow.numberLabel}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/workflows/${workflow._id}`}
                              className="block truncate text-sm font-medium rounded-sm hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              title={workflow.name}
                              onClick={(event) => event.stopPropagation()}
                            >
                              {workflow.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <WorkflowStatusBadge status={workflow.status} />
                          </TableCell>
                          {isMyTasks ? (
                            <TableCell>
                              <WorkflowDecisionBadge
                                decision={getMyDecision(workflow, userId)}
                                closed={workflow.status !== "in_review"}
                              />
                            </TableCell>
                          ) : null}
                          <TableCell className="tabular-nums">
                            {workflow.products.length}
                          </TableCell>
                          <TableCell title={workflow.initiator.email}>
                            {workflow.initiator.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatToLocalDateTime(workflow.dates.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div
                className="flex h-10 w-full items-center border-b"
                aria-busy={isFetching}
              >
                <WorkspaceListPagination
                  pagination={data?.result.pagination}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <WorkflowsFeatureGate>
      <WorkflowsList />
    </WorkflowsFeatureGate>
  );
}
