"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { useState } from "react";
import CircularProgress from "./CircularProgressComponent";
import { cn } from "@uprevit/ui/lib/utils";

export function ProductProcessDropdown({
  percentage,
  colorClass,
  size = 18,
  strokeWidth = 2,
  progress,
  product_name,
  complete_button,
  tabsCompleted,
  totalTabs,
}: {
  percentage: number;
  colorClass: string;
  size?: number;
  strokeWidth?: number;
  progress: number;
  product_name: string;
  complete_button: boolean;
  tabsCompleted: number;
  totalTabs: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        asChild
      >
        <Button variant="ghost" className="flex items-center gap-2">
          <CircularProgress
            percentage={percentage}
            colorClass={colorClass}
            size={size}
            strokeWidth={strokeWidth}
          />
          <span className="text-sm font-medium text-foreground">
            {progress}%
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="w-100"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-base font-medium text-foreground">
              {product_name}
            </p>
            <p>
              Product completion - Number of tabs completed out of {totalTabs}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="">
          <div className="flex items-center justify-between mx-3 mt-3">
            <p className="text-xs font-normal text-muted-foreground">
              Number of Tabs completed
            </p>
            <p className="text-xs font-semibold text-foreground">
              {tabsCompleted} / {totalTabs}
            </p>
          </div>
          <div className="w-auto flex items-center justify-stretch gap-1 mx-3 mt-3 mb-3">
            {Array.from({ length: 50 }).map((_, i) => {
              const barToHighlight = Math.ceil((50 * percentage) / 100);
              return (
                <div
                  key={i}
                  className={cn(
                    "w-full h-5 rounded-lg",
                    i < barToHighlight
                      ? `bg-linear-to-r ${colorClass}`
                      : "bg-accent",
                  )}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between mx-3 mb-3">
            <p className="text-xs font-normal text-muted-foreground/80">
              Total percentage completed
            </p>
            <p className="text-xs font-semibold text-foreground">
              {percentage}%
            </p>
          </div>
        </DropdownMenuGroup>
        {complete_button && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button>Mark Tab Complete</Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
