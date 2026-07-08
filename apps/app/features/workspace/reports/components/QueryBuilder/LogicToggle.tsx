"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";

interface LogicToggleProps {
  value: "AND" | "OR";
  onChange: (value: "AND" | "OR") => void;
}

export function LogicToggle({ value, onChange }: LogicToggleProps) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="h-0 flex-1 border-t border-dashed border-border" />
      <Select value={value} onValueChange={(v) => onChange(v as "AND" | "OR")}>
        <SelectTrigger className="h-8 w-18 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AND">AND</SelectItem>
          <SelectItem value="OR">OR</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-0 flex-1 border-t border-dashed border-border" />
    </div>
  );
}
