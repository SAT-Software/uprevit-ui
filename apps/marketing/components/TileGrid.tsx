import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@uprevit/ui/lib/utils";

export interface TileGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export function TileGrid({ className, children, ...props }: TileGridProps) {
  return (
    <div className="min-h-screen w-full bg-card dark:bg-background">
      <div
        className={cn(
          "relative flex min-h-screen w-full flex-col gap-px bg-grid p-px",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export interface TileProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export function Tile({ className, children, ...props }: TileProps) {
  return (
    <div
      className={cn("rounded-tile bg-tile", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TileRowProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  centerClassName?: string;
  railClassName?: string;
  splitCenter?: boolean;
  as?: "div" | "section" | "header" | "footer";
}

export function TileRow({
  as: Comp = "div",
  className,
  centerClassName,
  railClassName,
  splitCenter = false,
  children,
  ...props
}: TileRowProps) {
  return (
    <Comp
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1310px)_minmax(0,1fr)] gap-px",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn("rounded-tile bg-tile", railClassName)}
      />
      {splitCenter ? (
        <div className={cn("min-w-0", centerClassName)}>{children}</div>
      ) : (
        <div
          className={cn("min-w-0 rounded-tile bg-tile", centerClassName)}
        >
          {children}
        </div>
      )}
      <div
        aria-hidden="true"
        className={cn("rounded-tile bg-tile", railClassName)}
      />
    </Comp>
  );
}

export interface TileSpacerRowProps {
  size?: "sm" | "md";
  dotted?: boolean;
  className?: string;
}

export function TileSpacerRow({
  size = "sm",
  dotted = true,
  className,
}: TileSpacerRowProps) {
  return (
    <TileRow
      aria-hidden="true"
      className={cn(size === "md" ? "h-16" : "h-12", className)}
      centerClassName={cn(dotted && "tile-dots")}
    >
      <span className="sr-only" />
    </TileRow>
  );
}
