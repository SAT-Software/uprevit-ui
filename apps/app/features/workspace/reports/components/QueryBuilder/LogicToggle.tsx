"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogicToggleProps {
  value: "AND" | "OR";
  onChange: (value: "AND" | "OR") => void;
}

export function LogicToggle({ value, onChange }: LogicToggleProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="h-0 flex-1 border-border border-t border-dashed" />
      <Select value={value} onValueChange={(v) => onChange(v as "AND" | "OR")}>
        <SelectTrigger className="w-[80px] h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AND">AND</SelectItem>
          <SelectItem value="OR">OR</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-0 flex-1 border-border border-t border-dashed" />
    </div>
  );
}
