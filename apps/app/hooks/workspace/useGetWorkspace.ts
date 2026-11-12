import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";

async function getWorkspaceById(
  id: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(`/api/workspace/${id}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    throw await getResponseError(response, "Failed to fetch workspace");
  }
  const data = await response.json();
  return data;
}

export function useGetWorkspace() {
  const auth = useAuth();
  const workspaceId = auth.user?.profile.workspaceId;

  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: ({ signal }) =>
      getWorkspaceById(workspaceId as string, { signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
