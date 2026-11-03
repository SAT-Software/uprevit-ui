import XLSX from "xlsx-js-style";
import type {
  ProductDataTableSchema,
  WorkbookSheet,
  CellFormat,
  DataType,
  WorkbookMetadata,
} from "@/types/product-data-table";
import {
  MAX_DECIMAL_PLACES,
  createWorkbookFormatResolver,
  WORKBOOK_FONT_SIZES,
  workbookNumber,
  workbookDateSerial,
} from "@/utils/product/workbook-cell-utils";
import { formatWorkbookDate } from "@/utils/product/workbook-date-format";
import {
  validateFileSize,
  validateDataBoundaries,
  validateCellCount,
} from "./import-validation";

const RAW_VALUE_NOTE_PREFIX = "uprevit:raw:";

interface ExportData extends WorkbookMetadata {
  headers: Record<number, string>;
  columnTypes: Record<number, DataType>;
  cells: Record<string, string>;
  columnCount: number;
  cellFormats?: Record<string, CellFormat>;
  columnOrder?: string[];
  columnSizing?: Record<string, number>;
}

function readSheetFormats(
  workbook: XLSX.WorkBook,
  sheetName: string,
): Record<string, CellFormat> {
  const files = (
    workbook as XLSX.WorkBook & {
      files?: Record<string, { content: Uint8Array | string }>;
    }
  ).files;
  const xml = (path: string) => {
    const content = files?.[path]?.content;
    return new DOMParser().parseFromString(
      typeof content === "string"
        ? content
        : content
          ? new TextDecoder().decode(content)
          : "",
      "application/xml",
    );
  };
  const sheet = Array.from(
    xml("xl/workbook.xml").getElementsByTagName("sheet"),
  ).find((element) => element.getAttribute("name") === sheetName);
  const relationship = Array.from(
    xml("xl/_rels/workbook.xml.rels").getElementsByTagName("Relationship"),
  ).find(
    (element) => element.getAttribute("Id") === sheet?.getAttribute("r:id"),
  );
  const target = relationship?.getAttribute("Target");
  if (!target) return {};
  const path = new URL(
    target,
    "https://workbook.invalid/xl/workbook.xml",
  ).pathname.slice(1);
  const styles = xml("xl/styles.xml");
  const fonts = styles.getElementsByTagName("fonts")[0]?.children;
  const fills = styles.getElementsByTagName("fills")[0]?.children;
  const xfs = styles.getElementsByTagName("cellXfs")[0]?.children;
  const result: Record<string, CellFormat> = {};
  const rgb = (element: Element | undefined) => {
    const value = element?.getAttribute("rgb");
    return value && /^(?:[a-f\d]{6}|[a-f\d]{8})$/i.test(value)
      ? `#${value.slice(-6).toLowerCase()}`
      : undefined;
  };
  for (const cell of Array.from(xml(path).getElementsByTagName("c"))) {
    const xf = xfs?.[Number(cell.getAttribute("s") ?? 0)];
    if (!xf) continue;
    const font = fonts?.[Number(xf.getAttribute("fontId") ?? 0)];
    const fill = fills?.[Number(xf.getAttribute("fillId") ?? 0)];
    const alignment = xf
      .getElementsByTagName("alignment")[0]
      ?.getAttribute("horizontal");
    const vertical = xf
      .getElementsByTagName("alignment")[0]
      ?.getAttribute("vertical");
    const size = Number(
      font?.getElementsByTagName("sz")[0]?.getAttribute("val"),
    );
    const format: CellFormat = {};
    const enabled = (tag: string) => {
      const element = font?.getElementsByTagName(tag)[0];
      return (
        element &&
        !["0", "false", "none"].includes(
          element.getAttribute("val")?.toLowerCase() ?? "",
        )
      );
    };
    if (enabled("b")) format.bold = true;
    if (enabled("i")) format.italic = true;
    if (enabled("u")) format.underline = true;
    if (WORKBOOK_FONT_SIZES.some((option) => option === size))
      format.fontSize = size;
    if (alignment === "left" || alignment === "center" || alignment === "right")
      format.alignment = alignment;
    if (vertical === "top" || vertical === "bottom")
      format.verticalAlignment = vertical;
    else if (vertical === "center") format.verticalAlignment = "middle";
    const textColor = rgb(font?.getElementsByTagName("color")[0]);
    const bgColor =
      fill
        ?.getElementsByTagName("patternFill")[0]
        ?.getAttribute("patternType") === "solid"
        ? rgb(fill?.getElementsByTagName("fgColor")[0])
        : undefined;
    if (textColor) format.textColor = textColor;
    if (bgColor) format.bgColor = bgColor;
    const address = cell.getAttribute("r");
    const numberFormat = address
      ? workbook.Sheets[sheetName]?.[address]?.z
      : undefined;
    const decimals =
      typeof numberFormat === "string"
        ? /^0(?:\.(0{1,10}))?(?:;|$)/.exec(numberFormat)
        : null;
    if (decimals) format.decimalPlaces = decimals[1]?.length ?? 0;
    if (address && Object.keys(format).length) result[address] = format;
  }
  return result;
}

