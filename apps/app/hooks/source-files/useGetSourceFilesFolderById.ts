import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getSourceFilesFolderById(
  folderId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(
    `/api/source-files/folder?workspaceId=${auth?.user?.profile.workspaceId}&parentId=${folderId}`,
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
    throw new Error(text || "Failed to fetch source files folder by id");
  }
  const data = await response.json();
  return data;
}

export function useGetSourceFilesFolderById(folderId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["source-files-folder", folderId],
    queryFn: ({ signal }) =>
      getSourceFilesFolderById(folderId, { signal, auth }),
    enabled: Boolean(folderId) && auth.isAuthenticated,
  });
}
