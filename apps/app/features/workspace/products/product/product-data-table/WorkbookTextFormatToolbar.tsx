import type { ReactNode } from "react";
import type { CellFormat } from "@/types/product-data-table";
import { WORKBOOK_FONT_SIZES } from "@/utils/product/workbook-cell-utils";
import { Button } from "@uprevit/ui/components/ui/button";
import { ButtonGroup } from "@uprevit/ui/components/ui/button-group";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  TextAlignLeft01Icon,
  TextAlignCenterIcon,
  TextAlignRight01Icon,
  LayoutAlignTopIcon,
  AlignVerticalCenterIcon,
  LayoutAlignBottomIcon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";


export function WorkbookTextFormatToolbar({
  formats,
  disabled,
  onFormat,
  onDecimals,
  children,
}: {
  formats: CellFormat[];
  disabled: boolean;
  onFormat: (format: Partial<CellFormat>) => void;
  onDecimals: (change: number) => void;
  children: ReactNode;
}) {
  const all = (key: "bold" | "italic" | "underline") =>
    formats.length > 0 && formats.every((format) => format[key]);
  const fontSize = formats[0]?.fontSize ?? 14;
  const sameSize = formats.every(
    (format) => (format.fontSize ?? 14) === fontSize,
  );
  const separator = <div className="h-4 w-px shrink-0 bg-border" />;
  return (
    <div
      className="flex max-w-full flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Cell formatting"
    >
      <ButtonGroup aria-label="Text style">
        {(["bold", "italic", "underline"] as const).map((key) => (
          <Button
            key={key}
            aria-label={key[0].toUpperCase() + key.slice(1)}
            aria-pressed={
              all(key)
                ? true
                : formats.some((format) => format[key])
                  ? "mixed"
                  : false
            }
            title={key[0].toUpperCase() + key.slice(1)}
            variant={all(key) ? "secondary" : "outline"}
            size="icon-xs"
            disabled={disabled}
            onClick={() => onFormat({ [key]: !all(key) })}
          >
            <span
              className={
                key === "bold"
                  ? "font-bold"
                  : key === "italic"
                    ? "italic"
                    : "underline"
              }
            >
              {key === "bold" ? "B" : key === "italic" ? "I" : "U"}
            </span>
          </Button>
        ))}
      </ButtonGroup>
      <Select
        disabled={disabled}
        value={sameSize ? String(fontSize) : ""}
        onValueChange={(value) => onFormat({ fontSize: Number(value) })}
      >
        <SelectTrigger aria-label="Font size" className="h-7 w-16 text-xs">
          <SelectValue placeholder="Mixed" />
        </SelectTrigger>
        <SelectContent>
          {WORKBOOK_FONT_SIZES.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {separator}
      <ButtonGroup aria-label="Cell colors">{children}</ButtonGroup>
      {separator}
      {(
        [
          {
            key: "alignment",
            label: "Horizontal alignment",
            fallback: "left",
            options: [
              { value: "left", label: "Align left", icon: TextAlignLeft01Icon },
              {
                value: "center",
                label: "Align center",
                icon: TextAlignCenterIcon,
              },
              {
                value: "right",
                label: "Align right",
                icon: TextAlignRight01Icon,
              },
            ],
          },
          {
            key: "verticalAlignment",
            label: "Vertical alignment",
            fallback: "middle",
            options: [
              { value: "top", label: "Align top", icon: LayoutAlignTopIcon },
              {
                value: "middle",
                label: "Align middle",
                icon: AlignVerticalCenterIcon,
              },
              {
                value: "bottom",
                label: "Align bottom",
                icon: LayoutAlignBottomIcon,
              },
            ],
          },
        ] as const
      ).map(({ key, label, fallback, options }) => {
        const first = formats[0]?.[key] ?? fallback;
        const mixed = formats.some(
          (format) => (format[key] ?? fallback) !== first,
        );
        return (
          <ButtonGroup key={key} aria-label={label}>
            {options.map(({ value, label, icon }) => {
              const pressed = formats.length > 0 && !mixed && first === value;
              return (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-xs"
                      variant={pressed ? "secondary" : "outline"}
                      disabled={disabled}
                      aria-label={label}
                      aria-pressed={mixed ? "mixed" : pressed}
                      onClick={() => onFormat({ [key]: value })}
                    >
                      <Icon icon={icon} size={14} strokeWidth={2} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {label}
                    {mixed ? " (mixed selection)" : ""}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </ButtonGroup>
        );
      })}
      {separator}
      <ButtonGroup aria-label="Decimal places">
        <Button
          aria-label="Decrease decimal places"
          title="Decrease decimal places"
          size="icon-xs"
          variant="outline"
          disabled={disabled}
          onClick={() => onDecimals(-1)}
        >
          .0
        </Button>
        <Button
          aria-label="Increase decimal places"
          title="Increase decimal places"
          size="icon-xs"
          variant="outline"
          disabled={disabled}
          onClick={() => onDecimals(1)}
        >
          .00
        </Button>
      </ButtonGroup>
    </div>
  );
}
