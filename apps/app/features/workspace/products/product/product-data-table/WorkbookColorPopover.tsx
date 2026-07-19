"use client";

import { useState, type ComponentProps } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import {
  NO_FILL_COLOR,
  isDefaultWorkbookTextColor,
} from "@/utils/product/workbook-cell-colors";

type WorkbookColorPopoverProps = {
  icon: ComponentProps<typeof Icon>["icon"];
  label: string;
  colors: readonly string[];
  currentColor: string | undefined;
  isMixed: boolean;
  disabled?: boolean;
  variant: "fill" | "text";
  onSelect: (color: string) => void;
};

function ColorSwatch({
  color,
  variant,
  isSelected,
  onClick,
}: {
  color: string;
  variant: "fill" | "text";
  isSelected: boolean;
  onClick: () => void;
}) {
  const isNoFill = variant === "fill" && color === NO_FILL_COLOR;
  const isDefaultText = variant === "text" && isDefaultWorkbookTextColor(color);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "size-6 rounded border border-border transition-all hover:ring-2 hover:ring-primary/50",
        isSelected && "ring-2 ring-primary",
        variant === "text" && "flex items-center justify-center",
      )}
      style={
        isNoFill
          ? {
              backgroundColor: "var(--background)",
              backgroundImage:
                "linear-gradient(135deg, transparent 44%, rgba(248, 113, 113, 0.9) 44%, rgba(248, 113, 113, 0.9) 56%, transparent 56%)",
            }
          : variant === "fill"
            ? { backgroundColor: color }
            : undefined
      }
      title={isNoFill ? "No fill" : isDefaultText ? "Default" : color}
    >
      {variant === "text" && (
        <span className="text-xs font-bold" style={{ color }}>
          A
        </span>
      )}
    </button>
  );
}

function ColorIndicatorBar({
  color,
  isMixed,
  variant,
}: {
  color: string | undefined;
  isMixed: boolean;
  variant: "fill" | "text";
}) {
  if (isMixed) {
    return (
      <span
        className="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #a1a1aa 0%, #a1a1aa 40%, transparent 40%, transparent 60%, #a1a1aa 60%, #a1a1aa 100%)",
        }}
      />
    );
  }

  const isNoFill = variant === "fill" && (!color || color === NO_FILL_COLOR);

  return (
    <span
      className="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full border border-border/50"
      style={
        isNoFill
          ? {
              backgroundColor: "var(--background)",
              backgroundImage:
                "linear-gradient(135deg, transparent 44%, rgba(248, 113, 113, 0.9) 44%, rgba(248, 113, 113, 0.9) 56%, transparent 56%)",
            }
          : { backgroundColor: color ?? "currentColor" }
      }
    />
  );
}

export function WorkbookColorPopover({
  icon,
  label,
  colors,
  currentColor,
  isMixed,
  disabled,
  variant,
  onSelect,
}: WorkbookColorPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (color: string) => {
    onSelect(color);
    setOpen(false);
  };

  const isSelected = (color: string) => {
    if (isMixed) return false;
    if (variant === "fill") {
      const normalized = currentColor ?? NO_FILL_COLOR;
      return color === normalized;
    }
    if (isDefaultWorkbookTextColor(color)) {
      return isDefaultWorkbookTextColor(currentColor);
    }
    return color === currentColor;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className={cn("relative hover:bg-muted-foreground/20")}
          title={label}
        >
          <Icon icon={icon} size={16} strokeWidth={2} />
          <ColorIndicatorBar
            color={currentColor}
            isMixed={isMixed}
            variant={variant}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-4 gap-1.5">
          {colors.map((color) => (
            <ColorSwatch
              key={`${variant}-${color}`}
              color={color}
              variant={variant}
              isSelected={isSelected(color)}
              onClick={() => handleSelect(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
