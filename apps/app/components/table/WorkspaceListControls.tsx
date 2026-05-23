"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { format } from "date-fns";
import {
  PiCalendarBlankDuotone,
  PiFunnelDuotone,
  PiPlusCircleDuotone,
  PiSlidersDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

import { Button } from "@uprevit/ui/components/ui/button";
import { Calendar } from "@uprevit/ui/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import type {
  ListFilter,
  ListFilterColumn,
  ListFilterOperator,
} from "@/lib/workspace-list-query";

type DraftFilter = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

type WorkspaceListControlsProps = {
  filters: ListFilter[];
  filterColumns: ListFilterColumn[];
  onApplyFilters: (filters: ListFilter[]) => void;
  onClearFilters: () => void;
};

const dropdownShadowStyle: CSSProperties = {
  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)",
};

const selectContentStyle: CSSProperties = {
  zIndex: 1000,
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_FILTER_COLUMN: ListFilterColumn = {
  name: "",
  label: "",
  type: "text",
};

const getOperatorsForType = (type: ListFilterColumn["type"]) => {
  if (type === "number" || type === "date") {
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
  }

  if (type === "boolean") {
    return [
      { value: "eq", label: "equals" },
      { value: "is_null", label: "is empty" },
      { value: "is_not_null", label: "is not empty" },
    ];
  }

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
};

const toDraftFilters = (filters: ListFilter[]): DraftFilter[] =>
  filters.map((filter) => ({
    id: generateId(),
    field: filter.field,
    operator: filter.operator,
    value: filter.value === undefined ? "" : String(filter.value),
  }));

const parseDateValue = (value: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function DateFilterInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className="h-8 w-[150px] justify-start text-left text-sm font-normal data-[empty=true]:text-muted-foreground"
        >
          <PiCalendarBlankDuotone />
          <span className="truncate">
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[1000] w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return;
            onChange(formatDateValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function WorkspaceListControls({
  filters,
  filterColumns,
  onApplyFilters,
  onClearFilters,
}: WorkspaceListControlsProps) {
  const [draftFilters, setDraftFilters] = useState<DraftFilter[]>(() =>
    toDraftFilters(filters),
  );

  useEffect(() => {
    setDraftFilters(toDraftFilters(filters));
  }, [filters]);

  const handleAddFilter = () => {
    setDraftFilters((current) => [
      ...current,
      { id: generateId(), field: "", operator: "", value: "" },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    setDraftFilters((current) => current.filter((filter) => filter.id !== id));
  };

  const handleFilterChange = (
    id: string,
    field: keyof DraftFilter,
    value: string,
  ) => {
    setDraftFilters((current) =>
      current.map((filter) => {
        if (filter.id !== id) return filter;
        if (field === "field") {
          return { ...filter, field: value, operator: "", value: "" };
        }
        return { ...filter, [field]: value };
      }),
    );
  };

  const handleApplyFilters = () => {
    const validFilters = draftFilters
      .filter(
        (filter) =>
          filter.field &&
          filter.operator &&
          (filter.value !== "" ||
            ["is_null", "is_not_null"].includes(filter.operator)),
      )
      .map((filter) => {
        const column = filterColumns.find((item) => item.name === filter.field);
        const value =
          column?.type === "number" && filter.value !== ""
            ? Number(filter.value)
            : filter.value;

        return {
          field: filter.field,
          operator: filter.operator as ListFilterOperator,
          ...(filter.operator === "is_null" ||
          filter.operator === "is_not_null"
            ? {}
            : { value }),
        };
      });

    onApplyFilters(validFilters);
  };

  const handleClearFilters = () => {
    setDraftFilters([]);
    onClearFilters();
  };

  const getColumnByName = (name: string) =>
    filterColumns.find((column) => column.name === name) ?? DEFAULT_FILTER_COLUMN;

  const hasActiveFilters = filters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <PiFunnelDuotone />
            Filter
            {hasActiveFilters && (
              <span className="ml-1.5 rounded-full bg-border w-4 h-4 flex items-center justify-center border border-foreground/20 text-[10px] font-medium text-muted-foreground">
                {filters.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full"
          align="start"
          style={dropdownShadowStyle}
        >
          {draftFilters.length === 0 ? (
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
              {draftFilters.map((filter) => {
                const selectedColumn = getColumnByName(filter.field);
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
                      value={filter.field}
                      onValueChange={(value) =>
                        handleFilterChange(filter.id, "field", value)
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
                        {operators.map((operator) => (
                          <SelectItem
                            className="text-sm"
                            key={operator.value}
                            value={operator.value}
                          >
                            {operator.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {showValueInput && selectedColumn.type === "date" ? (
                      <DateFilterInput
                        value={filter.value}
                        onChange={(value) =>
                          handleFilterChange(filter.id, "value", value)
                        }
                      />
                    ) : showValueInput ? (
                      <Input
                        type={selectedColumn.type === "number" ? "number" : "text"}
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
                    ) : null}

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

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          <PiXCircleDuotone />
          Clear filters
        </Button>
      )}
    </div>
  );
}
