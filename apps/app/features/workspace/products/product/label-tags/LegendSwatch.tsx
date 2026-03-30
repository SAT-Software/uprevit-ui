"use client";

import { LegendItem, LegendStrokeStyle } from "./legendTypes";
import { cn } from "@uprevit/ui/lib/utils";

type Props = {
  item: LegendItem;
  size?: number;
  className?: string;
};

const getDashArray = (style?: LegendStrokeStyle) => {
  if (style === "dashed") return "6 4";
  if (style === "dotted") return "2 3";
  return undefined;
};

export function LegendSwatch({ item, size = 22, className }: Props) {
  const strokeColor = item.strokeColor || "#000000";
  const strokeWidth = item.strokeWidth ?? 2;
  const dashArray = getDashArray(item.strokeStyle);

  const fillColor =
    item.fillColor && item.fillColor !== "transparent" ? item.fillColor : "none";
  const fillOpacity = fillColor === "none" ? 0 : item.fillOpacity ?? 0.2;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {item.shape === "rectangle" && (
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />
      )}
      {item.shape === "ellipse" && (
        <ellipse
          cx="12"
          cy="12"
          rx="7"
          ry="7"
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
        />
      )}
      {item.shape === "line" && (
        <line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      )}
      {item.shape === "arrow" && (
        <g
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <line x1="4" y1="12" x2="18" y2="12" />
          <polyline points="14,8 18,12 14,16" />
        </g>
      )}
    </svg>
  );
}
