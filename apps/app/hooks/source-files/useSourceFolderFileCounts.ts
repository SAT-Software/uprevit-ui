import { useQueries } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

import type { SourceFilesFolder } from "@/types/source-files";

async function getFolderChildrenCount({
  folderId,
  signal,
  auth,
}: {
  folderId: string;
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const workspaceId = auth?.user?.profile?.workspaceId;
  const response = await fetch(
    `/api/source-files/folder?workspaceId=${workspaceId}&parentId=${folderId}`,
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch folder file count");
  }

  const data = await response.json();
  const items = (data?.result ?? []) as SourceFilesFolder[];

  return items.filter((item) => item.type === "file").length;
}

export function useSourceFolderFileCounts(folderIds: string[]) {
  const auth = useAuth();

  const queries = useQueries({
    queries: folderIds.map((folderId) => ({
      queryKey: ["source-files-folder-file-count", folderId],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getFolderChildrenCount({ folderId, signal, auth }),
      enabled: Boolean(folderId) && auth.isAuthenticated,
      staleTime: 30_000,
    })),
  });

  const countsByFolderId = new Map<string, number>();

  folderIds.forEach((folderId, index) => {
    const count = queries[index]?.data;
    if (typeof count === "number") {
      countsByFolderId.set(folderId, count);
    }
  });

  return {
    countsByFolderId,
    isLoading: queries.some((query) => query.isLoading),
  };
}
