"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import { PiSpinnerDuotone } from "react-icons/pi";
import { IconType } from "react-icons";
import { ToolbarAction } from "@/types/toolbar";
import { Toggle } from "@uprevit/ui/components/ui/toggle";
import { cn } from "@uprevit/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

type Props = {
  icon: IconType;
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
  icon: Icon,
  title,
  buttonType,
  variant = "secondary",
  toggled,
  disabled,
  loading = false,
  action,
  className,
  onAction,
}: Props) => {
  return (
    <>
      {(buttonType === undefined || buttonType === "button") && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              className={cn("", className)}
              size="icon-sm"
              // title={title}
              disabled={disabled}
              onClick={() => onAction(action)}
            >
              {loading && <PiSpinnerDuotone className="animate-spin" />}
              {!loading && <Icon />}
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
            <Toggle
              variant={variant === "outline" ? "outline" : "outline"}
              className={cn("", className)}
              size="icon-sm"
              // title={title}
              pressed={toggled ? true : false}
              disabled={disabled}
              onClick={() => onAction(action)}
            >
              <Icon />
            </Toggle>
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
