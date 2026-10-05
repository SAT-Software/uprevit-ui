"use client";

import { useState, useCallback } from "react";
import { QueryCondition } from "@/types/reports";

type BaseCondition = { id: string; logic?: "AND" | "OR" };

export type QueryBuilderOptions<T extends BaseCondition> = {
  createCondition: () => Omit<T, "id" | "logic">;
  isConditionComplete: (condition: T) => boolean;
};

export const REPORTS_QUERY_BUILDER_OPTIONS: QueryBuilderOptions<QueryCondition> =
  {
    createCondition: () => ({
      tab: "",
      field: "",
      operator: "equals",
      value: "",
    }),
    isConditionComplete: (condition) => {
      if (!condition.tab || !condition.field) return false;
      if (
        condition.operator === "exists" ||
        condition.operator === "not_exists"
      )
        return true;
      return Array.isArray(condition.value)
        ? condition.value.length > 0
        : !!condition.value;
    },
  };

export function useQueryBuilderState<T extends BaseCondition>({
  createCondition,
  isConditionComplete,
}: QueryBuilderOptions<T>) {
  const [conditions, setConditions] = useState<T[]>([]);
  const [conditionLogic, setConditionLogic] = useState<"AND" | "OR">("AND");

  const addCondition = useCallback(() => {
    setConditions((prev) => {
      const newCondition = {
        id: crypto.randomUUID(),
        ...createCondition(),
        ...(prev.length > 0 ? { logic: conditionLogic } : {}),
      } as T;
      return [...prev, newCondition];
    });
  }, [conditionLogic, createCondition]);

  const updateCondition = useCallback(
    (id: string, updates: Partial<Omit<T, "id">>) => {
      setConditions((prev) =>
        prev.map((condition) =>
          condition.id === id ? { ...condition, ...updates } : condition
        )
      );
    },
    []
  );

  const updateConditionLogic = useCallback(
    (id: string, logic: "AND" | "OR") => {
      setConditions((prev) =>
        prev.map((condition) =>
          condition.id === id ? { ...condition, logic } : condition
        )
      );
    },
    []
  );

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((condition) => condition.id !== id));
  }, []);

  const clearConditions = useCallback(() => {
    setConditions([]);
  }, []);

  const loadConditions = useCallback(
    (savedConditions: T[], savedLogic?: "AND" | "OR") => {
      setConditions(savedConditions);
      setConditionLogic(savedLogic || "AND");
    },
    []
  );

  const validateConditions = useCallback(
    () => conditions.length > 0 && conditions.every(isConditionComplete),
    [conditions, isConditionComplete]
  );

  const getApiConditions = useCallback(() => {
    return conditions.map((condition, index) => {
      if (index === 0) {
        const firstCondition = { ...condition };
        delete firstCondition.logic;
        return firstCondition;
      }
      return condition;
    });
  }, [conditions]);

  return {
    conditions,
    conditionLogic,
    setConditionLogic,
    addCondition,
    updateCondition,
    updateConditionLogic,
    removeCondition,
    clearConditions,
    loadConditions,
    validateConditions,
    getApiConditions,
  };
}
