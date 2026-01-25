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
  onSaveSuccess?: (clearHistory: () => void) => void;
  isRedlineView?: boolean;
  redlineMode?: "inline" | "highlight";
  redlineBaseData?: {
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
