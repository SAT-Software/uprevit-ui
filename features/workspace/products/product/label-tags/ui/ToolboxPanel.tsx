"use client";

import { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MarkerBaseEditor } from "@markerjs/markerjs3";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  title: string;
  icon: any;
  variant?: "ghost" | "outline" | "secondary";
  children: ReactNode;
} & React.ComponentProps<"div">;

export type PanelProps = {
  markerEditor: MarkerBaseEditor;
  variant?: "ghost" | "outline" | "secondary";
};

const ToolboxPanel = ({
  title,
  icon: Icon,
  variant = "secondary",
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
                onClick={() => setPopoverOpen(!popoverOpen)}
              >
                <Icon />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="min-w-48 w-auto p-4">
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
