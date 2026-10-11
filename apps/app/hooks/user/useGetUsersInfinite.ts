import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import {
  ListFilter,
  ListOrder,
  WORKSPACE_LIST_LIMIT,
} from "@/lib/workspace-list-query";
import { useAuth } from "react-oidc-context";

export type UseGetUsersInfiniteOptions = {
  limit?: number;
  sort?: string;
  order?: ListOrder;
  search?: string;
  activeOnly?: boolean;
  enabled?: boolean;
};

function buildUserSearchFilters(
  search?: string,
  activeOnly?: boolean,
): ListFilter[] | undefined {
  const trimmed = search?.trim();
  const filters: ListFilter[] = [
    ...(trimmed
      ? [
          {
            field: trimmed.includes("@") ? "email" : "name",
            operator: "contains" as const,
            value: trimmed,
          },
        ]
      : []),
    ...(activeOnly
      ? [{ field: "status", operator: "eq" as const, value: "active" }]
      : []),
  ];

  return filters.length ? filters : undefined;
}

export function useGetUsersInfinite(options?: UseGetUsersInfiniteOptions) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const limit = options?.limit ?? WORKSPACE_LIST_LIMIT;
  const sort = options?.sort ?? "name";
  const order = options?.order ?? "asc";
  const search = options?.search?.trim() ?? "";
  const activeOnly = options?.activeOnly ?? false;

  return useInfiniteQuery({
    queryKey: [
      "users-infinite",
      workspaceId,
      limit,
      sort,
      order,
      search,
      activeOnly,
    ],
    queryFn: ({ pageParam, signal }) =>
      getAllUsersByWorkspace({
        signal,
        auth,
        query: {
          page: pageParam,
          limit,
          sort,
          order,
          filters: buildUserSearchFilters(search, activeOnly),
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.result?.pagination;
      if (!pagination?.hasNextPage) return undefined;
      return pagination.currentPage + 1;
    },
    enabled: auth.isAuthenticated && (options?.enabled ?? true),
  });
}
