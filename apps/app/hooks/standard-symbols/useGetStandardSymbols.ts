import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import type { StandardSymbolsResponse } from "@/types/standard-symbol";

async function getStandardSymbols({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const accessToken = auth.user?.access_token;
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch("/api/standard-symbols", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch standard symbols");
  }

  return (await response.json()) as StandardSymbolsResponse;
}

export function useGetStandardSymbols() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["standard-symbols"],
    queryFn: ({ signal }) => getStandardSymbols({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
