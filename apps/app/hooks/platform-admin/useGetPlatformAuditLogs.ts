import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type {
  PaginatedResponse,
  PlatformAuditLogItem,
} from "@/types/platform-admin";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export type PlatformAuditLogsFilters = {
  page?: number;
  limit?: number;
  search?: string;
  workspaceId?: string;
  action?: string;
  status?: "success" | "failed";
  sort?: string;
  order?: "asc" | "desc";
};

export function useGetPlatformAuditLogs(filters: PlatformAuditLogsFilters) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "audit-logs", filters],
    queryFn: ({ signal }) => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
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
    enabled:
      auth.isAuthenticated &&
      isPlatformOperatorProfile(auth.user?.profile),
  });
}
