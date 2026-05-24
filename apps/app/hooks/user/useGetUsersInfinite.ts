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
  enabled?: boolean;
};

function buildUserSearchFilters(search?: string): ListFilter[] | undefined {
  const trimmed = search?.trim();
  if (!trimmed) return undefined;

  return [
    {
      field: "name",
      operator: "contains",
      value: trimmed,
    },
  ];
}

export function useGetUsersInfinite(options?: UseGetUsersInfiniteOptions) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const limit = options?.limit ?? WORKSPACE_LIST_LIMIT;
  const sort = options?.sort ?? "name";
  const order = options?.order ?? "asc";
  const search = options?.search?.trim() ?? "";

  return useInfiniteQuery({
    queryKey: ["users-infinite", workspaceId, limit, sort, order, search],
    queryFn: ({ pageParam, signal }) =>
      getAllUsersByWorkspace({
        signal,
        auth,
        query: {
          page: pageParam,
          limit,
          sort,
          order,
          filters: buildUserSearchFilters(search),
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
