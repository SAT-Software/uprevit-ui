import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

export function InfoTooltip({
  content,
  className,
}: {
  content: string;
  className?: string;
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
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
