export const IMPORT_LIMITS = {
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  MAX_ROWS: 5000,
  MAX_COLUMNS: 150,
  MAX_SHEETS: 1,
  MAX_CELLS: 5000 * 150,
} as const;

export function validateFileSize(file: ArrayBuffer): void {
  if (file.byteLength > IMPORT_LIMITS.MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File too large. Maximum size is ${IMPORT_LIMITS.MAX_FILE_SIZE_MB}MB`
    );
  }
}

export function validateSheetCount(sheetNames: string[]): void {
  if (sheetNames.length > IMPORT_LIMITS.MAX_SHEETS) {
    throw new Error(
      `Too many sheets. Only ${IMPORT_LIMITS.MAX_SHEETS} sheet is supported`
    );
  }
}

export function validateDataBoundaries(
  rowCount: number,
  columnCount: number
): void {
  if (rowCount > IMPORT_LIMITS.MAX_ROWS) {
    throw new Error(`Too many rows. Maximum is ${IMPORT_LIMITS.MAX_ROWS} rows`);
  }

  if (columnCount > IMPORT_LIMITS.MAX_COLUMNS) {
    throw new Error(
      `Too many columns. Maximum is ${IMPORT_LIMITS.MAX_COLUMNS} columns`
    );
  }
}

export function validateCellCount(cellCount: number): void {
  if (cellCount > IMPORT_LIMITS.MAX_CELLS) {
    throw new Error(
      `Too many cells. Maximum is ${IMPORT_LIMITS.MAX_CELLS.toLocaleString()} cells`
    );
  }
}
