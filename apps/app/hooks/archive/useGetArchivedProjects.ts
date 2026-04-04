import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getArchivedProjects({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const response = await fetch(
    `/api/projects?workspaceId=${auth?.user?.profile?.workspaceId}&isArchive=true`,
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

export function useGetArchivedProjects() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["archived-projects"],
    queryFn: ({ signal }) => getArchivedProjects({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
