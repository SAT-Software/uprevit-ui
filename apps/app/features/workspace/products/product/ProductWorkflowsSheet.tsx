"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { useState } from "react";
import { WorkflowIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@uprevit/ui/components/ui/sheet";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { GuardedLink } from "@/components/common/GuardedLink";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { ErrorState } from "@/components/common/ErrorState";
import { WorkflowStatusBadge } from "@/features/workspace/workflows/WorkflowStatusBadge";
import { useWorkflows } from "@/hooks/workflow/useWorkflows";
import { WORKSPACE_LIST_LIMIT } from "@/lib/workspace-list-query";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";

export function ProductWorkflowsSheet({ lineageId }: { lineageId: string }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching, isError, refetch } = useWorkflows(
    {
      view: "all",
      page,
      limit: WORKSPACE_LIST_LIMIT,
      productLineageId: lineageId,
    },
    open,
  );
  const workflows = data?.result.workflows ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Icon icon={WorkflowIcon} size={16} strokeWidth={2} />
          Workflows
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
      >
        <SheetHeader>
          <SheetTitle>Workflows</SheetTitle>
          <InfoTooltip
            className="mt-0.5"
            ContentClassName="z-105"
            content="Every approval workflow this Product was in, newest first."
          />
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col pt-10">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isError && !data ? (
              <ErrorState
                variant="panel"
                icon={WorkflowIcon}
                title="Failed to load workflows"
                onRetry={() => refetch()}
                className="m-4 w-auto"
              />
            ) : isPending ? (
              <ul className="divide-y divide-border border-b border-border">
                {Array.from({ length: 4 }, (_, index) => (
                  <li key={index} className="flex flex-col gap-1 px-4 py-2.5">
                    <div className="flex h-5 items-center justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <div className="flex h-5 items-center">
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex h-5 items-center">
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : workflows.length === 0 ? (
              <EmptyState
                icon={WorkflowIcon}
                title="No workflows yet"
                description="This Product has not been in a workflow yet"
                className="m-4 w-auto"
              />
            ) : (
              <ul className="divide-y divide-border border-b border-border">
                {workflows.map((workflow) => {
                  const version = workflow.products.find(
                    (product) => product.lineageId === lineageId,
                  )?.version;
                  return (
                    <li key={workflow._id}>
                      <GuardedLink
                        href={`/workflows/${workflow._id}`}
                        className="flex flex-col gap-1 px-4 py-2.5 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {workflow.numberLabel}
                          </span>
                          <WorkflowStatusBadge status={workflow.status} />
                        </div>
                        <p className="truncate text-sm font-medium">
                          {workflow.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {version !== undefined ? (
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs"
                            >
                              v{version}
                            </Badge>
                          ) : null}
                          <span>
                            Created{" "}
                            {formatToLocalDate(workflow.dates.createdAt)} by{" "}
                            {workflow.initiator.name}
                          </span>
                        </div>
                      </GuardedLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {data && data.result.pagination.totalPages > 1 ? (
            <div
              className="flex h-10 w-full shrink-0 items-center border-t"
              aria-busy={isFetching}
            >
              <WorkspaceListPagination
                pagination={data.result.pagination}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
