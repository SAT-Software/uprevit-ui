import XLSX from "xlsx-js-style";
import type { DataType } from "@/types/product-data-table";

const VALID_DATA_TYPES: DataType[] = ["blank", "constant", "variable", "na"];

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
