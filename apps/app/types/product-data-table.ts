export interface CellFormat {
  dateFormat?: string;
  dateDisplay?: string;
  dateRaw?: string;
  date1904?: boolean;
  bgColor?: string;
  textColor?: string;
  decimalPlaces?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  alignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "middle" | "bottom";
}

export type DataType = "blank" | "constant" | "variable" | "na";

export interface WorkbookConditionalRule {
  id: string;
  rows: number[];
  columns: number[];
  operator: "gt" | "lt" | "eq" | "contains";
  value: string;
  bgColor?: string;
  textColor?: string;
}

export interface WorkbookMetadata {
  sheetLayout?: "cells";
  headerRows?: { count: 1 | 2; formats: Record<string, CellFormat>; heights: Record<number, number> };
  rowOrder?: number[];
  rowHeights?: Record<number, number>;
  conditionalRules?: WorkbookConditionalRule[];
}

export interface WorkbookSheet {
  id: string;
  name: string;
  data: ProductDataTableSchema;
}

export interface ProductDataTableSchema extends WorkbookMetadata {
  sheets?: WorkbookSheet[];
  headers: Record<number, string>;
  columnTypes: Record<number, "constant" | "variable" | "na">;
  cells: Record<string, string>;
  cellFormats?: Record<string, CellFormat>;
  columnOrder?: string[];
  columnWidths?: Record<number, number>;
}

export interface ProductSpecificationDataTableProps {
  initialData?: WorkbookMetadata & {
    sheets?: WorkbookSheet[];
    headerData: Record<number, string>;
    columnTypeData: Record<number, DataType>;
    cellData: Record<string, string>;
    cellFormats: Record<string, CellFormat>;
    columnOrder: string[];
    columnSizing: Record<string, number>;
  };
  onDataChange?: (data: ProductDataTableSchema) => void;
  onSaveSuccess?: (clearHistory: () => void) => void;
  resetKey?: number;
  sourceRevision?: unknown;
  isRedlineView?: boolean;
  isReadOnly?: boolean;
  isSavePending?: () => boolean;
  redlineMode?: "inline" | "highlight";
  redlineBaseData?: {
    sheets?: WorkbookSheet[];
    headerData: Record<number, string>;
    columnTypeData: Record<number, DataType>;
    cellData: Record<string, string>;
  };
}

export type ColumnDataType = "number" | "string";

export type FilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "notContains"
  | "lt"
  | "gt"
  | "lte"
  | "gte";

export interface ColumnFilter {
  operator: FilterOperator;
  value: string;
}
