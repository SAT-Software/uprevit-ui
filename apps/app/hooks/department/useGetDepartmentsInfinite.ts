import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllDepartments } from "@/hooks/department/useGetAllDepartments";
import {
  ListFilter,
  ListOrder,
  WORKSPACE_LIST_LIMIT,
} from "@/lib/workspace-list-query";
import { useAuth } from "react-oidc-context";

export type UseGetDepartmentsInfiniteOptions = {
  limit?: number;
  sort?: string;
  order?: ListOrder;
  search?: string;
  enabled?: boolean;
};

function buildDepartmentSearchFilters(search?: string): ListFilter[] | undefined {
  const trimmed = search?.trim();
  if (!trimmed) return undefined;

  return [
    {
      field: "department_name",
      operator: "contains",
      value: trimmed,
    },
  ];
}

export function useGetDepartmentsInfinite(
  options?: UseGetDepartmentsInfiniteOptions,
) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const limit = options?.limit ?? WORKSPACE_LIST_LIMIT;
  const sort = options?.sort ?? "department_name";
  const order = options?.order ?? "asc";
  const search = options?.search?.trim() ?? "";

  return useInfiniteQuery({
    queryKey: [
      "departments-infinite",
      workspaceId,
      limit,
      sort,
      order,
      search,
    ],
    queryFn: ({ pageParam, signal }) =>
      getAllDepartments({
        signal,
        auth,
        query: {
          page: pageParam,
          limit,
          sort,
          order,
          filters: buildDepartmentSearchFilters(search),
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
