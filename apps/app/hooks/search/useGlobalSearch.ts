import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";

export const GLOBAL_SEARCH_MIN_LENGTH = 2;

export type GlobalSearchItem = {
  id: string;
  title: string;
  code?: string;
  meta?: string;
};

export type GlobalSearchResult = Record<
  "products" | "projects" | "departments" | "workflows",
  GlobalSearchItem[]
>;

export function useGlobalSearch(search: string) {
  const auth = useAuth();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setQuery(search.trim()), 200);
    return () => clearTimeout(timeout);
  }, [search]);

  const enabled =
    auth.isAuthenticated && query.length >= GLOBAL_SEARCH_MIN_LENGTH;

  const result = useQuery({
    queryKey: ["global-search", auth.user?.profile?.workspaceId, query],
    queryFn: async ({ signal }): Promise<GlobalSearchResult & { query: string }> => {
      const response = await fetch(
        `/api/global-search?${new URLSearchParams({ q: query })}`,
        {
          headers: { Authorization: `Bearer ${auth.user?.access_token}` },
          signal,
        },
      );
      if (!response.ok) {
        throw await getResponseError(response, "Failed to search");
      }
      return { ...(await response.json()).result, query };
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    ...result,
    data: enabled ? result.data : undefined,
    isSearching:
      search.trim().length >= GLOBAL_SEARCH_MIN_LENGTH &&
      (search.trim() !== query || result.isFetching),
  };
}
