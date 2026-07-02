import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";

export function InfoTooltip({
  content,
  className,
  ContentClassName,
}: {
  content: string;
  className?: string;
  ContentClassName?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <HugeiconsIcon
          icon={InformationCircleIcon}
          size={12}
          strokeWidth={2}
          className="text-muted-foreground/60"
        />
      </TooltipTrigger>
      <TooltipContent className={cn(ContentClassName)}>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
