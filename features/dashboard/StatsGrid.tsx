import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import {
  // PiArrowBendRightUp,
  PiArrowUpRightBold,
  PiArrowDownRightBold,
} from "react-icons/pi";

export interface StatsCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
  };
  icon: IconType;
  location: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  location,
}: StatsCardProps) {
  const isPositive = change.trend === "up";
  const trendColor = isPositive ? "text-emerald-500" : "text-red-500";

  return (
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        {/* <PiArrowBendRightUp
          className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
          size={20}
          aria-hidden="true"
        /> */}
        {/* Icon */}
        <div
          className={
            location === "archive"
              ? "max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-input flex items-center justify-center text-black dark:text-white"
              : "max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center text-emerald-500"
          }
        >
          {icon({ size: 20, strokeWidth: 4 })}
        </div>
        {/* Content */}
        <div>
          <a
            href="#"
            className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0"
          >
            {title}
          </a>
          <div className="text-2xl font-semibold mb-2">{value}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
            <span
              className={cn("font-medium flex items-center gap-1", trendColor)}
            >
              {isPositive ? <PiArrowUpRightBold /> : <PiArrowDownRightBold />}
              {change?.value || "00"}
            </span>{" "}
            vs last week
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatsCardProps[];
  location: string;
}

export function StatsGrid({ stats, location }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 border border-border rounded-xl bg-gradient-to-br from-background/90 to-background",
        location === "archive"
          ? "min-[1200px]:grid-cols-3"
          : "min-[1200px]:grid-cols-4"
      )}
    >
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} location={location} />
      ))}
    </div>
  );
}
