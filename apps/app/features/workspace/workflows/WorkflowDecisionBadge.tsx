import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import type { WorkflowDecision } from "@/types/workflow";
import { WORKFLOW_DECISION_LABELS } from "@/utils/workflow/workflow-labels";

const DECISION_VARIANTS: Record<WorkflowDecision, "violet" | "teal" | "red"> = {
  pending: "violet",
  approved: "teal",
  rejected: "red",
};

export function WorkflowDecisionBadge({
  decision,
  className,
}: {
  decision: WorkflowDecision;
  className?: string;
}) {
  return (
    <Badge
      variant={DECISION_VARIANTS[decision]}
      className={cn("font-normal", className)}
    >
      <span className="size-2 rounded-full bg-current opacity-70" />
      {WORKFLOW_DECISION_LABELS[decision]}
    </Badge>
  );
}
