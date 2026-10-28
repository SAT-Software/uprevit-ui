import type { CellFormat } from "@/types/product-data-table";
import { WORKBOOK_FONT_SIZES } from "@/utils/product/workbook-cell-utils";
import { Button } from "@uprevit/ui/components/ui/button";
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
}: {
  formats: CellFormat[];
  disabled: boolean;
  onFormat: (format: Partial<CellFormat>) => void;
  onDecimals: (change: number) => void;
}) {
  const all = (key: "bold" | "italic" | "underline") =>
    formats.length > 0 && formats.every((format) => format[key]);
  const fontSize = formats[0]?.fontSize ?? 14;
  const sameSize = formats.every(
    (format) => (format.fontSize ?? 14) === fontSize,
  );
  const alignment = formats[0]?.alignment ?? "left";
  const sameAlignment = formats.every(
    (format) => (format.alignment ?? "left") === alignment,
  );
  return (
    <div
      className="flex min-w-0 max-w-full flex-wrap items-center gap-1 border-x border-border px-2"
      role="group"
      aria-label="Cell text formatting"
    >
      {(["bold", "italic", "underline"] as const).map((key) => (
        <Button
          key={key}
          aria-label={key[0].toUpperCase() + key.slice(1)}
          aria-pressed={all(key)}
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
      <Select
        disabled={disabled}
        value={sameSize ? String(fontSize) : ""}
        onValueChange={(value) => onFormat({ fontSize: Number(value) })}
      >
        <SelectTrigger aria-label="Font size" className="h-7 w-18 text-xs">
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
      <Select
        disabled={disabled}
        value={sameAlignment ? alignment : ""}
        onValueChange={(value) =>
          onFormat({ alignment: value as CellFormat["alignment"] })
        }
      >
        <SelectTrigger aria-label="Text alignment" className="h-7 w-24 text-xs">
          <SelectValue placeholder="Mixed" />
        </SelectTrigger>
        <SelectContent>
          {(["left", "center", "right"] as const).map((value) => (
            <SelectItem key={value} value={value}>
              {value[0].toUpperCase() + value.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        aria-label="Decrease decimal places"
        title="Decrease decimal places"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onDecimals(-1)}
      >
        .0
      </Button>
      <Button
        aria-label="Increase decimal places"
        title="Increase decimal places"
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onDecimals(1)}
      >
        .00
      </Button>
    </div>
  );
}
