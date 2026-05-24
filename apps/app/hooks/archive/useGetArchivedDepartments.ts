import { useQuery } from "@tanstack/react-query";
import {
  buildListSearchParams,
  ListQueryParams,
} from "@/lib/workspace-list-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getArchivedDepartments({
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
    `/api/departments?${params.toString()}`,
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
    throw new Error(text || "Failed to fetch archived departments");
  }
  const data = await response.json();
  return data;
}

export function useGetArchivedDepartments(query?: ListQueryParams) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["archived-departments", auth.user?.profile?.workspaceId, query],
    queryFn: ({ signal }) => getArchivedDepartments({ signal, auth, query }),
    enabled: auth.isAuthenticated,
  });
}
