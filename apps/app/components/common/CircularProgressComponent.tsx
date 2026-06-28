import { forwardRef } from "react";
import { cn } from "@uprevit/ui/lib/utils";

const CircularProgress = forwardRef<
  SVGSVGElement,
  {
    percentage: number;
    colorClass: string;
    size?: number;
    strokeWidth?: number;
  }
>(({ percentage, colorClass, size = 32, strokeWidth = 3, ...props }, ref) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      ref={ref} // ← critical
      {...props} // ← critical: spreads onMouseEnter, onClick, etc. from Radix Slot
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90 cursor-pointer"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-muted"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={cn("transition-[stroke-dashoffset] duration-300 ease-out", {
          "stroke-emerald-500": colorClass.includes("emerald"),
          "stroke-sky-500": colorClass.includes("sky"),
          "stroke-amber-500": colorClass.includes("amber"),
          "stroke-slate-400": colorClass.includes("slate"),
          "stroke-violet-500": colorClass.includes("violet"),
        })}
      />
    </svg>
  );
});

CircularProgress.displayName = "CircularProgress";
export default CircularProgress;
