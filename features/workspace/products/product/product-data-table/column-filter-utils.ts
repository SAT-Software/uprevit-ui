import type {
  ColumnDataType,
  ColumnFilter,
  FilterOperator,
} from "@/types/product-data-table";

export function detectColumnDataType(
  cellData: Record<string, string>,
  colIndex: number,
  rowCount: number
): ColumnDataType {
  let hasData = false;

  for (let row = 0; row < rowCount; row++) {
    const value = cellData[`${row},${colIndex}`];
    if (value?.trim()) {
      hasData = true;
      if (isNaN(parseFloat(value))) {
        return "string";
      }
    }
  }

  return hasData ? "number" : "string";
}

export function getFilterOperators(
  dataType: ColumnDataType
): { value: FilterOperator; label: string }[] {
  if (dataType === "number") {
    return [
      { value: "equals", label: "Equals" },
      { value: "gt", label: "Greater than" },
      { value: "gte", label: "Greater or equal" },
      { value: "lt", label: "Less than" },
      { value: "lte", label: "Less or equal" },
    ];
  }
  return [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "notContains", label: "Does not contain" },
  ];
}

export function applyFilter(
  cellValue: string | undefined,
  filter: ColumnFilter
): boolean {
  if (!cellValue) return false;

  const value = cellValue.toLowerCase();
  const filterVal = filter.value.toLowerCase();

  switch (filter.operator) {
    case "contains":
      return value.includes(filterVal);
    case "equals":
      return value === filterVal;
    case "startsWith":
      return value.startsWith(filterVal);
    case "endsWith":
      return value.endsWith(filterVal);
    case "notContains":
      return !value.includes(filterVal);
    case "gt":
      return parseFloat(cellValue) > parseFloat(filter.value);
    case "gte":
      return parseFloat(cellValue) >= parseFloat(filter.value);
    case "lt":
      return parseFloat(cellValue) < parseFloat(filter.value);
    case "lte":
      return parseFloat(cellValue) <= parseFloat(filter.value);
    default:
      return true;
  }
}
