import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

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

export function StatsCard({ title, value, icon, location }: StatsCardProps) {
  return (
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        {/* <PiArrowBendRightUp
          className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-neutral-500"
          size={20}
          aria-hidden="true"
        /> */}
        {/* Icon */}
        <div
          className={
            location === "archive"
              ? "max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-input flex items-center justify-center text-black dark:text-white"
              : "max-[480px]:hidden size-10 shrink-0 rounded-full bg-neutral-200/25 border border-neutral-600/50 flex items-center justify-center text-neutral-500"
          }
        >
          {icon({ size: 20, strokeWidth: 4 })}
        </div>
        {/* Content */}
        <div>
          <div className="font-medium text-xs uppercase text-muted-foreground before:absolute before:inset-0">
            {title}
          </div>
          <div className="text-2xl font-semibold mb-2">{value}</div>
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
