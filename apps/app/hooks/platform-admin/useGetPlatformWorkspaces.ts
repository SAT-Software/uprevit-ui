import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type {
  PaginatedResponse,
  PlatformWorkspaceListItem,
} from "@/types/platform-admin";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export type PlatformWorkspacesFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export function useGetPlatformWorkspaces(filters: PlatformWorkspacesFilters) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "workspaces", filters],
    queryFn: ({ signal }) => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.order) params.set("order", filters.order);

      const query = params.toString();
      return fetchPlatformAdmin<PaginatedResponse<PlatformWorkspaceListItem>>(
        `/api/platform-admin/workspaces${query ? `?${query}` : ""}`,
        { auth, signal },
      );
    },
    enabled:
      auth.isAuthenticated &&
      isPlatformOperatorProfile(auth.user?.profile),
  });
}
