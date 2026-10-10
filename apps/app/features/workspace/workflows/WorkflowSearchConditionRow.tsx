"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  WORKFLOW_SEARCH_FIELDS,
  WORKFLOW_SEARCH_OPERATORS,
  getWorkflowSearchField,
} from "@/data/workflow-search-config";
import type { ConditionRowRenderProps } from "@/features/workspace/reports/components/QueryBuilder/QueryBuilder";
import type {
  WorkflowSearchCondition,
  WorkflowSearchField,
  WorkflowSearchOperator,
} from "@/types/workflow";

export const NO_VALUE_OPERATORS: WorkflowSearchOperator[] = [
  "exists",
  "not_exists",
];

export function WorkflowSearchConditionRow({
  condition,
  position,
  onUpdate,
  onRemove,
}: ConditionRowRenderProps<WorkflowSearchCondition> & {
  condition: WorkflowSearchCondition;
}) {
  const field = getWorkflowSearchField(condition.field);
  const operators = field ? WORKFLOW_SEARCH_OPERATORS[field.type] : [];
  const needsValue = !NO_VALUE_OPERATORS.includes(condition.operator);

  const handleFieldChange = (key: string) => {
    const nextField = getWorkflowSearchField(key);
    if (!nextField) return;
    onUpdate({
      field: key as WorkflowSearchField,
      operator: WORKFLOW_SEARCH_OPERATORS[nextField.type][0].value,
      value: "",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 transition-colors hover:border-foreground/20">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-xs font-medium text-foreground">
        {position}
      </div>

      <Select value={condition.field} onValueChange={handleFieldChange}>
        <SelectTrigger
          className="h-8 w-44 shrink-0 text-sm [&>span]:truncate"
          aria-label={`Condition ${position} field`}
        >
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {WORKFLOW_SEARCH_FIELDS.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(value) =>
          onUpdate({ operator: value as WorkflowSearchOperator })
        }
        disabled={!field}
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

      {needsValue ? (
        field?.type === "select" ? (
          <Select
            value={condition.value}
            onValueChange={(value) => onUpdate({ value })}
          >
            <SelectTrigger
              className="h-8 min-w-36 flex-1 text-sm"
              aria-label={`Condition ${position} value`}
            >
              <SelectValue placeholder="Value" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={field?.type === "date" ? "date" : "text"}
            placeholder={field?.placeholder ?? "Enter value…"}
            value={condition.value}
            onChange={(event) => onUpdate({ value: event.target.value })}
            disabled={!field}
            aria-label={`Condition ${position} value`}
            className="h-8 min-w-36 flex-1 text-sm"
          />
        )
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
