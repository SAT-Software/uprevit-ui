"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { SavedQuery, QueryCondition } from "@/types/reports";

const REPORTS_STORAGE_KEY = "uprevit_reports_saved_queries";

function readStorage(storageKey: string) {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function useSavedQueries<T = QueryCondition>(
  storageKey: string = REPORTS_STORAGE_KEY,
) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener("storage", onChange);
      window.addEventListener(storageKey, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(storageKey, onChange);
      };
    },
    [storageKey],
  );
  const stored = useSyncExternalStore(
    subscribe,
    () => readStorage(storageKey),
    () => undefined,
  );
  const isLoaded = stored !== undefined;
  const queries = useMemo<SavedQuery<T>[]>(() => {
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
      conditions: T[],
      conditionLogic: "AND" | "OR"
    ) => {
      try {
        const newQuery: SavedQuery<T> = {
          id: crypto.randomUUID(),
          name,
          conditions,
          conditionLogic,
          createdAt: new Date().toISOString(),
        };
        const updated = [...queries, newQuery];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event(storageKey));
        return { success: true, query: newQuery };
      } catch (error) {
        console.error("Failed to save query:", error);
        return {
          success: false,
          error: "Failed to save query. LocalStorage may be full.",
        };
      }
    },
    [queries, storageKey]
  );

  const deleteQuery = useCallback(
    (id: string) => {
      try {
        const updated = queries.filter((q) => q.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event(storageKey));
        return { success: true };
      } catch (error) {
        console.error("Failed to delete query:", error);
        return { success: false, error: "Failed to delete query" };
      }
    },
    [queries, storageKey]
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
