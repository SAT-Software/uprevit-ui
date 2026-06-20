import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import { WorkspaceAccessFrozenError } from "@/utils/workspaceAccessErrors";

async function getUserById(
  userId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(`/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const message = await getResponseErrorMessage(response, "Failed to fetch user");
    if (
      response.status === 403 &&
      message.toLowerCase().includes("workspace access is frozen")
    ) {
      throw new WorkspaceAccessFrozenError(message);
    }
    throw new Error(message);
  }
  const data = await response.json();
  return data;
}

export function useGetUser() {
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;

  return useQuery({
    queryKey: ["user", userId],
    queryFn: ({ signal }) => getUserById(userId as string, { signal, auth }),
    enabled: auth.isAuthenticated && Boolean(userId),
    retry: (failureCount, error) =>
      !(
        error instanceof WorkspaceAccessFrozenError ||
        (error instanceof Error &&
          error.message.toLowerCase().includes("workspace access is frozen"))
      ) && failureCount < 3,
  });
}
