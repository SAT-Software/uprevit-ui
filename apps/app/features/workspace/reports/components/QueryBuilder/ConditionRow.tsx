"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { Input } from "@uprevit/ui/components/ui/input";
import { Button } from "@uprevit/ui/components/ui/button";
import { TagInput, Tag } from "@uprevit/ui/components/ui/tag-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { QueryCondition } from "@/types/reports";
import {
  QUERYABLE_TABS,
  OPERATORS,
  getFieldsForTab,
  Operator,
  ARRAY_FIELD_OPERATORS,
} from "@/data/reports-config";
import { cn } from "@uprevit/ui/lib/utils";

interface ConditionRowProps {
  condition: QueryCondition;
  onUpdate: (updates: Partial<Omit<QueryCondition, "id">>) => void;
  onRemove: () => void;
  position: number;
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
    return [
      ...ARRAY_FIELD_OPERATORS,
      "equals",
      "not_equals",
      "exists",
      "not_exists",
    ];
  }
  return TEXT_FIELD_OPERATORS;
}

export function ConditionRow({
  condition,
  onUpdate,
  onRemove,
  position,
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
    const newOperator = isCurrentOperatorValid
      ? currentOperator
      : newOperators[0];
    onUpdate({ field: value, value: "", operator: newOperator });
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 transition-colors hover:border-foreground/20",
      )}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
          "bg-foreground/8 text-foreground",
        )}
      >
        {position}
      </div>

      <Select
        value={condition.tab}
        onValueChange={(value) =>
          onUpdate({ tab: value, field: "", value: "" })
        }
      >
        <SelectTrigger className="h-8 w-40 shrink-0 text-sm [&>span]:truncate">
          <SelectValue placeholder="Category" />
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
        <SelectTrigger className="h-8 w-48 shrink-0 text-sm [&>span]:truncate">
          <SelectValue placeholder="Field" />
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
        <SelectTrigger className="h-8 w-44 shrink-0 text-sm [&>span]:truncate">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {availableOperators.map((op) => {
            const operatorLabel =
              OPERATORS.find((o) => o.value === op)?.label || op;
            return (
              <SelectItem key={op} value={op}>
                {operatorLabel}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {needsValue ? (
        <>
          {selectedField?.type === "select" && selectedField.options ? (
            <Select
              value={(condition.value as string) || ""}
              onValueChange={(value) => onUpdate({ value })}
              disabled={!condition.field}
            >
              <SelectTrigger className="h-8 min-w-36 flex-1 text-sm">
                <SelectValue placeholder="Value" />
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
            <div className="min-w-[180px] flex-1">
              <TagInput
                tags={tags}
                setTags={handleTagsChange}
                placeholder="Add values..."
                disabled={!condition.field}
              />
            </div>
          ) : (
            <Input
              placeholder="Enter value..."
              value={(condition.value as string) || ""}
              onChange={(e) => onUpdate({ value: e.target.value })}
              disabled={!condition.field}
              className="h-8 min-w-[140px] flex-1 text-sm"
            />
          )}
        </>
      ) : null}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Remove condition"
          >
            <Icon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Remove condition</TooltipContent>
      </Tooltip>
    </div>
  );
}
