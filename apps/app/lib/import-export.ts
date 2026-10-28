import XLSX from "xlsx-js-style";
import type { CellFormat, DataType } from "@/types/product-data-table";
import {
  MAX_DECIMAL_PLACES,
  WORKBOOK_FONT_SIZES,
  workbookNumber,
} from "@/utils/product/workbook-cell-utils";
import {
  validateFileSize,
  validateDataBoundaries,
  validateCellCount,
} from "./import-validation";

const VALID_DATA_TYPES: DataType[] = ["blank", "constant", "variable", "na"];
const RAW_VALUE_NOTE_PREFIX = "uprevit:raw:";

interface ExportData {
  headers: Record<number, string>;
  columnTypes: Record<number, DataType>;
  cells: Record<string, string>;
  columnCount: number;
  cellFormats?: Record<string, CellFormat>;
  columnOrder?: string[];
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

function isDataTypeRow(row: (string | number | undefined)[]): boolean {
  if (!row || row.length === 0) return false;

  const nonEmptyCells = row.filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== "",
  );

  if (nonEmptyCells.length === 0) return false;

  return nonEmptyCells.every((val) => {
    const normalized = String(val).toLowerCase().trim();
    return VALID_DATA_TYPES.includes(normalized as DataType);
  });
}

export function parseWorkbookToTableData(file: ArrayBuffer) {
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

  const isMultiSheet = workbook.SheetNames.length > 1;
  const rawData: (string | number | undefined)[][] = [];
  const rawFormats: Record<string, CellFormat> = {};
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) throw new Error(`Sheet "${sheetName}" is empty or missing`);
    if (!worksheet["!ref"]) continue;
    const hasValues = Object.entries(worksheet).some(
      ([key, cell]) =>
        !key.startsWith("!") && cell?.v != null && String(cell.v).trim() !== "",
    );
    const sheetFormats = readSheetFormats(workbook, sheetName);
    if (!hasValues && Object.keys(sheetFormats).length === 0) continue;

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const sheetRows = range.e.r - range.s.r + 1;
    const separatorRows = isMultiSheet ? (rawData.length ? 2 : 1) : 0;
    validateDataBoundaries(
      rawData.length + sheetRows + separatorRows,
      range.e.c + 1,
    );

    const rows = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(
      worksheet,
      { header: 1, defval: undefined },
    );
    if (isMultiSheet) {
      if (rawData.length) rawData.push([]);
      rawData.push([sheetName]);
    }
    const rowOffset = rawData.length - range.s.r;
    Object.entries(sheetFormats).forEach(
      ([address, format]) => {
        const { r, c } = XLSX.utils.decode_cell(address);
        if (r >= range.s.r && r <= range.e.r && c < 150)
          rawFormats[`${r + rowOffset},${c}`] = format;
      },
    );
    Object.entries(worksheet).forEach(([address, cell]) => {
      if (address.startsWith("!") || typeof cell?.v !== "number") return;
      const { r, c } = XLSX.utils.decode_cell(address);
      const original = cell.c
        ?.find((comment: XLSX.Comment) =>
          comment.t?.startsWith(RAW_VALUE_NOTE_PREFIX),
        )
        ?.t?.slice(RAW_VALUE_NOTE_PREFIX.length);
      if (rows[r - range.s.r]) {
        if (original !== undefined && workbookNumber(original) === cell.v)
          rows[r - range.s.r][c] = original;
        else if (/^0{2,}$/.test(cell.z ?? ""))
          rows[r - range.s.r][c] = cell.w ?? String(cell.v);
      }
    });
    rows.forEach((row) => rawData.push(row));
  }

  if (rawData.length === 0)
    return { headers: {}, columnTypes: {}, cells: {}, cellFormats: {} };

  const maxColumnCount = Math.max(...rawData.map((row) => row?.length || 0));
  validateDataBoundaries(rawData.length, maxColumnCount);

  const headers: Record<number, string> = {};
  const headerRow = isMultiSheet ? [] : rawData[0] || [];
  headerRow.forEach((val, colIndex) => {
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      headers[colIndex] = String(val);
    }
  });

  const typeRow = rawData[1] || [];
  const hasDataTypeRow = !isMultiSheet && isDataTypeRow(typeRow);

  const columnTypes: Record<number, "constant" | "variable" | "na"> = {};
  if (hasDataTypeRow) {
    typeRow.forEach((val, colIndex) => {
      if (val !== undefined && val !== null) {
        const normalized = String(val).toLowerCase().trim();
        if (
          normalized !== "blank" &&
          VALID_DATA_TYPES.includes(normalized as DataType)
        ) {
          columnTypes[colIndex] = normalized as "constant" | "variable" | "na";
        }
      }
    });
  }

  const dataStartRow = isMultiSheet ? 0 : hasDataTypeRow ? 2 : 1;
  const cells: Record<string, string> = {};
  for (let rowIndex = dataStartRow; rowIndex < rawData.length; rowIndex++) {
    const row = rawData[rowIndex];
    if (!row) continue;

    row.forEach((val, colIndex) => {
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        cells[`${rowIndex - dataStartRow},${colIndex}`] = String(val);
      }
    });
  }

  validateCellCount(Object.keys(cells).length);

  const cellFormats: Record<string, CellFormat> = {};
  Object.entries(rawFormats).forEach(([key, format]) => {
    const [r, c] = key.split(",").map(Number);
    if (r >= dataStartRow) cellFormats[`${r - dataStartRow},${c}`] = format;
  });
  return { headers, columnTypes, cells, cellFormats };
}

