import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getCurrentSourceFilesFolder(
  folderId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  console.log("Folder id in hook", folderId);
  const response = await fetch(
    `/api/source-files/current-folder?workspaceId=${auth?.user?.profile.workspaceId}&id=${folderId}`,
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

export function useGetCurrentSourceFilesFolder(folderId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["current-source-files-folder", folderId],
    queryFn: ({ signal }) =>
      getCurrentSourceFilesFolder(folderId, { signal, auth }),
    enabled: Boolean(folderId) && auth.isAuthenticated,
  });
}
