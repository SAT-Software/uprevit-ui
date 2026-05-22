import { useQuery } from "@tanstack/react-query";
import {
  buildListSearchParams,
  ListQueryParams,
} from "@/lib/workspace-list-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getArchivedProjects({
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
  params.set("isArchive", "true");

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
    throw new Error(text || "Failed to fetch archived projects");
  }
  const data = await response.json();
  return data;
}

export function useGetArchivedProjects(query?: ListQueryParams) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["archived-projects", auth.user?.profile?.workspaceId, query],
    queryFn: ({ signal }) => getArchivedProjects({ signal, auth, query }),
    enabled: auth.isAuthenticated,
  });
}
