import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { WORKSPACE_LIST_LIMIT } from "@/lib/workspace-list-query";
import { getProductVersions } from "@/hooks/product/getProductVersions";

export type UseGetProductVersionsInfiniteOptions = {
  limit?: number;
  enabled?: boolean;
};

export function useGetProductVersionsInfinite(
  productId: string,
  options?: UseGetProductVersionsInfiniteOptions,
) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;
  const limit = options?.limit ?? WORKSPACE_LIST_LIMIT;

  return useInfiniteQuery({
    queryKey: ["product-versions-infinite", workspaceId, productId, limit],
    queryFn: ({ pageParam, signal }) =>
      getProductVersions({
        signal,
        auth,
        productId,
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.result?.pagination;
      if (!pagination?.hasNextPage) return undefined;
      return pagination.currentPage + 1;
    },
    enabled: auth.isAuthenticated && !!productId && (options?.enabled ?? true),
  });
}
