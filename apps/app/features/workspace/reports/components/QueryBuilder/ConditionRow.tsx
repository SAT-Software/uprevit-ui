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
  FIELD_OPERATORS,
  NO_VALUE_OPERATORS,
  ARRAY_FIELD_OPERATORS,
  getFieldOptions,
  getFieldsForTab,
  getQueryableField,
  Operator,
} from "@/data/reports-config";

interface ConditionRowProps {
  condition: QueryCondition;
  onUpdate: (updates: Partial<Omit<QueryCondition, "id">>) => void;
  onRemove: () => void;
  position: number;
}

const INPUT_TYPES: Partial<Record<string, string>> = {
  number: "number",
  count: "number",
  date: "date",
};

export function ConditionRow({
  condition,
  onUpdate,
  onRemove,
  position,
}: ConditionRowProps) {
  const fields = getFieldsForTab(condition.tab);
  const selectedField = getQueryableField(condition.tab, condition.field);
  const operators = selectedField ? FIELD_OPERATORS[selectedField.type] : [];
  const options = getFieldOptions(selectedField);
  const needsValue = !NO_VALUE_OPERATORS.includes(condition.operator);
  const isMultiValue = ARRAY_FIELD_OPERATORS.includes(condition.operator);

  const tags: Tag[] = Array.isArray(condition.value)
    ? condition.value.map((text, index) => ({
        id: `tag-${index}-${text}`,
        text,
      }))
    : [];

  const handleFieldChange = (value: string) => {
    const field = getQueryableField(condition.tab, value);
    if (!field) return;
    onUpdate({
      field: value,
      operator: FIELD_OPERATORS[field.type][0].value,
      value: field.type === "boolean" ? "true" : "",
    });
  };

  const handleOperatorChange = (value: string) => {
    const operator = value as Operator;
    const wasMultiValue = ARRAY_FIELD_OPERATORS.includes(condition.operator);
    const isNextMultiValue = ARRAY_FIELD_OPERATORS.includes(operator);
    onUpdate(
      wasMultiValue === isNextMultiValue
        ? { operator }
        : { operator, value: isNextMultiValue ? [] : "" },
    );
  };

  const renderValueInput = () => {
    if (options) {
      return (
        <Select
          value={(condition.value as string) || ""}
          onValueChange={(value) => onUpdate({ value })}
        >
          <SelectTrigger
            className="h-8 min-w-36 flex-1 text-sm"
            aria-label={`Condition ${position} value`}
          >
            <SelectValue placeholder="Value" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isMultiValue) {
      return (
        <div className="min-w-[180px] flex-1">
          <TagInput
            tags={tags}
            setTags={(next: Tag[]) =>
              onUpdate({ value: next.map((tag) => tag.text) })
            }
            placeholder="Add values…"
          />
        </div>
      );
    }

    return (
      <Input
        type={INPUT_TYPES[selectedField?.type ?? ""] ?? "text"}
        min={selectedField?.type === "count" ? 0 : undefined}
        placeholder={selectedField?.placeholder ?? "Enter value…"}
        value={(condition.value as string) || ""}
        onChange={(event) => onUpdate({ value: event.target.value })}
        disabled={!selectedField}
        aria-label={`Condition ${position} value`}
        className="h-8 min-w-[140px] flex-1 text-sm"
      />
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 transition-colors hover:border-foreground/20">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-xs font-medium text-foreground">
        {position}
      </div>

      <Select
        value={condition.tab}
        onValueChange={(value) =>
          onUpdate({ tab: value, field: "", operator: "equals", value: "" })
        }
      >
        <SelectTrigger
          className="h-8 w-44 shrink-0 text-sm [&>span]:truncate"
          aria-label={`Condition ${position} category`}
        >
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
        <SelectTrigger
          className="h-8 w-52 shrink-0 text-sm [&>span]:truncate"
          aria-label={`Condition ${position} field`}
        >
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
        onValueChange={handleOperatorChange}
        disabled={!selectedField}
      >
        <SelectTrigger
          className="h-8 w-40 shrink-0 text-sm [&>span]:truncate"
          aria-label={`Condition ${position} operator`}
        >
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((operator) => (
            <SelectItem key={operator.value} value={operator.value}>
              {operator.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {needsValue ? renderValueInput() : null}

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
