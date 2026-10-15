import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { SupportConfig } from "@/types/support";
import { getSupportPrincipal } from "@/hooks/support/useSupportPrincipal";

export function useGetSupportConfig() {
  const auth = useAuth();
  const userId = auth.user?.profile?.userId;
  const accessToken = auth.user?.access_token;
  const principal = getSupportPrincipal(auth);

  const query = useQuery({
    queryKey: ["support", "config", principal],
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/support/config", {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal,
      });
      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to load support settings"),
        );
      }
      const data = (await response.json()) as { result: SupportConfig };
      return data.result;
    },
    enabled: !auth.isLoading && Boolean(principal && accessToken),
    staleTime: 0,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const isCurrent = !auth.isLoading && Boolean(principal) && query.isSuccess && !query.isError &&
    query.data?.distinctId === userId;
  return {
    ...query,
    data: isCurrent ? query.data : undefined,
    isFresh: isCurrent && query.fetchStatus === "idle",
  };
}
