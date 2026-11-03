import { formatWorkbookDate } from "@/utils/product/workbook-date-format";

export function workbookDateSerial(value: string, date1904 = false): number | undefined {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const time = Date.parse(value + "T00:00:00Z");
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) return undefined;
    const days = time / 86400000;
    return date1904 ? days + 24107 : days + 25569 - (value < "1900-03-01" ? 1 : 0);
  }
  if (/^\d+(?:\.\d+)?$/.test(value) && Number(value) < 2958466) return Number(value);
  return undefined;
}

import type {
  CellFormat,
  WorkbookConditionalRule,
} from "@/types/product-data-table";
import {
  IMPORT_LIMITS,
  validateCellCount,
  validateDataBoundaries,
} from "@/lib/import-validation";

export const WORKBOOK_FONT_SIZES = [10, 12, 14, 16, 18, 20, 24] as const;
export const MAX_DECIMAL_PLACES = 10;

export function workbookNumber(value: string): number | undefined {
  if (!/^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) return undefined;
  const number = Number(value);
  if (
    !Number.isFinite(number) ||
    Math.abs(number) >= 1e15 ||
    value.replace(/[^0-9]/g, "").length > 15
  )
    return undefined;
  return number;
}

export function workbookDecimalPlaces(value: string): number {
  return Math.min(MAX_DECIMAL_PLACES, value.split(".")[1]?.length ?? 0);
}

export function formatWorkbookValue(
  value: string,
  format?: CellFormat,
): string {
  if (format?.dateFormat) {
    const serial = workbookDateSerial(value, format.date1904);
    if (serial !== undefined) return formatWorkbookDate(format.dateFormat, serial, format.date1904);
  }
  const number = workbookNumber(value);
  const places = format?.decimalPlaces;
  return number !== undefined &&
    Number.isInteger(places) &&
    places! >= 0 &&
    places! <= MAX_DECIMAL_PLACES
    ? number.toFixed(places)
    : value;
}

export function createWorkbookFill(seeds: string[]): (index: number) => string {
  if (seeds.length > 1) {
    const numbers = seeds.map(workbookNumber);
    if (
      numbers.every((number) => number !== undefined) &&
      seeds.every(
        (value) => (value.split(".")[1]?.length ?? 0) <= MAX_DECIMAL_PLACES,
      )
    ) {
      const precision = Math.max(...seeds.map(workbookDecimalPlaces));
      const scaled = seeds.map((value) => {
        const [whole, fraction = ""] = value.split(".");
        return BigInt(whole + fraction.padEnd(precision, "0"));
      });
      const step = scaled[1] - scaled[0];
      if (step === BigInt(0)) return (index) => seeds[index % seeds.length];
      if (
        scaled.every((value, i) => i === 0 || value - scaled[i - 1] === step)
      ) {
        return (index) => {
          const next = scaled[0] + step * BigInt(index);
          const digits = next
            .toString()
            .replace("-", "")
            .padStart(precision + 1, "0");
          const value = precision
            ? `${digits.slice(0, -precision)}.${digits.slice(-precision)}`.replace(
                /\.?0+$/,
                "",
              )
            : digits;
          const result = (next < BigInt(0) ? "-" : "") + value;
          return workbookNumber(result) !== undefined
            ? result
            : seeds[index % seeds.length];
        };
      }
    }
  }
  return (index) => seeds[index % seeds.length] ?? "";
}

