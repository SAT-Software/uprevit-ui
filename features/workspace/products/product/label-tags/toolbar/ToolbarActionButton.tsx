"use client";

import { Button } from "@/components/ui/button";
import { PiSpinnerDuotone } from "react-icons/pi";
import { IconType } from "react-icons";
import { ToolbarAction } from "@/types/toolbar";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type Props = {
  icon: IconType;
  title: string;
  buttonType?: "button" | "toggle";
  variant?: "ghost" | "outline";
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
  variant = "ghost",
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
        <Button
          variant={variant}
          className={cn("bg-transparent", className)}
          size="icon"
          title={title}
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {loading && <PiSpinnerDuotone className="animate-spin" />}
          {!loading && <Icon />}
        </Button>
      )}
      {buttonType === "toggle" && (
        <Toggle
          variant={variant === "ghost" ? "default" : "outline"}
          className={cn("bg-transparent", className)}
          title={title}
          pressed={toggled ? true : false}
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          <Icon />
        </Toggle>
      )}
    </>
  );
};

export default ToolbarActionButton;
