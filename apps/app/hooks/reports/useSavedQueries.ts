"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import {
  ApiError,
  getErrorMessage,
  getResponseError,
  shouldRetryQuery,
} from "@/lib/api-error";
import type { QueryCondition, SavedQuery } from "@/types/reports";

export type SavedQueryKind = "report" | "workflow";

type ConditionLogic = "AND" | "OR";

type SavedQueryDefinition = {
  conditions: unknown[];
  conditionLogic?: ConditionLogic;
};

type ApiSavedQuery = {
  id: string;
  kind: SavedQueryKind;
  name: string;
  definition: SavedQueryDefinition;
  shared: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SavedQueryCodec<T> = {
  toStored: (condition: T) => unknown;
  fromStored: (condition: unknown) => T;
};

type LegacySavedQuery = {
  name?: string;
  conditions?: unknown[];
  conditionLogic?: ConditionLogic;
};

const QUERY_KEY = "saved-queries";
const BASE_URL = "/api/reports/saved-queries";
const LEGACY_STORAGE_KEYS: Record<SavedQueryKind, string> = {
  report: "uprevit_reports_saved_queries",
  workflow: "uprevit_workflow_saved_searches",
};
const LEGACY_IMPORT_LIMIT = 50;
const importedKinds = new Set<SavedQueryKind>();

async function request<R>(
  auth: AuthContextProps,
  path: string,
  fallbackMessage: string,
  init: RequestInit = {},
): Promise<R> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.user?.access_token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw await getResponseError(response, fallbackMessage);
  return response.json();
}

const listSavedQueries = async (
  auth: AuthContextProps,
  kind: SavedQueryKind,
  signal: AbortSignal,
) => {
  const data = await request<{ result: { queries: ApiSavedQuery[] } }>(
    auth,
    `?kind=${kind}`,
    "Failed to fetch saved queries",
    { signal },
  );
  return data.result.queries;
};

const createSavedQuery = (
  auth: AuthContextProps,
  body: {
    kind: SavedQueryKind;
    name: string;
    definition: SavedQueryDefinition;
    shared: boolean;
  },
) =>
  request<{ result: { query: ApiSavedQuery } }>(
    auth,
    "",
    "Failed to save query",
    { method: "POST", body: JSON.stringify(body) },
  );

const updateSavedQuery = (
  auth: AuthContextProps,
  id: string,
  changes: { shared: boolean },
) =>
  request<{ result: { query: ApiSavedQuery } }>(
    auth,
    `/${id}`,
    "Failed to update saved query",
    { method: "PUT", body: JSON.stringify(changes) },
  );

const deleteSavedQuery = (auth: AuthContextProps, id: string) =>
  request<unknown>(auth, `/${id}`, "Failed to delete saved query", {
    method: "DELETE",
  });

const readLegacy = (kind: SavedQueryKind): LegacySavedQuery[] => {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEYS[kind]);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, LEGACY_IMPORT_LIMIT) : [];
  } catch {
    return [];
  }
};

const removeLegacy = (kind: SavedQueryKind) => {
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEYS[kind]);
  } catch {}
};

const restoreLegacy = (kind: SavedQueryKind, items: LegacySavedQuery[]) => {
  try {
    window.localStorage.setItem(LEGACY_STORAGE_KEYS[kind], JSON.stringify(items));
  } catch {}
};

const toResult = async <R>(action: () => Promise<R>, fallback: string) => {
  try {
    return { success: true as const, data: await action() };
  } catch (error) {
    return { success: false as const, error: getErrorMessage(error, fallback) };
  }
};

