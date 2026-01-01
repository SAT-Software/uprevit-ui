"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiXCircleDuotone } from "react-icons/pi";
import { QueryCondition } from "@/types/reports";
import {
  QUERYABLE_TABS,
  OPERATORS,
  getFieldsForTab,
  Operator,
} from "@/data/reports-config";

interface ConditionRowProps {
  condition: QueryCondition;
  onUpdate: (updates: Partial<Omit<QueryCondition, "id">>) => void;
  onRemove: () => void;
}

export function ConditionRow({
  condition,
  onUpdate,
  onRemove,
}: ConditionRowProps) {
  const fields = getFieldsForTab(condition.tab);
  const selectedField = fields.find((f) => f.key === condition.field);
  const needsValue =
    condition.operator !== "exists" && condition.operator !== "not_exists";

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
      <Select
        value={condition.tab}
        onValueChange={(value) =>
          onUpdate({ tab: value, field: "", value: "" })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Tab" />
        </SelectTrigger>
        <SelectContent>
          {QUERYABLE_TABS.map((tab) => (
            <SelectItem key={tab.key} value={tab.key}>
              {tab.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.field}
        onValueChange={(value) => onUpdate({ field: value, value: "" })}
        disabled={!condition.tab}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.key} value={field.key}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(value) => onUpdate({ operator: value as Operator })}
        disabled={!condition.field}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {needsValue && (
        <>
          {selectedField?.type === "select" && selectedField.options ? (
            <Select
              value={(condition.value as string) || ""}
              onValueChange={(value) => onUpdate({ value })}
              disabled={!condition.field}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Value" />
              </SelectTrigger>
              <SelectContent>
                {selectedField.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder="Enter value..."
              value={(condition.value as string) || ""}
              onChange={(e) => onUpdate({ value: e.target.value })}
              disabled={!condition.field}
              className="w-full"
            />
          )}
        </>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive shrink-0"
      >
        <PiXCircleDuotone size={20} />
      </Button>
    </div>
  );
}
