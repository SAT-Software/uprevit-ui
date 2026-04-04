"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { ColumnFiltersState, Table } from "@tanstack/react-table";
import type { CSSProperties } from "react";
import { useState } from "react";
import {
  PiFunnelDuotone,
  PiPlusCircleDuotone,
  PiSlidersDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Item } from "./ProductsPageProductTable";

// Types for our filter system
type ColumnType = "text" | "number" | "boolean" | "array";

interface Column {
  name: string;
  label: string;
  type: ColumnType;
}

interface FilterOperator {
  value: string;
  label: string;
}

interface FilterCondition {
  id: string;
  column: string;
  operator: string;
  value: string;
}

// Sample columns for demonstration
const sampleColumns: Column[] = [
  { name: "product_plan_number", label: "PPN", type: "text" },
  { name: "product_name", label: "Product Name", type: "text" },
  { name: "project_name", label: "Project", type: "text" },
  { name: "department_name", label: "Department", type: "text" },
  { name: "status", label: "Status", type: "text" },
  { name: "version", label: "Version", type: "number" },
  { name: "complete_count", label: "Progress", type: "number" },
];

// Operators based on column type
const getOperatorsForType = (type: ColumnType): FilterOperator[] => {
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

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function FilterBuilder({ table }: { table: Table<Item> }) {
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
    // Allow removing even if it's the last filter in the builder section
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  const handleFilterChange = (
    id: string,
    field: keyof FilterCondition,
    value: string
  ) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === id) {
          // If changing column, reset operator and value
          if (field === "column") {
            return { ...filter, column: value, operator: "", value: "" };
          }
          return { ...filter, [field]: value };
        }
        return filter;
      })
    );
  };

  const handleApplyFilters = () => {
    // Only apply fully specified filters
    const validFilters = filters.filter(
      (f) =>
        f.column &&
        f.operator &&
        (f.value !== "" || ["is_null", "is_not_null"].includes(f.operator))
    );
    setFilters(validFilters);
    const colFilters: ColumnFiltersState = validFilters.map((f) => ({
      id: f.column,
      value: { operator: f.operator, value: f.value },
    }));
    table.setColumnFilters(colFilters);
  };

  // Get column details by name
  const getColumnByName = (name: string) => {
    return (
      sampleColumns.find((col) => col.name === name) || {
        name: "",
        label: "",
        type: "text" as ColumnType,
      }
    );
  };

  return (
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
                filter.operator
              );

              return (
                <div
                  key={filter.id}
                  className="flex items-center text-sm space-x-2"
                >
                  {/* Column Select */}
                  <Select
                    value={filter.column}
                    onValueChange={(value) =>
                      handleFilterChange(filter.id, "column", value)
                    }
                  >
                    {/* Changed w-full to w-auto and added min-w */}
                    <SelectTrigger className="h-8 w-auto min-w-[150px] text-sm whitespace-nowrap">
                      <SelectValue placeholder="Select column" />{" "}
                      {/* Use placeholder for better UX */}
                    </SelectTrigger>
                    <SelectContent style={selectContentStyle}>
                      {sampleColumns.map((col) => (
                        <SelectItem
                          className="text-sm"
                          key={col.name}
                          value={col.name}
                        >
                          {col.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator Select */}
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

                  {/* Value Input */}
                  {showValueInput && (
                    <Input
                      type={
                        selectedColumn.type === "number" ? "number" : "text"
                      }
                      placeholder="Enter value"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(filter.id, "value", e.target.value)
                      }
                      className="h-8 w-full text-sm grow"
                    />
                  )}

                  {/* Remove Button */}
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

        <DropdownMenuSeparator className="" />

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
  );
}
