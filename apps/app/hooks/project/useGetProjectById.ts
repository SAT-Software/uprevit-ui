import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getProjectById(
  id: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(`/api/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch project");
  }
  const data = await response.json();
  return data;
}

export function useGetProjectById(id: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["project", id],
    queryFn: ({ signal }) => getProjectById(id, { signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
