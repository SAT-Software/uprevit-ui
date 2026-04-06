import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

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
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch user");
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
  });
}