export function useSavedQueries<T = QueryCondition>(
  kind: SavedQueryKind = "report",
  codec?: SavedQueryCodec<T>,
) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => [QUERY_KEY, workspaceId, kind],
    [workspaceId, kind],
  );

  const listQuery = useQuery({
    queryKey,
    queryFn: ({ signal }) => listSavedQueries(auth, kind, signal),
    enabled: auth.isAuthenticated && Boolean(workspaceId),
    retry: shouldRetryQuery,
  });

  const isLoaded = listQuery.isSuccess;
  const apiQueries = listQuery.data;

  const toSavedQuery = useCallback(
    (query: ApiSavedQuery): SavedQuery<T> => ({
      id: query.id,
      name: query.name,
      conditions: query.definition.conditions.map((condition) =>
        codec ? codec.fromStored(condition) : (condition as T),
      ),
      conditionLogic: query.definition.conditionLogic,
      createdAt: query.createdAt,
      updatedAt: query.updatedAt,
      shared: query.shared,
      isOwner: query.isOwner,
    }),
    [codec],
  );

  const queries = useMemo(
    () => (apiQueries ?? []).map(toSavedQuery),
    [apiQueries, toSavedQuery],
  );

  const toDefinition = useCallback(
    (conditions: unknown[], conditionLogic?: ConditionLogic) => ({
      conditions: codec
        ? conditions.map((condition) => codec.toStored(condition as T))
        : conditions,
      ...(conditionLogic ? { conditionLogic } : {}),
    }),
    [codec],
  );

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient, queryKey],
  );

  const createMutation = useMutation({
    mutationFn: (input: {
      name: string;
      conditions: T[];
      conditionLogic: ConditionLogic;
      shared: boolean;
    }) =>
      createSavedQuery(auth, {
        kind,
        name: input.name,
        definition: toDefinition(input.conditions, input.conditionLogic),
        shared: input.shared,
      }),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, shared }: { id: string; shared: boolean }) =>
      updateSavedQuery(auth, id, { shared }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSavedQuery(auth, id),
    onSuccess: invalidate,
  });

  const { mutateAsync: createAsync } = createMutation;
  const { mutateAsync: updateAsync } = updateMutation;
  const { mutateAsync: deleteAsync } = deleteMutation;

  const saveQuery = useCallback(
    async (
      name: string,
      conditions: T[],
      conditionLogic: ConditionLogic,
      shared = false,
    ) => {
      const result = await toResult(
        () => createAsync({ name, conditions, conditionLogic, shared }),
        "Failed to save query.",
      );
      return result.success
        ? { success: true, query: toSavedQuery(result.data.result.query) }
        : { success: false, error: result.error };
    },
    [createAsync, toSavedQuery],
  );

  const deleteQuery = useCallback(
    async (id: string) => {
      const result = await toResult(
        () => deleteAsync(id),
        "Failed to delete query.",
      );
      return result.success
        ? { success: true }
        : { success: false, error: result.error };
    },
    [deleteAsync],
  );

  const updateShared = useCallback(
    async (id: string, shared: boolean) => {
      const result = await toResult(
        () => updateAsync({ id, shared }),
        "Failed to update saved query.",
      );
      return result.success
        ? { success: true }
        : { success: false, error: result.error };
    },
    [updateAsync],
  );

  const getQuery = useCallback(
    (id: string) => queries.find((query) => query.id === id),
    [queries],
  );

  const hasServerQueries = (apiQueries?.length ?? 0) > 0;

  useEffect(() => {
    if (!isLoaded || importedKinds.has(kind)) return;
    importedKinds.add(kind);
    if (hasServerQueries) return;
    const legacy = readLegacy(kind);
    if (legacy.length === 0) return;
    removeLegacy(kind);

    void (async () => {
      for (const [index, item] of legacy.entries()) {
        if (
          typeof item?.name !== "string" ||
          !item.name.trim() ||
          !Array.isArray(item.conditions) ||
          item.conditions.length === 0
        ) {
          continue;
        }
        try {
          await createSavedQuery(auth, {
            kind,
            name: item.name.trim(),
            definition: toDefinition(item.conditions, item.conditionLogic),
            shared: false,
          });
        } catch (error) {
          if (error instanceof ApiError && error.status === 400) continue;
          restoreLegacy(kind, legacy.slice(index));
          void invalidate();
          return;
        }
      }
      void invalidate();
    })();
  }, [auth, hasServerQueries, invalidate, isLoaded, kind, toDefinition]);

  return {
    queries,
    isLoaded,
    saveQuery,
    deleteQuery,
    updateShared,
    getQuery,
  };
}
