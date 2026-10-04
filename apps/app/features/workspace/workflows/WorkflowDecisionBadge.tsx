import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import type { WorkflowDecision } from "@/types/workflow";
import { WORKFLOW_DECISION_LABELS } from "@/utils/workflow/workflow-labels";

const DECISION_VARIANTS: Record<
  WorkflowDecision,
  "violet" | "teal" | "red" | "orange"
> = {
  pending: "violet",
  approved: "teal",
  rejected: "red",
  changes_requested: "orange",
};

export function WorkflowDecisionBadge({
  decision,
  closed = false,
  className,
}: {
  decision: WorkflowDecision;
  closed?: boolean;
  className?: string;
}) {
  const undecided = closed && decision === "pending";

  return (
    <Badge
      variant={undecided ? "gray" : DECISION_VARIANTS[decision]}
      className={cn("font-normal", className)}
    >
      <span className="size-2 rounded-full bg-current opacity-70" />
      {undecided ? "No decision" : WORKFLOW_DECISION_LABELS[decision]}
    </Badge>
  );
}
