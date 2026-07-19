"use client";

import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { cn } from "@uprevit/ui/lib/utils";

export type IconProps = HugeiconsIconProps;

export function Icon({
  size = 16,
  strokeWidth = 2,
  color = "currentColor",
  className,
  ...rest
}: IconProps) {
  return (
    <HugeiconsIcon
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={cn(
        "transition-colors delay-100 duration-200 ease-in-out",
        className,
      )}
      {...rest}
    />
  );
}
