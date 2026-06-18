import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import type { BillingChargebeeDetail } from "@/types/billing";

export function useGetPlatformBillingChargebee(workspaceId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "chargebee", workspaceId],
    queryFn: ({ signal }) =>
      fetchPlatformAdmin<BillingChargebeeDetail>(
        `/api/platform-admin/workspaces/${workspaceId}/chargebee`,
        { auth, signal },
      ),
    enabled: auth.isAuthenticated && Boolean(workspaceId),
  });
}
