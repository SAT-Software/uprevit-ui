"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import { Separator } from "@uprevit/ui/components/ui/separator";
import { cn } from "@uprevit/ui/lib/utils";
import type { ReactNode } from "react";
import CircularProgress from "./CircularProgressComponent";

export function ProductProgressHoverCard({
  percentage,
  colorClass,
  size = 18,
  strokeWidth = 2,
  progress,
  product_name,
  tabsCompleted,
  totalTabs,
  showActions = false,
  actions,
}: {
  percentage: number;
  colorClass: string;
  size?: number;
  strokeWidth?: number;
  progress: number;
  product_name: string;
  tabsCompleted: number;
  totalTabs: number;
  showActions?: boolean;
  actions?: ReactNode;
}) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
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
        </HoverCardTrigger>
        <HoverCardContent
          className="w-100 p-0 gap-0"
          align="start"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col gap-0">
            <div className="px-4 py-2">
              <p className="text-base font-medium text-foreground line-clamp-1">
                {product_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Product completion - Number of tabs completed out of {totalTabs}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 px-4 py-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-normal text-muted-foreground">
                  Number of Tabs completed
                </p>
                <p className="text-xs font-semibold text-foreground">
                  {tabsCompleted} / {totalTabs}
                </p>
              </div>
              <div className="flex h-5 items-stretch gap-1">
                {Array.from({ length: 50 }).map((_, i) => {
                  const barToHighlight = Math.ceil((50 * percentage) / 100);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "min-w-0 flex-1 rounded-lg",
                        i < barToHighlight
                          ? `bg-linear-to-r ${colorClass}`
                          : "bg-accent",
                      )}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-normal text-muted-foreground/80">
                  Total percentage completed
                </p>
                <p className="text-xs font-semibold text-foreground">
                  {percentage}%
                </p>
              </div>
            </div>

            {showActions && actions ? (
              <>
                <Separator />
                <div className="px-4 py-2">{actions}</div>
              </>
            ) : null}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
