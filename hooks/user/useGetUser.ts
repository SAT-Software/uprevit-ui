import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getUserById(
  id: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(`/api/users/${id}`, {
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

export function useGetUser(id: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["user", id],
    queryFn: ({ signal }) => getUserById(id, { signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
