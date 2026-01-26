import type { FilterFn } from "@tanstack/react-table";

export type AdvancedFilterValue = {
  operator: string;
  value: string | number | boolean;
};

export const advancedFilterFn: FilterFn<unknown> = (
  row,
  columnId,
  filterValue,
) => {
  const rowValue = row.getValue(columnId);

  if (filterValue == null) {
    return true;
  }

  if (typeof filterValue === "string") {
    const needle = filterValue.toLowerCase();
    if (!needle) return true;
    return String(rowValue ?? "")
      .toLowerCase()
      .includes(needle);
  }

  const { operator, value } = filterValue as AdvancedFilterValue;
  const normalizedValue =
    typeof rowValue === "boolean" && typeof value === "string"
      ? value === "true"
      : value;

  switch (operator) {
    case "eq":
      return rowValue == normalizedValue;
    case "neq":
      return rowValue != normalizedValue;
    case "contains":
      return String(rowValue)
        .toLowerCase()
        .includes(String(normalizedValue).toLowerCase());
    case "not_contains":
      return !String(rowValue)
        .toLowerCase()
        .includes(String(normalizedValue).toLowerCase());
    case "starts_with":
      return String(rowValue)
        .toLowerCase()
        .startsWith(String(normalizedValue).toLowerCase());
    case "ends_with":
      return String(rowValue)
        .toLowerCase()
        .endsWith(String(normalizedValue).toLowerCase());
    case "gt":
      return Number(rowValue) > Number(normalizedValue);
    case "gte":
      return Number(rowValue) >= Number(normalizedValue);
    case "lt":
      return Number(rowValue) < Number(normalizedValue);
    case "lte":
      return Number(rowValue) <= Number(normalizedValue);
    case "is_null":
      return rowValue == null || rowValue === "";
    case "is_not_null":
      return rowValue != null && rowValue !== "";
    default:
      return true;
  }
};
