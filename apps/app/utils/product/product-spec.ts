import {
  CellFormat,
  DataType,
  ProductDataTableSchema,
  WorkbookMetadata,
} from "@/types/product-data-table";

export function sparseProductSpecDataForDatabase(
  headerData: Record<number, string>,
  columnTypeData: Record<number, DataType>,
  cellData: Record<string, string>,
  cellFormats: Record<string, CellFormat>,
  columnOrder: string[],
  columnSizing: Record<string, number>,
  metadata: WorkbookMetadata = {},
): ProductDataTableSchema {
  const headers: Record<number, string> = {};
  Object.entries(headerData).forEach(([key, value]) => {
    if (value && value.trim()) {
      headers[Number(key)] = value;
    }
  });

  const columnTypes: Record<number, "constant" | "variable" | "na"> = {};
  Object.entries(columnTypeData).forEach(([key, value]) => {
    if (value && value !== "blank") {
      columnTypes[Number(key)] = value as "constant" | "variable" | "na";
    }
  });

  const cells: Record<string, string> = {};
  Object.entries(cellData).forEach(([key, value]) => {
    if (value && value.trim()) {
      cells[key] = value;
    }
  });

  const formats: Record<string, CellFormat> = {};
  Object.entries(cellFormats).forEach(([key, value]) => {
    if (Object.values(value).some((property) => property !== undefined)) {
      formats[key] = value;
    }
  });

  const columnWidths: Record<number, number> = {};
  Object.entries(columnSizing).forEach(([colId, width]) => {
    const colIndex = parseInt(colId.split("-")[1]);
    if (!isNaN(colIndex) && width) {
      columnWidths[colIndex] = width;
    }
  });

  return {
    sheetLayout: metadata.sheetLayout,
    headerRows: metadata.headerRows,
    rowOrder: metadata.rowOrder?.some((row, index) => row !== index)
      ? metadata.rowOrder
      : undefined,
    rowHeights: Object.keys(metadata.rowHeights ?? {}).length
      ? metadata.rowHeights
      : undefined,
    conditionalRules: metadata.conditionalRules?.length
      ? metadata.conditionalRules
      : undefined,
    headers,
    columnTypes,
    cells,
    cellFormats: Object.keys(formats).length > 0 ? formats : undefined,
    columnOrder:
      columnOrder.length > 0 && !columnOrder.every((id, i) => id === `col-${i}`)
        ? columnOrder
        : undefined,
    columnWidths:
      Object.keys(columnWidths).length > 0 ? columnWidths : undefined,
  };
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key) => [key, sortKeysDeep(record[key])]),
  );
}

/** Key-order independent JSON for dirty-checking workbook data. */
export function serializeWorkbookForComparison(
  data: ProductDataTableSchema,
): string {
  return JSON.stringify(sortKeysDeep(data));
}

export function normalizeWorkbookForComparison(
  schema: ProductDataTableSchema | undefined,
): string {
  if (schema?.sheets) return serializeWorkbookForComparison({
    headers: {}, columnTypes: {}, cells: {},
    sheets: schema.sheets.map((sheet) => ({ ...sheet, data: JSON.parse(normalizeWorkbookForComparison(sheet.data)) })),
  });
  const parsed = parseProductSpecDataFromDatabase(schema);
  return serializeWorkbookForComparison(
    sparseProductSpecDataForDatabase(
      parsed.headerData,
      parsed.columnTypeData,
      parsed.cellData,
      parsed.cellFormats,
      parsed.columnOrder,
      parsed.columnSizing,
      parsed,
    ),
  );
}

export function parseProductSpecDataFromDatabase(
  schema: ProductDataTableSchema | undefined,
): WorkbookMetadata & {
  sheets?: ProductDataTableSchema["sheets"];
  headerData: Record<number, string>;
  columnTypeData: Record<number, DataType>;
  cellData: Record<string, string>;
  cellFormats: Record<string, CellFormat>;
  columnOrder: string[];
  columnSizing: Record<string, number>;
} {
  if (!schema) {
    return {
      headerData: {},
      columnTypeData: {},
      cellData: {},
      cellFormats: {},
      columnOrder: Array.from({ length: 150 }, (_, i) => `col-${i}`),
      columnSizing: {},
    };
  }

  const columnSizing: Record<string, number> = {};
  if (schema.columnWidths) {
    Object.entries(schema.columnWidths).forEach(([colIndex, width]) => {
      columnSizing[`col-${colIndex}`] = width;
    });
  }

  return {
    sheets: schema.sheets,
    sheetLayout: schema.sheetLayout,
    headerRows: schema.headerRows,
    rowOrder: schema.rowOrder,
    rowHeights: schema.rowHeights,
    conditionalRules: schema.conditionalRules,
    headerData: schema.headers || {},
    columnTypeData: (schema.columnTypes as Record<number, DataType>) || {},
    cellData: schema.cells || {},
    cellFormats: schema.cellFormats || {},
    columnOrder:
      schema.columnOrder || Array.from({ length: 150 }, (_, i) => `col-${i}`),
    columnSizing,
  };
}
