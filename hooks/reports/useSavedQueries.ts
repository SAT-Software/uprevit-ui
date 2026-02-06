"use client";

import { useState, useCallback } from "react";
import { SavedQuery, QueryCondition } from "@/types/reports";

const LOCAL_STORAGE_KEY = "uprevit_reports_saved_queries";

export function useSavedQueries() {
  const [queries, setQueries] = useState<SavedQuery[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as SavedQuery[]) : [];
    } catch (error) {
      console.error("Failed to load saved queries from localStorage:", error);
      return [];
    }
  });

  const saveQuery = useCallback(
    (
      name: string,
      conditions: QueryCondition[],
      conditionLogic: "AND" | "OR"
    ) => {
      try {
        const newQuery: SavedQuery = {
          id: crypto.randomUUID(),
          name,
          conditions,
          conditionLogic,
          createdAt: new Date().toISOString(),
        };
        const updated = [...queries, newQuery];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setQueries(updated);
        return { success: true, query: newQuery };
      } catch (error) {
        console.error("Failed to save query:", error);
        return {
          success: false,
          error: "Failed to save query. LocalStorage may be full.",
        };
      }
    },
    [queries]
  );

  const deleteQuery = useCallback(
    (id: string) => {
      try {
        const updated = queries.filter((q) => q.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setQueries(updated);
        return { success: true };
      } catch (error) {
        console.error("Failed to delete query:", error);
        return { success: false, error: "Failed to delete query" };
      }
    },
    [queries]
  );

  const getQuery = useCallback(
    (id: string) => {
      return queries.find((q) => q.id === id);
    },
    [queries]
  );

  return {
    queries,
    saveQuery,
    deleteQuery,
    getQuery,
  };
}
