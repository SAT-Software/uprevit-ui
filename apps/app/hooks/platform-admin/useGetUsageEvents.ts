import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { UsageEvent } from "@/types/billing";
import type { PaginatedResponse } from "@/types/platform-admin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export function useGetUsageEvents(
  workspaceId: string,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "usage-events", workspaceId, page, limit],
    queryFn: ({ signal }) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      return fetchPlatformAdmin<PaginatedResponse<UsageEvent>>(
        `/api/platform-admin/workspaces/${workspaceId}/usage-events?${params}`,
        { auth, signal },
      );
    },
    enabled:
      enabled &&
      Boolean(workspaceId) &&
      auth.isAuthenticated &&
      isPlatformOperatorProfile(auth.user?.profile),
  });
}
