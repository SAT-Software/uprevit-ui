"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { SavedQuery, QueryCondition } from "@/types/reports";

const LOCAL_STORAGE_KEY = "uprevit_reports_saved_queries";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCAL_STORAGE_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCAL_STORAGE_KEY, onChange);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useSavedQueries() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => undefined);
  const isLoaded = stored !== undefined;
  const queries = useMemo<SavedQuery[]>(() => {
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load saved queries from localStorage:", error);
      return [];
    }
  }, [stored]);

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
        window.dispatchEvent(new Event(LOCAL_STORAGE_KEY));
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
        window.dispatchEvent(new Event(LOCAL_STORAGE_KEY));
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
