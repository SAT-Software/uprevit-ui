import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/hooks/project/useGetAllProjects";
import {
  ListFilter,
  ListOrder,
  WORKSPACE_LIST_LIMIT,
} from "@/lib/workspace-list-query";
import { useAuth } from "react-oidc-context";

export type UseGetProjectsInfiniteOptions = {
  limit?: number;
  sort?: string;
  order?: ListOrder;
  search?: string;
  departmentId?: string;
  enabled?: boolean;
};

function buildProjectSearchFilters(search?: string): ListFilter[] | undefined {
  const trimmed = search?.trim();
  if (!trimmed) return undefined;

  return [
    {
      field: "project_name",
      operator: "contains",
      value: trimmed,
    },
  ];
}

export function useGetProjectsInfinite(options?: UseGetProjectsInfiniteOptions) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const limit = options?.limit ?? WORKSPACE_LIST_LIMIT;
  const sort = options?.sort ?? "project_name";
  const order = options?.order ?? "asc";
  const search = options?.search?.trim() ?? "";
  const departmentId = options?.departmentId;

  return useInfiniteQuery({
    queryKey: [
      "projects-infinite",
      workspaceId,
      limit,
      sort,
      order,
      search,
      departmentId,
    ],
    queryFn: ({ pageParam, signal }) =>
      getAllProjects({
        signal,
        auth,
        query: {
          page: pageParam,
          limit,
          sort,
          order,
          departmentId,
          filters: buildProjectSearchFilters(search),
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
