import {
  ArrowTurnBackwardIcon,
  BellIcon,
  CancelCircleIcon,
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  CrownIcon,
  MessageDone01Icon,
  MessageEdit01Icon,
  StopCircleIcon,
  TaskDone01Icon,
  UserAdd01Icon,
  UserSwitchIcon,
  ValidationApprovalIcon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import type { NotificationType } from "@/types/notification";

const TYPE_ICONS: Record<NotificationType, typeof BellIcon> = {
  "product.owner_assigned": CrownIcon,
  "product.contributor_added": UserAdd01Icon,
  "product.returned_to_draft": ArrowTurnBackwardIcon,
  "product.ownership_transferred": UserSwitchIcon,
  "workflow.approval_requested": ValidationApprovalIcon,
  "workflow.product_in_review": WorkflowIcon,
  "workflow.approved": CheckmarkCircle02Icon,
  "workflow.changes_requested": MessageEdit01Icon,
  "workflow.change_request_addressed": MessageDone01Icon,
  "workflow.ready_to_complete": TaskDone01Icon,
  "workflow.completed": CheckmarkBadge01Icon,
  "workflow.rejected": CancelCircleIcon,
  "workflow.cancelled": StopCircleIcon,
};

export function NotificationTypeIcon({
  type,
  className,
}: {
  type: NotificationType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-muted-foreground",
        className,
      )}
    >
      <Icon icon={TYPE_ICONS[type] ?? BellIcon} size={14} strokeWidth={2} />
    </span>
  );
}