export function exportTableToWorkbook(data: ExportData, filename: string) {
  const {
    headers,
    columnTypes,
    cells,
    columnCount,
    cellFormats = {},
    columnOrder = [],
  } = data;
  const columns = [
    ...new Set([
      ...columnOrder.map((id) => Number(id.replace("col-", ""))),
      ...Array.from({ length: columnCount }, (_, col) => col),
    ]),
  ].filter((col) => Number.isInteger(col) && col >= 0 && col < columnCount);

  const headerRow: string[] = [];
  for (let col = 0; col < columnCount; col++) {
    headerRow.push(headers[columns[col]] || "");
  }

  const hasAnyDataType = Object.values(columnTypes).some(
    (type) => type && type !== "blank",
  );

  const typeRow: string[] = [];
  if (hasAnyDataType) {
    for (let col = 0; col < columnCount; col++) {
      typeRow.push(columnTypes[columns[col]] || "");
    }
  }

  let maxRow = 0;
  [...Object.keys(cells), ...Object.keys(cellFormats)].forEach((key) => {
    const rowIndex = parseInt(key.split(",")[0]);
    if (rowIndex > maxRow) maxRow = rowIndex;
  });

  const dataRows: string[][] = [];
  for (let row = 0; row <= maxRow; row++) {
    const rowData: string[] = [];
    for (let col = 0; col < columnCount; col++) {
      rowData.push(cells[`${row},${columns[col]}`] ?? "");
    }
    dataRows.push(rowData);
  }

  const allRows: string[][] = [headerRow];
  if (hasAnyDataType) allRows.push(typeRow);
  allRows.push(...dataRows);
  const worksheet = XLSX.utils.aoa_to_sheet(allRows);
  Object.entries(cellFormats).forEach(([key, format]) => {
    const [row, col] = key.split(",").map(Number);
    const visualCol = columns.indexOf(col);
    if (row < 0 || row >= 5000 || visualCol < 0) return;
    const address = XLSX.utils.encode_cell({
      r: row + (hasAnyDataType ? 2 : 1),
      c: visualCol,
    });
    const cell = worksheet[address] ?? (worksheet[address] = { t: "s", v: "" });
    const hex = (value?: string) =>
      value && /^#[a-f\d]{6}$/i.test(value)
        ? value.slice(1).toUpperCase()
        : undefined;
    const bg = hex(format.bgColor);
    const color = hex(format.textColor);
    const raw = cells[key] ?? "";
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
    cell.s = {
      font: {
        bold: format.bold,
        italic: format.italic,
        underline: format.underline,
        sz: format.fontSize,
        ...(color ? { color: { rgb: color } } : {}),
      },
      ...(bg ? { fill: { patternType: "solid", fgColor: { rgb: bg } } } : {}),
      alignment: { horizontal: format.alignment ?? "left" },
      ...(numberFormat ? { numFmt: numberFormat } : {}),
    };
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename, { compression: true });
}
