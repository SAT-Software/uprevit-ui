import { useQuery } from "@tanstack/react-query";
import {
  buildListSearchParams,
  ListQueryParams,
} from "@/lib/workspace-list-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import type { UsersListResponse } from "@/types/user";

export async function getAllUsersByWorkspace({
  signal,
  auth,
  query,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  query?: ListQueryParams;
}): Promise<UsersListResponse> {
  const params = buildListSearchParams(
    auth.user?.profile?.workspaceId as string | undefined,
    query,
  );

  const response = await fetch(`/api/users/workspace?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch users");
  }
  return response.json();
}

export function useGetAllUsersByWorkspace(query?: ListQueryParams) {
  const auth = useAuth();
  const workspaceId = auth.user?.profile?.workspaceId;

  return useQuery({
    queryKey: ["users", workspaceId, query],
    queryFn: ({ signal }) =>
      getAllUsersByWorkspace({ signal, auth, query }),
    enabled: auth.isAuthenticated && !!workspaceId,
  });
}