const LAYOUT_NOTE = "uprevit:layout:v1:";
export function inspectWorkbookLayouts(file: ArrayBuffer) {
  validateFileSize(file);
  const workbook = XLSX.read(file, { cellStyles: true });
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const marker = sheet.A1?.c?.find((comment: XLSX.Comment) => comment.t?.includes(LAYOUT_NOTE))?.t;
    const count = Number(marker?.split(LAYOUT_NOTE)[1]?.split("\n")[0]);
    return { name, rows: sheet["!ref"] ? XLSX.utils.decode_range(sheet["!ref"]).e.r + 1 : 0, offset: marker && [0, 1, 2].includes(count) ? count : 0, known: !!marker && [0, 1, 2].includes(count) };
  });
}

export function parseWorkbookToTableData(file: ArrayBuffer, layouts: Record<string, number> = {}): ProductDataTableSchema {
  validateFileSize(file);

  const workbook = XLSX.read(file, {
    raw: true,
    cellStyles: true,
    cellNF: true,
    bookFiles: true,
  });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error("The file contains no sheets");
  }

  let totalCells = 0;
  const sheets: WorkbookSheet[] = workbook.SheetNames.map((name, index) => {
    const worksheet = workbook.Sheets[name];
    if (!worksheet) throw new Error(`Sheet "${name}" is missing`);
    if (worksheet["!merges"]?.length) throw new Error(`Sheet "${name}" contains merged cells. Unmerge them in Excel before importing; merged ranges cannot yet be edited safely.`);
    const marker = worksheet.A1?.c?.find((comment: XLSX.Comment) => comment.t?.includes(LAYOUT_NOTE))?.t;
    const offset = layouts[name] ?? (marker ? Number(marker.split(LAYOUT_NOTE)[1]?.split("\n")[0]) : 0);
    if (![0, 1, 2].includes(offset)) throw new Error(`Invalid layout for sheet "${name}"`);
    const headers: Record<number, string> = {};
    const columnTypes: ProductDataTableSchema["columnTypes"] = {};
    const headerRows = { count: offset as 1 | 2, formats: {} as Record<string, CellFormat>, heights: {} as Record<number, number> };
    const formats = readSheetFormats(workbook, name);
    const cells: Record<string, string> = {};
    const cellFormats: Record<string, CellFormat> = {};
    let maxRow = -1, maxCol = -1;
    for (const [address, cell] of Object.entries(worksheet)) {
      if (address.startsWith("!")) continue;
      const format = formats[address] ?? {};
      if (typeof cell.z === "string" && XLSX.SSF.is_date(cell.z)) {
        format.dateFormat = cell.z;
        format.date1904 = !!workbook.Workbook?.WBProps?.date1904;
      }
      if (cell.v == null && !Object.keys(format).length) continue;
      const { r, c } = XLSX.utils.decode_cell(address);
      validateDataBoundaries(Math.max(0, r + 1 - offset), c + 1);
      maxRow = Math.max(maxRow, r); maxCol = Math.max(maxCol, c);
      const workbookDate1904 = !!workbook.Workbook?.WBProps?.date1904;
      const originalDate1904 = cell.c?.some((comment: XLSX.Comment) => comment.t?.includes("uprevit:date1904")) || workbookDate1904;
      const original = cell.c?.map((comment: XLSX.Comment) => comment.t?.match(/(?:^|\n)[ \t]*uprevit:raw:([^\r\n]*)/)?.[1]).find((value: string | undefined) => value !== undefined);
      const matchesOriginal = original !== undefined && (format.dateFormat
        ? (workbookDateSerial(original, originalDate1904) ?? NaN) + (originalDate1904 ? 1462 : 0) === Number(cell.v) + (workbookDate1904 ? 1462 : 0)
        : workbookNumber(original) === cell.v);
      if (format.dateFormat) format.date1904 = matchesOriginal ? originalDate1904 : workbookDate1904;
      const value = matchesOriginal ? original! : /^0{2,}$/.test(cell.z ?? "") ? cell.w ?? String(cell.v ?? "") : String(cell.v ?? "");
      if (r < offset) {
        if (Object.keys(format).length) headerRows.formats[`${r},${c}`] = format;
        if (r === 0 && value) headers[c] = value;
        if (r === 1 && value) {
          if (!["constant", "variable", "na", "blank"].includes(value)) throw new Error(`Sheet "${name}" has an invalid classification at ${address}. Choose raw cells to keep it as data.`);
          if (value !== "blank") columnTypes[c] = value as "constant" | "variable" | "na";
        }
        continue;
      }
      const key = `${r - offset},${c}`;
      if (cell.v != null) cells[key] = value;
      if (format.dateFormat && cells[key] !== undefined) {
        const serial = workbookDateSerial(cells[key], format.date1904);
        if (serial !== undefined) { format.dateDisplay = formatWorkbookDate(format.dateFormat, serial, format.date1904); format.dateRaw = cells[key]; }
      }
      if (Object.keys(format).length) cellFormats[key] = format;
    }
    // OOXML style-only cells may not appear in SheetJS's value map.
    for (const [address, format] of Object.entries(formats)) {
      const { r, c } = XLSX.utils.decode_cell(address);
      validateDataBoundaries(Math.max(0, r + 1 - offset), c + 1);
      maxRow = Math.max(maxRow, r); maxCol = Math.max(maxCol, c);
      if (r < offset) headerRows.formats[`${r},${c}`] ??= format;
      else cellFormats[`${r - offset},${c}`] ??= format;
    }
    const rowHeights: Record<number, number> = {};
    worksheet["!rows"]?.forEach((row, r) => {
      const height = row?.hpt === undefined ? row?.hpx : row.hpt / 0.75;
      if (height !== undefined) { validateDataBoundaries(Math.max(0, r + 1 - offset), 1); const target = r < offset ? headerRows.heights : rowHeights; target[r < offset ? r : r - offset] = Math.max(24, Math.min(300, Math.round(height))); }
    });
    const columnWidths: Record<number, number> = {};
    worksheet["!cols"]?.forEach((col, c) => { if (col?.wpx !== undefined) { validateDataBoundaries(0, c + 1); columnWidths[c] = Math.max(50, Math.min(500, col.wpx)); } });
    for (const row of Object.keys(rowHeights)) { maxRow = Math.max(maxRow, Number(row) + offset); maxCol = Math.max(maxCol, 0); }
    for (const col of Object.keys(columnWidths)) maxCol = Math.max(maxCol, Number(col));
    totalCells += Math.max(1, maxRow + 1 - offset) * (maxCol + 1);
    validateCellCount(totalCells);
    return { id: `import-${index}`, name, data: { headers, columnTypes, cells, cellFormats, rowHeights, columnWidths, sheetLayout: offset ? undefined : "cells", headerRows: offset ? headerRows : undefined } };
  });
  return { headers: {}, columnTypes: {}, cells: {}, sheets } satisfies ProductDataTableSchema;
}

