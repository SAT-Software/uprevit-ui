import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllUsersByWorkspace(
  workspaceId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(
    `/api/users/workspace?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch users");
  }
  const data = await response.json();
  return data;
}

export function useGetAllUsersByWorkspace() {
  const auth = useAuth();
  const workspaceId = auth.user?.profile.workspaceId;

  return useQuery({
    queryKey: ["users", workspaceId],
    queryFn: ({ signal }) =>
      getAllUsersByWorkspace(workspaceId as string, { signal, auth }),
    enabled: auth.isAuthenticated && !!workspaceId,
  });
}
