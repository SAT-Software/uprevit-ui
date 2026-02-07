"use client";

import { useState, useCallback, useEffect } from "react";
import { SavedQuery, QueryCondition } from "@/types/reports";

const LOCAL_STORAGE_KEY = "uprevit_reports_saved_queries";

export function useSavedQueries() {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as SavedQuery[]) : [];
      if (isMounted) setQueries(parsed);
    } catch (error) {
      console.error("Failed to load saved queries from localStorage:", error);
      if (isMounted) setQueries([]);
    } finally {
      if (isMounted) setIsLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

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
    isLoaded,
    saveQuery,
    deleteQuery,
    getQuery,
  };
}
