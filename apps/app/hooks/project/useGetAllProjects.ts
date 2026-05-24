import { useQuery } from "@tanstack/react-query";
import {
  buildListSearchParams,
  ListQueryParams,
} from "@/lib/workspace-list-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

export async function getAllProjects({
  signal,
  auth,
  query,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  query?: ListQueryParams;
}) {
  const params = buildListSearchParams(
    auth.user?.profile?.workspaceId as string | undefined,
    query,
  );

  const response = await fetch(
    `/api/projects?${params.toString()}`,
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
    throw new Error(text || "Failed to fetch projects");
  }
  const data = await response.json();
  return data;
}

export function useGetAllProjects(query?: ListQueryParams) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-projects", auth.user?.profile?.workspaceId, query],
    queryFn: ({ signal }) => getAllProjects({ signal, auth, query }),
    enabled: auth.isAuthenticated,
  });
}
