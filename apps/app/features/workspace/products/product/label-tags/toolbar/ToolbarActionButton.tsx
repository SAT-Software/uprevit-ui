"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { ToolbarAction } from "@/types/toolbar";
import { cn } from "@uprevit/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

type Props = {
  icon: IconSvgElement;
  title: string;
  buttonType?: "button" | "toggle";
  variant?: "ghost" | "outline" | "secondary";
  toggled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  action: ToolbarAction;
  className?: string;
  onAction: (action: ToolbarAction) => void;
};

const ToolbarActionButton = ({
  icon,
  title,
  buttonType,
  variant = "outline",
  toggled,
  disabled,
  loading = false,
  action,
  className,
  onAction,
}: Props) => {
  const iconNode = loading ? (
    <Spinner className="size-3.5" />
  ) : (
    <Icon icon={icon} size={14} strokeWidth={2} />
  );

  return (
    <>
      {(buttonType === undefined || buttonType === "button") && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              className={cn("size-7", className)}
              size="icon-sm"
              disabled={disabled}
              onClick={() => onAction(action)}
            >
              {iconNode}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {buttonType === "toggle" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={toggled ? "secondary" : variant}
              className={cn("size-7", className)}
              size="icon-sm"
              disabled={disabled}
              aria-pressed={toggled}
              onClick={() => onAction(action)}
            >
              {iconNode}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};

export default ToolbarActionButton;
