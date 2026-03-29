"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { defaultColors } from "@/types/colors";
import { FC, SVGProps } from "react";
import { cn } from "@/lib/utils";

const ColorSampleVisual: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fill={props.fill}
      strokeWidth={2}
      stroke="currentColor"
      d="M0,0 H24 V24 H0 Z"
    />
  </svg>
);

const TransparentColorSampleVisual: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fill={props.fill}
      strokeWidth={2}
      stroke="currentColor"
      d="M0,0 H24 V24 H0 Z"
    />
    <path
      fill="currentColor"
      opacity="0.2"
      strokeWidth="0"
      d="M0,0 H12 V12 H0 Z"
    />
    <path
      fill="currentColor"
      opacity="0.2"
      strokeWidth="0"
      d="M12,12 H24 V24 H12 Z"
    />
  </svg>
);

type Props = {
  color: string;
  colors?: string[];
  onValueChange: (color: string) => void;
  className?: string;
  itemClassName?: string;
  size?: "default" | "sm" | "lg" | "icon-sm" | "icon-lg";
  variant?: "default" | "outline";
};

const ColorPicker = ({
  color,
  colors = defaultColors,
  onValueChange,
  className,
  itemClassName,
  size,
  variant,
}: Props) => {
  return (
    <ToggleGroup
      type="single"
      value={color}
      onValueChange={(v) => v && v !== color && onValueChange(v)}
      size={size}
      variant={variant}
      className={cn("flex flex-wrap justify-start max-w-48", className)}
    >
      {colors.map((c) => (
        <ToggleGroupItem
          key={c}
          value={c}
          title={c}
          className={cn(itemClassName)}
        >
          {c !== "transparent" && <ColorSampleVisual fill={c} />}
          {c === "transparent" && <TransparentColorSampleVisual />}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default ColorPicker;
