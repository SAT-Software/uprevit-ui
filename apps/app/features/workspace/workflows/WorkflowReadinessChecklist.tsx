"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@uprevit/ui/components/ui/collapsible";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useWorkflowReadiness } from "@/hooks/workflow/useWorkflows";
import type { WorkflowReadinessCheck } from "@/types/workflow";

const CHECK_TABS: Record<string, { tab: string; label: string }> = {
  products: { tab: "products", label: "Products" },
  product_versions: { tab: "products", label: "Products" },
  other_active_workflows: { tab: "products", label: "Products" },
  product_team: { tab: "approvals", label: "Approvals" },
  functions: { tab: "approvals", label: "Approvals" },
  assignees: { tab: "approvals", label: "Approvals" },
  independent_approval: { tab: "approvals", label: "Approvals" },
};

function FailedCheck({ check }: { check: WorkflowReadinessCheck }) {
  const pathname = usePathname();
  const target = CHECK_TABS[check.key];

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <Icon
        icon={CancelCircleIcon}
        size={18}
        strokeWidth={2}
        className="mt-0.5 shrink-0 text-destructive"
        aria-label="Failed"
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium">{check.label}</p>
        <p className="text-xs text-muted-foreground">{check.message}</p>
      </div>
      {target ? (
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <Link href={`${pathname}?tab=${target.tab}`}>
            Go to {target.label}
          </Link>
        </Button>
      ) : null}
    </li>
  );
}

function PassedCheck({ check }: { check: WorkflowReadinessCheck }) {
  return (
    <li className="flex min-h-9 items-center gap-3 px-4 py-1.5">
      <Icon
        icon={CheckmarkCircle02Icon}
        size={16}
        strokeWidth={2}
        className="shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-label="Passed"
      />
      <p className="min-w-0 flex-1 text-sm">{check.label}</p>
      <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {check.message}
      </p>
    </li>
  );
}

export function WorkflowReadinessChecklist({
  workflowId,
}: {
  workflowId: string;
}) {
  const { data, isPending, isError } = useWorkflowReadiness(workflowId);
  const [showPassed, setShowPassed] = useState(false);
  const checks = data?.readiness.checks ?? [];
  const failed = checks.filter((check) => !check.passed);
  const passed = checks.filter((check) => check.passed);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Ready to start?</p>
          <InfoTooltip content="Everything below must pass before the workflow can be started." />
        </div>
        {data ? (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              failed.length
                ? "text-muted-foreground"
                : "text-emerald-600 dark:text-emerald-400",
            )}
          >
            {passed.length} of {checks.length} passed
          </span>
        ) : null}
      </div>

      {isPending ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Icon icon={AlertCircleIcon} size={16} />
          Failed to check readiness
        </div>
      ) : (
        <>
          {failed.length ? (
            <ul className="divide-y divide-border">
              {failed.map((check) => (
                <FailedCheck key={check.key} check={check} />
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3">
              <Icon
                icon={CheckmarkCircle02Icon}
                size={18}
                strokeWidth={2}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <p className="text-sm font-medium">
                All checks passed. This workflow is ready to start.
              </p>
            </div>
          )}

          {passed.length ? (
            <Collapsible
              open={showPassed}
              onOpenChange={setShowPassed}
              className="border-t border-border"
            >
              <CollapsibleTrigger className="flex h-9 w-full cursor-pointer items-center gap-1.5 px-4 text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <Icon
                  icon={ArrowRight01Icon}
                  size={14}
                  className={cn(
                    "transition-[rotate] duration-150",
                    showPassed && "rotate-90",
                  )}
                />
                {showPassed ? "Hide" : "Show"} {passed.length} passed{" "}
                {passed.length === 1 ? "check" : "checks"}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="pb-1.5">
                  {passed.map((check) => (
                    <PassedCheck key={check.key} check={check} />
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ) : null}
        </>
      )}
    </section>
  );
}
