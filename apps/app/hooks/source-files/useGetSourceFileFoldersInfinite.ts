import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getAllSourceFileFolders,
  SOURCE_FILES_LIST_LIMIT,
} from "@/hooks/source-files/useGetAllSourceFileFolders";
import { ListFilter, ListOrder } from "@/lib/workspace-list-query";
import { useAuth } from "react-oidc-context";

export type UseGetSourceFileFoldersInfiniteOptions = {
  limit?: number;
  sort?: string;
  order?: ListOrder;
  filters?: ListFilter[];
  enabled?: boolean;
};

export function useGetSourceFileFoldersInfinite(
  options?: UseGetSourceFileFoldersInfiniteOptions,
) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const limit = options?.limit ?? SOURCE_FILES_LIST_LIMIT;
  const sort = options?.sort ?? "name";
  const order = options?.order ?? "asc";
  const filters = options?.filters ?? [];

  return useInfiniteQuery({
    queryKey: [
      "source-files-folders-infinite",
      workspaceId,
      limit,
      sort,
      order,
      filters,
    ],
    queryFn: ({ pageParam, signal }) =>
      getAllSourceFileFolders({
        signal,
        auth,
        query: {
          page: pageParam,
          limit,
          sort,
          order,
          filters: filters.length > 0 ? filters : undefined,
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
