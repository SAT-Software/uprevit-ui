import { cn } from "@uprevit/ui/lib/utils";

export function DotsBackdrop({
  className,
  dotsClassName,
}: {
  className?: string;
  dotsClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0)_70%)]" />
      <div
        className={cn(
          "tile-dots absolute inset-0 [mask-image:radial-gradient(ellipse_62%_58%_at_50%_50%,transparent_42%,#000_64%,transparent_92%)]",
          dotsClassName,
        )}
      />
    </div>
  );
}

