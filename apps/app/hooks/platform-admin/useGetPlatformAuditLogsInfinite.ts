import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type {
  PaginatedResponse,
  PlatformAuditLogItem,
} from "@/types/platform-admin";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export type PlatformAuditLogsInfiniteFilters = {
  limit?: number;
  search?: string;
  workspaceId?: string;
  action?: string;
  status?: "success" | "failed";
  sort?: string;
  order?: "asc" | "desc";
};

export function useGetPlatformAuditLogsInfinite(
  filters: PlatformAuditLogsInfiniteFilters,
) {
  const auth = useAuth();

  return useInfiniteQuery({
    queryKey: ["platform-admin", "audit-logs-infinite", filters],
    queryFn: ({ pageParam, signal }) => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
      if (filters.action) params.set("action", filters.action);
      if (filters.status) params.set("status", filters.status);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.order) params.set("order", filters.order);

      const query = params.toString();
      return fetchPlatformAdmin<PaginatedResponse<PlatformAuditLogItem>>(
        `/api/platform-admin/audit-logs${query ? `?${query}` : ""}`,
        { auth, signal },
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination || pagination.page >= pagination.totalPages) {
        return undefined;
      }
      return pagination.page + 1;
    },
    enabled:
      auth.isAuthenticated &&
      isPlatformOperatorProfile(auth.user?.profile),
  });
}
