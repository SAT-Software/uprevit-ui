"use client";

import { Add01Icon, FilterVerticalIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import type { ReactNode } from "react";
import { LogicToggle } from "./LogicToggle";

type BaseCondition = { id: string; logic?: "AND" | "OR" };

export type ConditionRowRenderProps<T> = {
  position: number;
  onUpdate: (updates: Partial<Omit<T, "id">>) => void;
  onRemove: () => void;
};

export interface QueryBuilderProps<T extends BaseCondition> {
  conditions: T[];
  conditionLogic: "AND" | "OR";
  onAddCondition: () => void;
  onUpdateCondition: (id: string, updates: Partial<Omit<T, "id">>) => void;
  onRemoveCondition: (id: string) => void;
  onConditionLogicChange: (id: string, logic: "AND" | "OR") => void;
  renderCondition: (condition: T, props: ConditionRowRenderProps<T>) => ReactNode;
  emptyDescription?: string;
  maxConditions?: number;
}

export function QueryBuilder<T extends BaseCondition>({
  conditions,
  conditionLogic,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  onConditionLogicChange,
  renderCondition,
  emptyDescription = "Add conditions to filter and search products",
  maxConditions = 10,
}: QueryBuilderProps<T>) {
  const canAddMore = conditions.length < maxConditions;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-foreground">Query Conditions</p>
      </div>

      {conditions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
            <Icon
              icon={FilterVerticalIcon}
              size={20}
              strokeWidth={2}
              className="text-muted-foreground/60"
            />
          </div>
          <p className="text-sm font-medium text-foreground">
            No conditions added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {emptyDescription}
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={onAddCondition}
            className="mt-4 gap-1.5"
          >
            <Icon icon={Add01Icon} size={16} strokeWidth={2} />
            Add First Condition
          </Button>
        </div>
      ) : (
        <div className="space-y-0">
          {conditions.map((condition, index) => (
            <div key={condition.id}>
              {renderCondition(condition, {
                position: index + 1,
                onUpdate: (updates) => onUpdateCondition(condition.id, updates),
                onRemove: () => onRemoveCondition(condition.id),
              })}
              {index < conditions.length - 1 ? (
                <LogicToggle
                  value={conditions[index + 1].logic || conditionLogic}
                  onChange={(logic) =>
                    onConditionLogicChange(conditions[index + 1].id, logic)
                  }
                />
              ) : null}
            </div>
          ))}

          <div className="flex items-center justify-center pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onAddCondition}
              disabled={!canAddMore}
              className="gap-1.5"
            >
              <Icon icon={Add01Icon} size={16} strokeWidth={2} />
              Add Another Condition
            </Button>
          </div>
        </div>
      )}

      {!canAddMore ? (
        <p className="text-center text-xs text-muted-foreground">
          Maximum {maxConditions} conditions reached
        </p>
      ) : null}
    </div>
  );
}