export function parseWorkbookClipboard(html: string, text: string): string[][] {
  const encoder = new TextEncoder();
  if (
    encoder.encode(html).byteLength + encoder.encode(text).byteLength >
    IMPORT_LIMITS.MAX_FILE_SIZE_BYTES
  )
    throw new Error("Clipboard content exceeds 5MB");
  let rows: string[][] = [];
  if (html) {
    const document = new DOMParser().parseFromString(html, "text/html");
    document
      .querySelectorAll("script,style,template")
      .forEach((element) => element.remove());
    let table = document.querySelector("table");
    // Word can wrap the copied grid in a single-cell layout table.
    while (table) {
      const ownCells = Array.from(table.rows).filter((row) => row.closest("table") === table).flatMap((row) => Array.from(row.cells));
      const nested = ownCells.length === 1 ? ownCells[0].querySelector("table") : null;
      if (!nested || table.textContent?.trim() !== nested.textContent?.trim()) break;
      table = nested;
    }
    if (table) {
      const occupied = new Set<string>();
      Array.from(table.rows)
        .filter((row) => row.closest("table") === table)
        .forEach((row, r) => {
          rows[r] ??= [];
          let c = 0;
          Array.from(row.cells).forEach((cell) => {
            while (occupied.has(`${r},${c}`)) c++;
            const width = Math.max(1, cell.colSpan);
            const height = Math.max(1, cell.rowSpan);
            validateDataBoundaries(r + height, c + width);
            cell.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
            cell
              .querySelectorAll("p,div,li")
              .forEach((block) => block.append("\n"));
            for (let dr = 0; dr < height; dr++) {
              rows[r + dr] ??= [];
              for (let dc = 0; dc < width; dc++) {
                rows[r + dr][c + dc] =
                  dr === 0 && dc === 0
                    ? (cell.textContent ?? "").replace(/\r\n?/g, "\n").trim()
                    : "";
                occupied.add(`${r + dr},${c + dc}`);
              }
            }
            c += width;
          });
        });
    }
  }
  if (!rows.length) {
    rows = [[]];
    let value = "";
    let quoted = false;
    const normalized = text.replace(/\r\n?/g, "\n");
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (char === '"' && (quoted || value === "")) {
        if (quoted && normalized[i + 1] === '"') {
          value += '"';
          i++;
        } else quoted = !quoted;
      } else if (!quoted && (char === "\t" || char === "\n")) {
        rows[rows.length - 1].push(value);
        value = "";
        if (char === "\n") rows.push([]);
      } else value += char;
    }
    rows[rows.length - 1].push(value);
    if (
      normalized.endsWith("\n") &&
      rows[rows.length - 1].length === 1 &&
      rows[rows.length - 1][0] === ""
    )
      rows.pop();
  }
  const width = Math.max(0, ...rows.map((row) => row.length));
  validateDataBoundaries(rows.length, width);
  validateCellCount(rows.length * width);
  return rows.map((row) =>
    Array.from({ length: width }, (_, c) => row[c] ?? ""),
  );
}

export function workbookRuleMatches(
  value: string,
  rule: WorkbookConditionalRule,
): boolean {
  if (rule.operator === "contains")
    return value.toLowerCase().includes(rule.value.toLowerCase());
  const number = workbookNumber(value);
  const threshold = workbookNumber(rule.value);
  if (number === undefined || threshold === undefined) return false;
  return rule.operator === "gt"
    ? number > threshold
    : rule.operator === "lt"
      ? number < threshold
      : number === threshold;
}

export function createWorkbookFormatResolver(rules: WorkbookConditionalRule[]) {
  const compiled = rules.map((rule) => ({
    rule,
    rows: new Set(rule.rows),
    columns: new Set(rule.columns),
  }));
  return (key: string, value: string, manual?: CellFormat): CellFormat => {
    const [row, column] = key.split(",").map(Number);
    let format = manual ?? {};
    for (const { rule, rows, columns } of compiled) {
      if (
        !rows.has(row) ||
        !columns.has(column) ||
        !workbookRuleMatches(value, rule)
      )
        continue;
      format = {
        ...format,
        ...(rule.bgColor ? { bgColor: rule.bgColor } : {}),
        ...(rule.textColor ? { textColor: rule.textColor } : {}),
      };
    }
    return format;
  };
}

export function placeRemovedAtBasePosition<T>(
  order: T[],
  baseOrder: T[],
  isRemoved: (id: T) => boolean,
): T[] {
  const removed = new Set(order.filter(isRemoved));
  if (!removed.size) return order;
  const after = new Map<T | null, T[]>();
  let anchor: T | null = null;
  for (const id of baseOrder) {
    if (!removed.has(id)) {
      anchor = id;
      continue;
    }
    const list = after.get(anchor) ?? [];
    list.push(id);
    after.set(anchor, list);
  }
  const result = [...(after.get(null) ?? [])];
  for (const id of order) {
    if (!removed.has(id)) result.push(id, ...(after.get(id) ?? []));
  }
  return result;
}
