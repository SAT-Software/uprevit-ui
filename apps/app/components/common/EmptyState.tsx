import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@uprevit/ui/components/ui/empty";
import { cn } from "@uprevit/ui/lib/utils";

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Icon>["icon"];
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  embedded?: boolean;
  fill?: boolean;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  embedded = false,
  fill = false,
  className,
}: EmptyStateProps) {
  return (
    <Empty
      className={cn(
        "w-full min-h-[200px] gap-4 py-8 md:p-6",
        !embedded && "border border-border bg-muted/30",
        !embedded && !fill && "rounded-xl",
        fill && "min-h-full flex-1 rounded-none",
        className,
      )}
    >
      <EmptyHeader className="gap-1">
        <EmptyMedia className="mb-3 rounded-full border border-border bg-background p-4 text-muted-foreground shadow-sm">
          <Icon icon={icon} size={32} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle className="text-sm font-medium text-foreground">
          {title}
        </EmptyTitle>
        {description && (
          <EmptyDescription className="text-xs">{description}</EmptyDescription>
        )}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
