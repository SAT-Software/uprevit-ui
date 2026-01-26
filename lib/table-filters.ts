import type { FilterFn } from "@tanstack/react-table";

export type AdvancedFilterValue = {
  operator: string;
  value: string | number | boolean;
};

export const advancedFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);

    const normalizeArrayValue = (value: unknown) => {
      if (Array.isArray(value)) {
        return value.map((item) => String(item).toLowerCase());
      }

      if (value == null) {
        return [];
      }

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return [];
        return trimmed
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean)
          .map((part) => part.toLowerCase());
      }

      return [String(value).toLowerCase()];
    };

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
        return String(rowValue ?? "")
          .toLowerCase()
          .includes(String(normalizedValue ?? "").toLowerCase());
      case "not_contains":
        return !String(rowValue ?? "")
          .toLowerCase()
          .includes(String(normalizedValue ?? "").toLowerCase());
      case "starts_with":
        return String(rowValue ?? "")
          .toLowerCase()
          .startsWith(String(normalizedValue ?? "").toLowerCase());
      case "ends_with":
        return String(rowValue ?? "")
          .toLowerCase()
          .endsWith(String(normalizedValue ?? "").toLowerCase());
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
      case "contained_by": {
        if (!Array.isArray(rowValue)) return false;
        const rowArray = normalizeArrayValue(rowValue);
        const filterArray = normalizeArrayValue(normalizedValue);

        if (filterArray.length === 0) return false;

        return rowArray.every((item) => filterArray.includes(item));
      }
      case "overlaps": {
        if (!Array.isArray(rowValue)) return false;
        const rowArray = normalizeArrayValue(rowValue);
        const filterArray = normalizeArrayValue(normalizedValue);

        if (filterArray.length === 0) return false;

        return rowArray.some((item) => filterArray.includes(item));
      }
      default:
        return true;
    }
  };
};
