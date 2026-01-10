"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiFunnel, PiFunnelFill } from "react-icons/pi";
import type {
  ColumnDataType,
  ColumnFilter,
  FilterOperator,
} from "@/types/product-data-table";
import { getFilterOperators } from "./column-filter-utils";

interface ColumnFilterPopoverProps {
  dataType: ColumnDataType;
  filter: ColumnFilter | undefined;
  onApply: (filter: ColumnFilter) => void;
  onClear: () => void;
}

export function ColumnFilterPopover({
  dataType,
  filter,
  onApply,
  onClear,
}: ColumnFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const operators = getFilterOperators(dataType);
  const [operator, setOperator] = useState<FilterOperator>(
    filter?.operator ?? operators[0].value
  );
  const [value, setValue] = useState(filter?.value ?? "");

  const hasFilter = !!filter;

  const handleApply = () => {
    if (value.trim()) {
      onApply({ operator, value: value.trim() });
      setOpen(false);
    }
  };

  const handleClear = () => {
    onClear();
    setValue("");
    setOperator(operators[0].value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 hover:bg-accent-foreground/10 rounded size-6"
        >
          {hasFilter ? (
            <PiFunnelFill className="size-3 text-primary" />
          ) : (
            <PiFunnel className="size-3 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="grid gap-3">
          <Select
            value={operator}
            onValueChange={(v) => setOperator(v as FilterOperator)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op.value} value={op.value} className="text-sm">
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder={
              dataType === "number" ? "Enter number..." : "Enter text..."
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 text-sm"
            type={dataType === "number" ? "number" : "text"}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleClear}
              disabled={!hasFilter}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleApply}
              disabled={!value.trim()}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
