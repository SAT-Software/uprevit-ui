import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import { useState, useRef, useEffect } from "react";
import {
  PiCheckCircleDuotone,
  PiCircleDuotone,
  PiSpinnerGapDuotone,
  PiFileCloudDuotone,
  PiDatabaseDuotone,
  PiTagDuotone,
  PiShieldCheckDuotone,
  PiCircuitryDuotone,
} from "react-icons/pi";

interface Step {
  title: string;
  description: string;
  status: "Completed" | "In Progress" | "Pending";
  icon: React.ElementType;
}

interface WorkstepsProps {
  className?: string;
}

export function Worksteps({ className }: WorkstepsProps) {
  const initialSteps: Step[] = [
    {
      title: "Upload Source Files",
      description: "Syncing all source files to the secure vault",
      status: "Pending",
      icon: PiFileCloudDuotone,
    },
    {
      title: "Import Technical Data",
      description: "Processing specs and technical parameters",
      status: "Pending",
      icon: PiDatabaseDuotone,
    },
    {
      title: "Upload Labels",
      description: "Verifying label compliance and formats",
      status: "Pending",
      icon: PiTagDuotone,
    },
    {
      title: "Add Compliance Info",
      description: "Updating regulatory standards databases",
      status: "Pending",
      icon: PiShieldCheckDuotone,
    },
    {
      title: "Upload Symbols",
      description: "Finalizing schematic diagrams and symbols",
      status: "Pending",
      icon: PiCircuitryDuotone,
    },
  ];

  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const intervalRefs = useRef<NodeJS.Timeout[]>([]);

  const updatedSteps = () => {
    intervalRefs.current.forEach((interval) => clearInterval(interval));
    intervalRefs.current = [];

    const newSteps = [...steps];
    newSteps.forEach((step, i) => {
      const interval = setInterval(() => {
        setSteps((currentSteps) => {
          const updatedSteps = [...currentSteps];
          if (updatedSteps[i]) {
            updatedSteps[i] = { ...updatedSteps[i], status: "Completed" };
          }
          return updatedSteps;
        });
      }, 300 * (i + 1));

      intervalRefs.current.push(interval);
    });
  };

  const resetSteps = () => {
    intervalRefs.current.forEach((interval) => clearInterval(interval));
    intervalRefs.current = [];

    setSteps(initialSteps);
  };

  useEffect(() => {
    return () => {
      intervalRefs.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return (
    <div
      onMouseEnter={updatedSteps}
      onMouseLeave={resetSteps}
      className={cn(
        "w-full h-full group bg-background p-8 rounded-xl border border-border flex flex-col items-start justify-start relative overflow-hidden",
        className
      )}
    >
      <div className="mb-8 z-10 relative">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          Labeling Asset Management
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          Your single source of truth for all compliant symbols, schematics, and
          product imagery
        </p>
      </div>

      <div className="relative z-10 w-full flex-1">
        <div
          className="absolute left-4 top-2 bottom-4 w-px bg-linear-to-b from-border via-border to-border"
          aria-hidden="true"
        />

        <div className="space-y-8">
          {steps.map((step, index) => {
            const isCompleted = step.status === "Completed";
            const isInProgress = step.status === "In Progress";
            const isPending = step.status === "Pending";

            return (
              <div
                key={index}
                className="relative flex items-start gap-4 group"
              >
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-sm",
                    isCompleted
                      ? "group-hover:bg-purple-50 group-hover:dark:bg-purple-950 text-muted-foreground border-border group-hover:text-primary group-hover:dark:text-foreground transition-all duration-300 delay-100 ease-in-out"
                      : isInProgress
                      ? "bg-accent border-border text-blue-500"
                      : "bg-background border-border text-muted-foreground"
                    // index === 0 &&
                    //   "group-hover:bg-purple-50 text-muted-foreground border-border group-hover:text-primary transition-all duration-100 delay-100 ease-in-out",
                    // index === 1 &&
                    //   "group-hover:bg-purple-50 text-muted-foreground border-border group-hover:text-primary transition-all duration-200 delay-150 ease-in-out",
                    // index === 2 &&
                    //   "group-hover:bg-purple-50 text-muted-foreground border-border group-hover:text-primary transition-all duration-200 delay-200 ease-in-out"
                  )}
                >
                  {isCompleted && (
                    <PiCheckCircleDuotone className="w-5 h-5 transition-all delay-100 ease-in-out duration-300" />
                  )}
                  {isInProgress && (
                    <PiSpinnerGapDuotone className="w-5 h-5 animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  )}
                </div>

                <div
                  className={cn(
                    "flex-1 pt-1 transition-all duration-300",
                    isPending ? "opacity-60" : "opacity-100"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-0">
                    <h4
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        isCompleted || isInProgress
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] h-5 px-1.5 rounded-md backdrop-blur-sm transition-all ease-in-out duration-300 delay-100",
                        isCompleted
                          ? "bg-primary/10 text-primary border-primary/20"
                          : isInProgress
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {step.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[90%]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