export function exportWorkbookSheets(sheets: WorkbookSheet[], filename: string) {
  const workbook = XLSX.utils.book_new();
  sheets.forEach((sheet) => {
    const columnSizing = Object.fromEntries(Object.entries(sheet.data.columnWidths ?? {}).map(([col, width]) => [`col-${col}`, width]));
    XLSX.utils.book_append_sheet(workbook, tableToWorksheet({ ...sheet.data, columnCount: 150, columnSizing }), sheet.name);
  });
  XLSX.writeFile(workbook, filename, { compression: true });
}

export function exportTableToWorkbook(data: ExportData, filename: string) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, tableToWorksheet(data), "Sheet1");
  XLSX.writeFile(workbook, filename, { compression: true });
}

function tableToWorksheet(data: ExportData) {
  const {
    headers,
    columnTypes,
    cells,
    columnCount,
    cellFormats = {},
    columnOrder = [],
    rowOrder = Array.from({ length: 5000 }, (_, row) => row),
    rowHeights = {},
    conditionalRules = [],
    columnSizing = {},
  } = data;
  const resolveFormat = createWorkbookFormatResolver(conditionalRules);
  const orderedColumns = [
    ...new Set([
      ...columnOrder.map((id) => Number(id.replace("col-", ""))),
      ...Array.from({ length: columnCount }, (_, col) => col),
    ]),
  ].filter((col) => Number.isInteger(col) && col >= 0 && col < columnCount);

  const usedColumns = new Set([
    ...Object.keys(headers).filter((col) => headers[Number(col)] !== "").map(Number),
    ...Object.keys(columnTypes).filter((col) => columnTypes[Number(col)] !== "blank").map(Number),
    ...Object.keys(cells).filter((key) => cells[key] !== "").map((key) => Number(key.split(",")[1])),
    ...Object.keys(cellFormats).map((key) => Number(key.split(",")[1])),
    ...Object.keys(data.headerRows?.formats ?? {}).map((key) => Number(key.split(",")[1])),
    ...Object.keys(columnSizing).map((id) => Number(id.replace("col-", ""))),
  ]);
  const lastColumn = orderedColumns.reduce((last, col, index) => usedColumns.has(col) || col !== index ? index : last, 0);
  const columns = orderedColumns.slice(0, lastColumn + 1);

  const headerRow: string[] = [];
  for (let col = 0; col < columns.length; col++) {
    headerRow.push(headers[columns[col]] || "");
  }

  const hasAnyDataType = data.headerRows?.count === 2 || Object.values(columnTypes).some(
    (type) => type && type !== "blank",
  );

  const typeRow: string[] = [];
  if (hasAnyDataType) {
    for (let col = 0; col < columns.length; col++) {
      typeRow.push(columnTypes[columns[col]] || "");
    }
  }

  const omitHeaders = data.sheetLayout === "cells" && !Object.keys(headers).length && !hasAnyDataType;
  const rowPositions = new Map(rowOrder.map((row, index) => [row, index]));
  let maxRow = 0;
  [...Object.keys(cells), ...Object.keys(cellFormats)].forEach((key) => {
    maxRow = Math.max(maxRow, rowPositions.get(Number(key.split(",")[0])) ?? 0);
  });
  for (const row of Object.keys(rowHeights))
    maxRow = Math.max(maxRow, rowPositions.get(Number(row)) ?? 0);

  const dataRows: string[][] = [];
  for (let row = 0; row <= maxRow; row++) {
    const rowData: string[] = [];
    for (let col = 0; col < columns.length; col++) {
      rowData.push(cells[`${rowOrder[row]},${columns[col]}`] ?? "");
    }
    dataRows.push(rowData);
  }

  const allRows: string[][] = omitHeaders ? [] : [headerRow];
  if (hasAnyDataType && !omitHeaders) allRows.push(typeRow);
  allRows.push(...dataRows);
  const worksheet = XLSX.utils.aoa_to_sheet(allRows);
  const headerOffset = omitHeaders ? 0 : hasAnyDataType ? 2 : 1;
  const exportFormats = { ...cellFormats };
  Object.entries(data.headerRows?.formats ?? {}).forEach(([key, format]) => {
    const [row, col] = key.split(",").map(Number);
    exportFormats[`${row - headerOffset},${col}`] = format;
  });
  const formatKeys = new Set([
    ...Object.keys(exportFormats),
    ...(conditionalRules.length ? Object.keys(cells) : []),
  ]);
  formatKeys.forEach((key) => {
    const format = resolveFormat(key, cells[key] ?? "", exportFormats[key]);
    const [row, col] = key.split(",").map(Number);
    const visualCol = columns.indexOf(col);
    if (row < -headerOffset || row >= 5000 || visualCol < 0) return;
    const address = XLSX.utils.encode_cell({
      r: (rowPositions.get(row) ?? row) + (omitHeaders ? 0 : hasAnyDataType ? 2 : 1),
      c: visualCol,
    });
    const cell = worksheet[address] ?? (worksheet[address] = { t: "s", v: "" });
    const hex = (value?: string) =>
      value && /^#[a-f\d]{6}$/i.test(value)
        ? value.slice(1).toUpperCase()
        : undefined;
    const bg = hex(format.bgColor);
    const color = hex(format.textColor);
    const raw = row < 0 ? String(cell.v ?? "") : cells[key] ?? "";
    const places = format.decimalPlaces;
    const number = workbookNumber(raw);
    const numberFormat =
      typeof places === "number" &&
      Number.isInteger(places) &&
      places >= 0 &&
      places <= MAX_DECIMAL_PLACES
        ? `0${places ? "." + "0".repeat(places) : ""}`
        : undefined;
    if (numberFormat && number !== undefined) {
      cell.t = "n";
      cell.v = number;
      cell.c = [{ a: "Uprevit", t: RAW_VALUE_NOTE_PREFIX + raw }];
    }
    const serial = format.dateFormat ? workbookDateSerial(raw, format.date1904) : undefined;
    if (serial !== undefined) {
      cell.t = "n";
      cell.v = serial + (format.date1904 ? 1462 : 0);
      cell.z = format.dateFormat;
      cell.c = [{ a: "Uprevit", t: RAW_VALUE_NOTE_PREFIX + raw }, ...(format.date1904 ? [{ a: "Uprevit", t: "uprevit:date1904" }] : [])];
    }
    cell.s = {
      font: {
        bold: format.bold,
        italic: format.italic,
        underline: format.underline,
        sz: format.fontSize,
        ...(color ? { color: { rgb: color } } : {}),
      },
      ...(bg ? { fill: { patternType: "solid", fgColor: { rgb: bg } } } : {}),
      alignment: {
        horizontal: format.alignment ?? "left",
        vertical:
          format.verticalAlignment === "middle" || !format.verticalAlignment
            ? "center"
            : format.verticalAlignment,
      },
      ...(serial !== undefined ? { numFmt: format.dateFormat } : numberFormat ? { numFmt: numberFormat } : {}),
    };
  });
  worksheet["!rows"] = rowOrder
    .slice(0, maxRow + 1)
    .reduce<XLSX.RowInfo[]>((rows, row, index) => {
      if (rowHeights[row] !== undefined)
        rows[index + (omitHeaders ? 0 : hasAnyDataType ? 2 : 1)] = {
          hpt: rowHeights[row] * 0.75,
        };
      return rows;
    }, []);
  Object.entries(data.headerRows?.heights ?? {}).forEach(([row, height]) => { worksheet["!rows"]![Number(row)] = { hpt: height * 0.75 }; });
  worksheet.A1 ??= { t: "s", v: "" };
  worksheet.A1.c = [...(worksheet.A1.c ?? []), { a: "Uprevit", t: LAYOUT_NOTE + headerOffset }];
  worksheet["!cols"] = columns.map((col) => ({
    wpx: columnSizing[`col-${col}`] ?? 150,
  }));
  return worksheet;
}
