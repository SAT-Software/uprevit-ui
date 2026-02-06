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
  isArrayFieldOperator,
  ARRAY_FIELD_OPERATORS,
} from "@/data/reports-config";
import { TagInput, Tag } from "@/components/ui/tag-input";

interface ConditionRowProps {
  condition: QueryCondition;
  onUpdate: (updates: Partial<Omit<QueryCondition, "id">>) => void;
  onRemove: () => void;
}

const TEXT_FIELD_OPERATORS: Operator[] = [
  "equals",
  "not_equals",
  "contains",
  "not_contains",
  "exists",
  "not_exists",
];

function getOperatorsForField(fieldType: string | undefined): Operator[] {
  if (fieldType === "array") {
    return [...ARRAY_FIELD_OPERATORS, "equals", "not_equals", "exists", "not_exists"];
  }
  return TEXT_FIELD_OPERATORS;
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
  const isArrayField = selectedField?.type === "array";
  const availableOperators = getOperatorsForField(selectedField?.type);

  const tags: Tag[] = Array.isArray(condition.value)
    ? condition.value.map((text, index) => ({
        id: `tag-${index}-${text}`,
        text,
      }))
    : [];

  const handleTagsChange = (newTags: Tag[]) => {
    const stringArray = newTags.map((tag) => tag.text);
    onUpdate({ value: stringArray });
  };

  const handleFieldChange = (value: string) => {
    const newField = fields.find((f) => f.key === value);
    const newOperators = getOperatorsForField(newField?.type);
    const currentOperator = condition.operator;
    const isCurrentOperatorValid = newOperators.includes(currentOperator);
    const newOperator = isCurrentOperatorValid ? currentOperator : newOperators[0];
    onUpdate({ field: value, value: "", operator: newOperator });
  };

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
        onValueChange={handleFieldChange}
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
          {availableOperators.map((op) => {
            const operatorLabel = OPERATORS.find((o) => o.value === op)?.label || op;
            return (
              <SelectItem key={op} value={op}>
                {operatorLabel}
              </SelectItem>
            );
          })}
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
          ) : isArrayField ? (
            <div className="flex-1 min-w-[200px]">
              <TagInput
                tags={tags}
                setTags={handleTagsChange}
                placeholder="Type and press Enter to add"
                disabled={!condition.field}
              />
            </div>
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
