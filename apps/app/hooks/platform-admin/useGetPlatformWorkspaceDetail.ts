import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { PlatformWorkspaceDetail } from "@/types/platform-admin";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export function useGetPlatformWorkspaceDetail(workspaceId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "workspace", workspaceId],
    queryFn: ({ signal }) =>
      fetchPlatformAdmin<PlatformWorkspaceDetail>(
        `/api/platform-admin/workspaces/${workspaceId}`,
        { auth, signal },
      ),
    enabled:
      Boolean(workspaceId) &&
      auth.isAuthenticated &&
      isPlatformOperatorProfile(auth.user?.profile),
  });
}
