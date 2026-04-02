"use client";

import { cn } from "@uprevit/ui/lib/utils";

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type PositionOffset = "sm" | "md" | "lg" | "custom";

interface DecorativeCornerCircleProps {
  /**
   * Corner position where the circle should be placed
   */
  position: CornerPosition;
  /**
   * Rotation angle in degrees (0, 90, 180, 270, or custom angles like 135, 224)
   */
  rotation?: number;
  /**
   * Size preset for the SVG viewBox
   * - "sm": 60x60
   * - "md": 120x60
   * - "lg": 120x100
   */
  size?: "sm" | "md" | "lg";
  /**
   * Position offset preset
   * - "sm": -15px offset
   * - "md": uses more specific offsets like -22.5
   * - "lg": -14/-16 offset (for CTA section)
   * - "custom": no preset offset, use className
   */
  offset?: PositionOffset;
  /**
   * Additional CSS classes for custom positioning
   */
  className?: string;
}

const positionClasses: Record<
  CornerPosition,
  Record<PositionOffset, string>
> = {
  "top-left": {
    sm: "-top-15 -left-15",
    md: "-top-15 -left-15",
    lg: "-top-14 -left-16",
    custom: "top-0 left-0",
  },
  "top-right": {
    sm: "-top-15 -right-15",
    md: "-top-15 -right-22.5",
    lg: "-top-14 -right-16",
    custom: "top-0 right-0",
  },
  "bottom-left": {
    sm: "-bottom-15 -left-15",
    md: "-bottom-15 -left-15",
    lg: "-bottom-14 -left-16",
    custom: "bottom-0 left-0",
  },
  "bottom-right": {
    sm: "-bottom-15 -right-15",
    md: "-bottom-7.5 -right-22.5",
    lg: "-bottom-14 -right-16",
    custom: "bottom-0 right-0",
  },
};

// Special positioning for FeaturesSection (inner corners)
const featuresSectionPositionClasses: Record<string, string> = {
  "inner-bottom-left": "bottom-0 -left-15",
  "inner-bottom-right": "bottom-0 -right-15",
  "outer-bottom-left": "-bottom-15 left-0",
  "outer-bottom-right": "-bottom-15 right-0",
};

const sizeConfig = {
  sm: { width: 60, height: 60, viewBox: "0 0 60 60" },
  md: { width: 120, height: 60, viewBox: "0 0 120 60" },
  lg: { width: 120, height: 100, viewBox: "0 0 120 100" },
};

export function DecorativeCornerCircle({
  position,
  rotation = 0,
  size = "sm",
  offset = "sm",
  className,
}: DecorativeCornerCircleProps) {
  const { width, height, viewBox } = sizeConfig[size];
  const positionClass = positionClasses[position][offset];

  return (
    <div
      className={cn(
        "absolute text-border/60 pointer-events-none hidden min-[1281px]:block",
        positionClass,
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="60"
          cy="60"
          r="58"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="0.8 3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

interface DecorativeCornerCircleCustomProps {
  /**
   * Custom position classes (e.g., "bottom-0 -left-15")
   */
  positionClassName: string;
  /**
   * Rotation angle in degrees
   */
  rotation?: number;
  /**
   * Size preset for the SVG viewBox
   */
  size?: "sm" | "md" | "lg";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A more flexible version that accepts custom position classes
 * Use this when the preset positions don't match your needs
 */
export function DecorativeCornerCircleCustom({
  positionClassName,
  rotation = 0,
  size = "sm",
  className,
}: DecorativeCornerCircleCustomProps) {
  const { width, height, viewBox } = sizeConfig[size];

  return (
    <div
      className={cn(
        "absolute text-border/80 pointer-events-none hidden min-[1281px]:block",
        positionClassName,
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="60"
          cy="60"
          r="58"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="0.8 3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
