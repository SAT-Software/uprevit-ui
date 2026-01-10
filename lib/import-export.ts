import XLSX from "xlsx-js-style";
import type { DataType } from "@/types/product-data-table";

const VALID_DATA_TYPES: DataType[] = ["blank", "constant", "variable", "na"];

interface ExportData {
  headers: Record<number, string>;
  columnTypes: Record<number, DataType>;
  cells: Record<string, string>;
  columnCount: number;
}

function isDataTypeRow(row: (string | number | undefined)[]): boolean {
  if (!row || row.length === 0) return false;

  const nonEmptyCells = row.filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== ""
  );

  if (nonEmptyCells.length === 0) return false;

  return nonEmptyCells.every((val) => {
    const normalized = String(val).toLowerCase().trim();
    return VALID_DATA_TYPES.includes(normalized as DataType);
  });
}

export function parseWorkbookToTableData(file: ArrayBuffer) {
  const workbook = XLSX.read(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const rawData: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(
    worksheet,
    { header: 1, defval: undefined }
  );

  if (rawData.length === 0) return { headers: {}, columnTypes: {}, cells: {} };

  const headers: Record<number, string> = {};
  const headerRow = rawData[0] || [];
  headerRow.forEach((val, colIndex) => {
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      headers[colIndex] = String(val);
    }
  });

  const typeRow = rawData[1] || [];
  const hasDataTypeRow = isDataTypeRow(typeRow);

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

  const dataStartRow = hasDataTypeRow ? 2 : 1;
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

  return { headers, columnTypes, cells };
}

export function exportTableToWorkbook(data: ExportData, filename: string) {
  const { headers, columnTypes, cells, columnCount } = data;

  const headerRow: string[] = [];
  for (let col = 0; col < columnCount; col++) {
    headerRow.push(headers[col] || "");
  }

  const hasAnyDataType = Object.values(columnTypes).some(
    (type) => type && type !== "blank"
  );

  const typeRow: string[] = [];
  if (hasAnyDataType) {
    for (let col = 0; col < columnCount; col++) {
      typeRow.push(columnTypes[col] || "");
    }
  }

  let maxRow = 0;
  Object.keys(cells).forEach((key) => {
    const rowIndex = parseInt(key.split(",")[0]);
    if (rowIndex > maxRow) maxRow = rowIndex;
  });

  const dataRows: string[][] = [];
  for (let row = 0; row <= maxRow; row++) {
    const rowData: string[] = [];
    for (let col = 0; col < columnCount; col++) {
      rowData.push(cells[`${row},${col}`] || "");
    }
    dataRows.push(rowData);
  }

  const allRows: string[][] = [headerRow];
  if (hasAnyDataType) allRows.push(typeRow);
  allRows.push(...dataRows);
  const worksheet = XLSX.utils.aoa_to_sheet(allRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename, { compression: true });
}
