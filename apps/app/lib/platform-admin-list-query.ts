"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWorkspaceListQuery,
  type ListFilterColumn,
  type ListOrder,
} from "@/lib/workspace-list-query";

export function usePlatformAdminUrlSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const committedSearch = searchParams.get("search")?.trim() ?? "";

  const [draft, setDraft] = useState(committedSearch);

  useEffect(() => {
    setDraft(committedSearch);
  }, [committedSearch]);

  const replaceParams = useCallback(
    (update: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParamsString);
      update(params);
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    },
    [pathname, router, searchParamsString],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = draft.trim();
      if (trimmed === committedSearch) return;

      replaceParams((params) => {
        if (trimmed) {
          params.set("search", trimmed);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [committedSearch, draft, replaceParams]);

  return {
    searchDraft: draft,
    setSearchDraft: setDraft,
    committedSearch: committedSearch || undefined,
  };
}

export function usePlatformAdminWorkspaceIdFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const workspaceId = searchParams.get("workspaceId")?.trim() ?? undefined;

  const clearWorkspaceFilter = useCallback(() => {
    const params = new URLSearchParams(searchParamsString);
    params.delete("workspaceId");
    params.set("page", "1");
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [pathname, router, searchParamsString]);

  return { workspaceId, clearWorkspaceFilter };
}

type UsePlatformAdminListQueryOptions = {
  defaultSort: string;
  defaultOrder?: ListOrder;
  allowedSortFields: string[];
  filterColumns: ListFilterColumn[];
};

export function usePlatformAdminListQuery(options: UsePlatformAdminListQueryOptions) {
  const listState = useWorkspaceListQuery(options);
  const urlSearch = usePlatformAdminUrlSearch();

  const query = useMemo(
    () => ({
      ...listState.query,
      search: urlSearch.committedSearch,
    }),
    [listState.query, urlSearch.committedSearch],
  );

  return {
    ...listState,
    query,
    searchDraft: urlSearch.searchDraft,
    setSearchDraft: urlSearch.setSearchDraft,
  };
}

export function mapPlatformPagination(
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
) {
  if (!pagination) return undefined;

  return {
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    totalCount: pagination.total,
    limit: pagination.limit,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1,
  };
}
