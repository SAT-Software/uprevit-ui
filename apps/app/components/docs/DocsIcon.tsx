"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@uprevit/ui/components/common/Icon";

export function DocsIcon({
  icon,
  className,
  size = 16,
  strokeWidth = 2,
}: {
  icon: IconSvgElement;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <Icon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
