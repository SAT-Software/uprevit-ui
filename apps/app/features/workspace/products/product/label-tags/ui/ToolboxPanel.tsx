"use client";

import { ReactNode, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";

import { Button } from "@uprevit/ui/components/ui/button";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { MarkerBaseEditor } from "@markerjs/markerjs3";
import { cn } from "@uprevit/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

type Props = {
  title: string;
  icon: IconSvgElement;
  variant?: "ghost" | "outline" | "secondary";
  children: ReactNode;
} & React.ComponentProps<"div">;

export type PanelProps = {
  markerEditor: MarkerBaseEditor;
  variant?: "ghost" | "outline" | "secondary";
};

const ToolboxPanel = ({
  title,
  icon,
  variant = "ghost",
  children,
  className,
  ...props
}: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="inline-flex">
      <Tooltip>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant={variant}
                size="icon-sm"
                className="size-7"
                onClick={() => setPopoverOpen(!popoverOpen)}
              >
                <Icon icon={icon} size={14} strokeWidth={2} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="w-auto min-w-48 p-4">
            <div
              className={cn("flex flex-col space-y-6", className)}
              {...props}
            >
              <h2 className="text-sm font-semibold">{title}</h2>
              {children}
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ToolboxPanel;
