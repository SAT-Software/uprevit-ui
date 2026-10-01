import {
  ArrowTurnBackwardIcon,
  BellIcon,
  CrownIcon,
  UserAdd01Icon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import type { NotificationType } from "@/types/notification";

const TYPE_ICONS: Record<NotificationType, typeof BellIcon> = {
  "product.owner_assigned": CrownIcon,
  "product.contributor_added": UserAdd01Icon,
  "product.returned_to_draft": ArrowTurnBackwardIcon,
  "product.ownership_transferred": UserSwitchIcon,
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
