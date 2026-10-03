import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import type { WorkflowStatus } from "@/types/workflow";
import { WORKFLOW_STATUS_LABELS } from "@/utils/workflow/workflow-labels";

const STATUS_STYLES: Record<
  WorkflowStatus,
  { variant: "gray" | "blue" | "yellow" | "green" | "secondary"; dot: string }
> = {
  draft: { variant: "gray", dot: "bg-gray-500 dark:bg-gray-400" },
  in_review: { variant: "yellow", dot: "bg-amber-500 dark:bg-amber-400" },
  ready_to_complete: { variant: "blue", dot: "bg-blue-500 dark:bg-blue-400" },
  completed: { variant: "green", dot: "bg-green-500 dark:bg-green-400" },
  rejected: { variant: "secondary", dot: "bg-red-500 dark:bg-red-400" },
  cancelled: { variant: "secondary", dot: "bg-muted-foreground/50" },
};

export function WorkflowStatusBadge({
  status,
  className,
}: {
  status: WorkflowStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];

  return (
    <Badge variant={style.variant} className={cn("font-normal", className)}>
      <span className={cn("size-2 rounded-full", style.dot)} />
      {WORKFLOW_STATUS_LABELS[status]}
    </Badge>
  );
}
