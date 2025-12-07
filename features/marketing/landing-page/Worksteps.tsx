import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  const steps: Step[] = [
    {
      title: "Upload Source Files",
      description: "Syncing all source files to the secure vault",
      status: "Completed",
      icon: PiFileCloudDuotone,
    },
    {
      title: "Import Technical Data",
      description: "Processing specs and technical parameters",
      status: "Completed",
      icon: PiDatabaseDuotone,
    },
    {
      title: "Upload Labels",
      description: "Verifying label compliance and formats",
      status: "In Progress",
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

  return (
    <div
      className={cn(
        "w-full h-full bg-background p-10 rounded-xl border border-border flex flex-col items-start justify-start relative overflow-hidden",
        className
      )}
    >
      {/* Background Decor */}
      {/* <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" /> */}

      <div className="mb-8 z-10 relative">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          Labeling Asset Management
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          Your source of truth for all symbols, schematics, graphics
        </p>
      </div>

      <div className="relative z-10 w-full flex-1">
        {/* Continuous vertical line */}
        <div
          className="absolute left-4 top-2 bottom-4 w-px bg-linear-to-b from-border via-border to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = step.status === "Completed";
            const isInProgress = step.status === "In Progress";
            const isPending = step.status === "Pending";

            return (
              <div
                key={index}
                className="relative flex items-start gap-4 group"
              >
                {/* Icon Marker */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-sm",
                    isCompleted
                      ? "bg-accent border-border text-primary"
                      : isInProgress
                      ? "bg-accent border-border text-blue-500"
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {isCompleted && <PiCheckCircleDuotone className="w-5 h-5" />}
                  {isInProgress && (
                    <PiSpinnerGapDuotone className="w-5 h-5 animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex-1 pt-1 transition-all duration-300",
                    isPending ? "opacity-60" : "opacity-100"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
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
                        "text-[10px] h-5 px-1.5 rounded-md backdrop-blur-sm",
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
