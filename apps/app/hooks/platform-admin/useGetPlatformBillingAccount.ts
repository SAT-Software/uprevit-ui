import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { PlatformBillingDetail } from "@/types/billing";

export function useGetPlatformBillingAccount(
  workspaceId: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "billing-account", workspaceId],
    queryFn: ({ signal }) =>
      fetchPlatformAdmin<PlatformBillingDetail>(
        `/api/platform-admin/workspaces/${workspaceId}/billing-account`,
        { auth, signal },
      ),
    enabled: enabled && Boolean(workspaceId) && auth.isAuthenticated,
  });
}
