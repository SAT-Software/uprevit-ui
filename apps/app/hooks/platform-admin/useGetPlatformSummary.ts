import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { PlatformSummary } from "@/types/platform-admin";
import { fetchPlatformAdmin } from "@/hooks/platform-admin/fetchPlatformAdmin";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";

export function useGetPlatformSummary(enabled = true) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["platform-admin", "summary"],
    queryFn: ({ signal }) =>
      fetchPlatformAdmin<PlatformSummary>("/api/platform-admin/summary", {
        auth,
        signal,
      }),
    enabled:
      enabled &&
      auth.isAuthenticated &&
      isPlatformOperatorProfile(auth.user?.profile),
  });
}
