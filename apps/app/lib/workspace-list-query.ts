"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const WORKSPACE_LIST_LIMIT = 10;

export type ListOrder = "asc" | "desc";

export type ListFilterOperator =
  | "eq"
  | "neq"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "is_null"
  | "is_not_null";

export type ListFilter = {
  field: string;
  operator: ListFilterOperator;
  value?: string | number | boolean;
};

export type ListQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: ListOrder;
  filters?: ListFilter[];
  projectId?: string;
  departmentId?: string;
  includeInactive?: boolean;
};

export type ListFilterColumn = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "boolean";
};

type UseWorkspaceListQueryOptions = {
  defaultSort: string;
  defaultOrder?: ListOrder;
  allowedSortFields: string[];
  filterColumns: ListFilterColumn[];
};

const OPERATORS: ListFilterOperator[] = [
  "eq",
  "neq",
  "contains",
  "not_contains",
  "starts_with",
  "ends_with",
  "gt",
  "gte",
  "lt",
  "lte",
  "is_null",
  "is_not_null",
];

const NO_VALUE_OPERATORS: ListFilterOperator[] = ["is_null", "is_not_null"];

const parsePositiveInt = (value: string | null, fallback: number) => {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return parsed > 0 ? parsed : fallback;
};

const isListOrder = (value: string | null): value is ListOrder =>
  value === "asc" || value === "desc";

const isFilterOperator = (value: unknown): value is ListFilterOperator =>
  typeof value === "string" && OPERATORS.includes(value as ListFilterOperator);

function parseFilters(value: string | null, allowedFields: Set<string>) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((filter): filter is ListFilter => {
      if (!filter || typeof filter !== "object") return false;

      const candidate = filter as Partial<ListFilter>;
      if (!candidate.field || !allowedFields.has(candidate.field)) return false;
      if (!isFilterOperator(candidate.operator)) return false;
      if (NO_VALUE_OPERATORS.includes(candidate.operator)) return true;

      return candidate.value !== undefined && candidate.value !== "";
    });
  } catch {
    return [];
  }
}

function setFiltersParam(params: URLSearchParams, filters: ListFilter[]) {
  if (filters.length === 0) {
    params.delete("filters");
    return;
  }

  params.set("filters", JSON.stringify(filters));
}

export function buildListSearchParams(
  workspaceId: string | undefined,
  query?: ListQueryParams,
) {
  const params = new URLSearchParams();

  if (workspaceId) params.set("workspaceId", workspaceId);
  if (!query) return params;

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.sort) params.set("sort", query.sort);
  if (query.order) params.set("order", query.order);
  if (query.projectId) params.set("projectId", query.projectId);
  if (query.departmentId) params.set("departmentId", query.departmentId);
  if (query.filters?.length) params.set("filters", JSON.stringify(query.filters));
  if (query.includeInactive) params.set("includeInactive", "true");

  return params;
}

export function useWorkspaceListQuery({
  defaultSort,
  defaultOrder = "asc",
  allowedSortFields,
  filterColumns,
}: UseWorkspaceListQueryOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const allowedFilterFields = useMemo(
    () => new Set(filterColumns.map((column) => column.name)),
    [filterColumns],
  );

  const query = useMemo(() => {
    const sortParam = searchParams.get("sort");
    const sort = sortParam && allowedSortFields.includes(sortParam) ? sortParam : defaultSort;
    const order = isListOrder(searchParams.get("order"))
      ? (searchParams.get("order") as ListOrder)
      : defaultOrder;

    return {
      page: parsePositiveInt(searchParams.get("page"), 1),
      limit: WORKSPACE_LIST_LIMIT,
      sort,
      order,
      filters: parseFilters(searchParams.get("filters"), allowedFilterFields),
    };
  }, [
    allowedFilterFields,
    allowedSortFields,
    defaultOrder,
    defaultSort,
    searchParams,
  ]);

  const replaceParams = useCallback(
    (params: URLSearchParams) => {
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    },
    [pathname, router],
  );

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParamsString);
    const before = nextParams.toString();

    nextParams.set("page", String(query.page));
    nextParams.set("limit", String(WORKSPACE_LIST_LIMIT));
    nextParams.set("sort", query.sort);
    nextParams.set("order", query.order);
    setFiltersParam(nextParams, query.filters);

    if (nextParams.toString() !== before) {
      replaceParams(nextParams);
    }
  }, [query, replaceParams, searchParamsString]);

  const updateParams = useCallback(
    (update: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParamsString);
      update(params);
      replaceParams(params);
    },
    [replaceParams, searchParamsString],
  );

  const updateParamsRef = useRef(updateParams);
  updateParamsRef.current = updateParams;

  const setPage = useCallback((page: number) => {
    updateParamsRef.current((params) => {
      params.set("page", String(page));
    });
  }, []);

  const setSort = useCallback((sort: string, order: ListOrder) => {
    updateParamsRef.current((params) => {
      params.set("page", "1");
      params.set("sort", sort);
      params.set("order", order);
    });
  }, []);

  const setFilters = useCallback((filters: ListFilter[]) => {
    updateParamsRef.current((params) => {
      params.set("page", "1");
      setFiltersParam(params, filters);
    });
  }, []);

  const clearFilters = useCallback(() => {
    updateParamsRef.current((params) => {
      params.set("page", "1");
      params.delete("filters");
    });
  }, []);

  return useMemo(
    () => ({
      query,
      setPage,
      setSort,
      setFilters,
      clearFilters,
    }),
    [clearFilters, query, setFilters, setPage, setSort],
  );
}
