"use client";

import { useState, useCallback } from "react";
import { QueryCondition } from "@/types/reports";

export function useQueryBuilderState() {
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [conditionLogic, setConditionLogic] = useState<"AND" | "OR">("AND");

  const addCondition = useCallback(() => {
    setConditions((prev) => {
      const newCondition: QueryCondition = {
        id: crypto.randomUUID(),
        tab: "",
        field: "",
        operator: "equals",
        value: "",
        ...(prev.length > 0 ? { logic: conditionLogic } : {}),
      };
      return [...prev, newCondition];
    });
  }, [conditionLogic]);

  const updateCondition = useCallback(
    (id: string, updates: Partial<Omit<QueryCondition, "id">>) => {
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
    (savedConditions: QueryCondition[], savedLogic?: "AND" | "OR") => {
      setConditions(savedConditions);
      setConditionLogic(savedLogic || "AND");
    },
    []
  );

  const validateConditions = useCallback(() => {
    if (conditions.length === 0) return false;

    return conditions.every((condition) => {
      if (!condition.tab || !condition.field) return false;

      if (
        condition.operator !== "exists" &&
        condition.operator !== "not_exists"
      ) {
        if (
          !condition.value ||
          (Array.isArray(condition.value) && condition.value.length === 0)
        )
          return false;
      }

      return true;
    });
  }, [conditions]);

  const getApiConditions = useCallback(() => {
    return conditions.map((condition, index) => {
      if (index === 0) {
        const { id, logic, ...rest } = condition;
        return { id, ...rest };
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
