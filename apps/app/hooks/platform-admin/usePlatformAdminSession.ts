import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { PlatformOperatorSession } from "@/types/platform-admin";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export function usePlatformAdminSession() {
  const auth = useAuth();
  const hasCognitoGroup = isPlatformOperatorProfile(auth.user?.profile);

  return useQuery({
    queryKey: ["platform-admin", "session"],
    queryFn: ({ signal }) =>
      fetchPlatformAdmin<PlatformOperatorSession>("/api/platform-admin/session", {
        auth,
        signal,
      }),
    enabled: auth.isAuthenticated && hasCognitoGroup,
    retry: false,
  });
}
