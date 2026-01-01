"use client";

import { Button } from "@/components/ui/button";
import { PiPlusCircleDuotone, PiPlusDuotone } from "react-icons/pi";
import { QueryCondition } from "@/types/reports";
import { ConditionRow } from "./ConditionRow";
import { LogicToggle } from "./LogicToggle";

export interface QueryBuilderProps {
  conditions: QueryCondition[];
  conditionLogic: "AND" | "OR";
  onAddCondition: () => void;
  onUpdateCondition: (
    id: string,
    updates: Partial<Omit<QueryCondition, "id">>
  ) => void;
  onRemoveCondition: (id: string) => void;
  onLogicChange: (logic: "AND" | "OR") => void;
  maxConditions?: number;
}

export function QueryBuilder({
  conditions,
  conditionLogic,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  onLogicChange,
  maxConditions = 10,
}: QueryBuilderProps) {
  const canAddMore = conditions.length < maxConditions;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm ml-1 font-medium text-muted-foreground">
          Query Conditions
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddCondition}
          disabled={!canAddMore}
          className="gap-1"
        >
          <PiPlusCircleDuotone size={16} />
          Add Condition
        </Button>
      </div>

      {conditions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground">
            No conditions added yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Add Condition" to start building your query
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <div key={condition.id} className="mb-0">
              <ConditionRow
                condition={condition}
                onUpdate={(updates) => onUpdateCondition(condition.id, updates)}
                onRemove={() => onRemoveCondition(condition.id)}
              />
              {index < conditions.length - 1 && (
                <LogicToggle value={conditionLogic} onChange={onLogicChange} />
              )}
            </div>
          ))}
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxConditions} conditions reached
        </p>
      )}
    </div>
  );
}
