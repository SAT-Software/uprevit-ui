export interface CellFormat {
  bgColor?: string;
  textColor?: string;
}

export type DataType = "blank" | "constant" | "variable" | "na";

export interface ProductDataTableSchema {
  headers: Record<number, string>;
  columnTypes: Record<number, "constant" | "variable" | "na">;
  cells: Record<string, string>;
  cellFormats?: Record<string, CellFormat>;
  columnOrder?: string[];
  columnWidths?: Record<number, number>;
}

export interface ProductSpecificationDataTableProps {
  initialData?: {
    headerData: Record<number, string>;
    columnTypeData: Record<number, DataType>;
    cellData: Record<string, string>;
    cellFormats: Record<string, CellFormat>;
    columnOrder: string[];
    columnSizing: Record<string, number>;
  };
  onDataChange?: (data: ProductDataTableSchema) => void;
}

export function sparseProductSpecDataForDatabase(
  headerData: Record<number, string>,
  columnTypeData: Record<number, DataType>,
  cellData: Record<string, string>,
  cellFormats: Record<string, CellFormat>,
  columnOrder: string[],
  columnSizing: Record<string, number>
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
    if (value.bgColor || value.textColor) {
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

export function parseProductSpecDataFromDatabase(
  schema: ProductDataTableSchema | undefined
): {
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
    headerData: schema.headers || {},
    columnTypeData: (schema.columnTypes as Record<number, DataType>) || {},
    cellData: schema.cells || {},
    cellFormats: schema.cellFormats || {},
    columnOrder:
      schema.columnOrder || Array.from({ length: 150 }, (_, i) => `col-${i}`),
    columnSizing,
  };
}
