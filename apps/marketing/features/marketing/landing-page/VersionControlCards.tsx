import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import {
  PiCubeDuotone,
  PiCalendarBlankDuotone,
  PiGitCommitDuotone,
} from "react-icons/pi";
import { useTouchCardActivation } from "./useTouchCardActivation";

export function VersionControlCards() {
  const { isTouchActive, activateTouch, deactivateTouch, scheduleTouchDeactivate } =
    useTouchCardActivation();

  const cards = [
    {
      version: 1,
      date: "Aug 15, 2024",
      status: "Submitted",
      name: "Peripheral Catheter",
      description: "Initial production release",
      active: false,
    },
    {
      version: 2,
      date: "Sep 22, 2024",
      status: "Submitted",
      name: "Peripheral Catheter",
      description: "Technical data updated",
      active: false,
    },
    {
      version: 3,
      date: "Oct 24, 2024",
      status: "In Review",
      name: "Peripheral Catheter",
      description: "Label symbols updated",
      active: true,
    },
    {
      version: 4,
      date: "Pending",
      status: "Draft",
      name: "Peripheral Catheter",
      description: "Latest COO update",
      active: false,
    },
    {
      version: 5,
      date: "Planned",
      status: "Concept",
      name: "Peripheral Catheter",
      description: "Move to labeling software",
      active: false,
    },
  ];

  return (
    <div
      onTouchStart={activateTouch}
      onTouchEnd={scheduleTouchDeactivate}
      onTouchCancel={deactivateTouch}
      data-active={isTouchActive ? "true" : undefined}
      className="w-full lg:w-1/3 h-125 lg:h-full group bg-background p-4 md:p-4 lg:p-8 rounded-xl border border-border flex flex-col overflow-hidden"
    >
      <div className="mb-8 z-10 shrink-0">
        <h3 className="text-base md:text-base lg:text-lg font-semibold text-foreground">
          Version control perfected
        </h3>
        <p className="text-xs md:text-sm lg:text-base w-full text-muted-foreground">
          Version-controlled product data and live progress tracking
        </p>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center">
        {cards.map((card, index) => {
          // Distance from active card (index 2)
          const dist = Math.abs(index - 2);
          const isActive = index === 2;

          // Styling based on position
          let opacity = "opacity-100";
          let scale = "scale-100";

          if (dist === 1) {
            opacity = "opacity-60";
            scale = "scale-[0.98]";
          } else if (dist === 2) {
            opacity = "opacity-30";
            scale = "scale-[0.95]";
          }

          return (
            <div
              key={index}
              className={cn(
                "w-full bg-card border border-border rounded-xl p-2 mb-2 group-hover:-mb-2 group-data-[active=true]:-mb-2 transition-all duration-300 ease-in-out delay-300",
                isActive
                  ? "shadow-md border-foreground/20 bg-foreground z-50 group-hover:bg-neutral-800 group-hover:dark:bg-neutral-200 group-data-[active=true]:bg-neutral-800 group-data-[active=true]:dark:bg-neutral-200"
                  : "shadow-sm bg-accent/60 z-40 group-hover:bg-accent group-data-[active=true]:bg-accent",
                !isActive &&
                  dist === 1 &&
                  "opacity-60 scale-[0.98] group-hover:opacity-70 group-data-[active=true]:opacity-70",
                !isActive &&
                  dist === 2 &&
                  "opacity-30 scale-[0.95] group-hover:opacity-50 group-data-[active=true]:opacity-50 z-35",
                // opacity,
                // scale
              )}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                      className={cn(
                        "p-1.5 rounded-lg transition-all duration-300 ease-in-out delay-200",
                        isActive
                          ? "bg-neutral-700 group-hover:dark:bg-neutral-300 text-neutral-300 border border-neutral-600 group-hover:text-purple-400 group-hover:dark:text-purple-600 group-data-[active=true]:dark:bg-neutral-300 group-data-[active=true]:text-purple-400 group-data-[active=true]:dark:text-purple-600"
                          : "bg-accent/50 text-muted-foreground",
                      )}
                  >
                    <PiCubeDuotone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div
                      className={cn(
                        "text-sm font-medium text-background leading-none",
                        isActive ? "text-background" : "text-muted-foreground",
                      )}
                    >
                      {card.name}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] text-muted-foreground mt-0.5",
                        isActive
                          ? "text-background/50"
                          : "text-muted-foreground",
                      )}
                    >
                      {card.description}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 px-1.5 rounded-lg transition-all duration-300 ease-in-out delay-200",
                    isActive
                      ? "bg-neutral-700 text-neutral-300 border-neutral-600 group-hover:text-background group-hover:dark:text-neutral-100 group-hover:border-background/50 group-data-[active=true]:text-background group-data-[active=true]:dark:text-neutral-100 group-data-[active=true]:border-background/50"
                      : "bg-border/40 border-border text-muted-foreground",
                  )}
                >
                  {card.status}
                </Badge>
              </div>

              <div
                className={cn(
                  "flex items-center justify-between pt-1.5 border-t",
                  isActive ? "border-neutral-600" : "border-border/60",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] text-muted-foreground",
                    isActive
                      ? "text-background/70 group-hover:text-background group-data-[active=true]:text-background"
                      : "text-muted-foreground",
                  )}
                >
                  <PiGitCommitDuotone className="w-3 h-3" />
                  <span>{card.version}</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] text-muted-foreground",
                    isActive ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  <PiCalendarBlankDuotone className="w-3 h-3" />
                  <span>{card.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
