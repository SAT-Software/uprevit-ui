"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { Table } from "@tanstack/react-table";
import {
  PiColumnsDuotone,
  PiFunnelDuotone,
  PiPlusCircleDuotone,
  PiSlidersDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ColumnType = "text" | "number" | "boolean" | "array";

export type TableFilterColumn = {
  name: string;
  label: string;
  type: ColumnType;
};

type FilterCondition = {
  id: string;
  column: string;
  operator: string;
  value: string;
};

const getOperatorsForType = (type: ColumnType) => {
  switch (type) {
    case "text":
      return [
        { value: "eq", label: "equals" },
        { value: "neq", label: "not equals" },
        { value: "contains", label: "contains" },
        { value: "not_contains", label: "does not contain" },
        { value: "starts_with", label: "starts with" },
        { value: "ends_with", label: "ends with" },
        { value: "is_null", label: "is empty" },
        { value: "is_not_null", label: "is not empty" },
      ];
    case "number":
      return [
        { value: "eq", label: "equals" },
        { value: "neq", label: "not equals" },
        { value: "gt", label: "greater than" },
        { value: "gte", label: "greater than or equals" },
        { value: "lt", label: "less than" },
        { value: "lte", label: "less than or equals" },
        { value: "is_null", label: "is empty" },
        { value: "is_not_null", label: "is not empty" },
      ];
    case "boolean":
      return [
        { value: "eq", label: "equals" },
        { value: "is_null", label: "is empty" },
        { value: "is_not_null", label: "is not empty" },
      ];
    case "array":
      return [
        { value: "contains", label: "contains" },
        { value: "not_contains", label: "does not contain" },
        { value: "contained_by", label: "contained by" },
        { value: "overlaps", label: "overlaps" },
        { value: "is_null", label: "is empty" },
        { value: "is_not_null", label: "is not empty" },
      ];
    default:
      return [];
  }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const getSearchValue = (filterValue: unknown) => {
  if (typeof filterValue === "string") {
    return filterValue;
  }

  if (
    filterValue &&
    typeof filterValue === "object" &&
    "value" in filterValue
  ) {
    return String((filterValue as { value?: unknown }).value ?? "");
  }

  return "";
};

type TableControlsProps<TData> = {
  table: Table<TData>;
  searchColumnId: string;
  searchPlaceholder: string;
  filterColumns: TableFilterColumn[];
  inputClassName?: string;
};

export default function TableControls<TData>({
  table,
  searchColumnId,
  searchPlaceholder,
  filterColumns,
  inputClassName = "w-60 h-7 text-xs",
}: TableControlsProps<TData>) {
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  const dropdownShadowStyle: CSSProperties = {
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)",
  };

  const selectContentStyle: CSSProperties = {
    zIndex: 1000,
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      { id: generateId(), column: "", operator: "", value: "" },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  const handleFilterChange = (
    id: string,
    field: keyof FilterCondition,
    value: string,
  ) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === id) {
          if (field === "column") {
            return { ...filter, column: value, operator: "", value: "" };
          }
          return { ...filter, [field]: value };
        }
        return filter;
      }),
    );
  };

  const handleApplyFilters = () => {
    const validFilters = filters.filter(
      (filter) =>
        filter.column &&
        filter.operator &&
        (filter.value !== "" ||
          ["is_null", "is_not_null"].includes(filter.operator)),
    );

    setFilters(validFilters);
    const colFilters = validFilters.map((filter) => ({
      id: filter.column,
      value: { operator: filter.operator, value: filter.value },
    }));

    table.setColumnFilters(colFilters);
  };

  const getColumnByName = (name: string) => {
    return (
      filterColumns.find((column) => column.name === name) || {
        name: "",
        label: "",
        type: "text" as ColumnType,
      }
    );
  };

  const searchColumn = table.getColumn(searchColumnId);
  const searchQuery = getSearchValue(searchColumn?.getFilterValue());

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center justify-start w-full gap-3">
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) =>
            searchColumn?.setFilterValue(event.target.value)
          }
          className={inputClassName}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <PiFunnelDuotone />
              Filter
              {table.getState().columnFilters.length > 0 && (
                <span className="ml-1.5 rounded-full bg-border w-4 h-4 flex items-center justify-center border border-foreground/20 text-[10px] font-medium text-muted-foreground">
                  {table.getState().columnFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full"
            align="start"
            style={dropdownShadowStyle}
          >
            {filters.length === 0 ? (
              <div className="px-2 py-2 min-w-110">
                <p className="mb-1 text-sm font-semibold">
                  No filters applied to this view
                </p>
                <p className="text-sm text-muted-foreground">
                  Add a column below to filter the view
                </p>
              </div>
            ) : (
              <div className="space-y-2 px-2 py-2 min-w-110">
                {filters.map((filter) => {
                  const selectedColumn = getColumnByName(filter.column);
                  const operators = getOperatorsForType(selectedColumn.type);
                  const showValueInput = !["is_null", "is_not_null"].includes(
                    filter.operator,
                  );

                  return (
                    <div
                      key={filter.id}
                      className="flex items-center text-sm space-x-2"
                    >
                      <Select
                        value={filter.column}
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, "column", value)
                        }
                      >
                        <SelectTrigger className="h-8 w-auto min-w-[150px] text-sm whitespace-nowrap">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent style={selectContentStyle}>
                          {filterColumns.map((column) => (
                            <SelectItem
                              className="text-sm"
                              key={column.name}
                              value={column.name}
                            >
                              {column.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={filter.operator}
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, "operator", value)
                        }
                      >
                        <SelectTrigger className="h-8 w-full text-sm">
                          <SelectValue className="text-sm" placeholder="Op" />
                        </SelectTrigger>
                        <SelectContent style={selectContentStyle}>
                          {operators.map((op) => (
                            <SelectItem
                              className="text-sm"
                              key={op.value}
                              value={op.value}
                            >
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {showValueInput && (
                        <Input
                          type={
                            selectedColumn.type === "number" ? "number" : "text"
                          }
                          placeholder="Enter value"
                          value={filter.value}
                          onChange={(event) =>
                            handleFilterChange(
                              filter.id,
                              "value",
                              event.target.value,
                            )
                          }
                          className="h-8 w-full text-sm grow"
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFilter(filter.id)}
                        className="p-0"
                      >
                        <PiXCircleDuotone />
                        <span className="sr-only">Remove filter</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <DropdownMenuSeparator />

            <div className="flex justify-between items-center px-2 py-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={handleAddFilter}
              >
                <PiPlusCircleDuotone />
                Add filter
              </Button>
              <Button
                size="sm"
                className="text-sm"
                variant="secondary"
                onClick={handleApplyFilters}
              >
                <PiSlidersDuotone />
                Apply filter
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <PiColumnsDuotone />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={dropdownShadowStyle}>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(Boolean(value))
                  }
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
