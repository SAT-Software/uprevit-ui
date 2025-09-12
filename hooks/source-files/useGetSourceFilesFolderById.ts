import { useQuery } from "@tanstack/react-query";

async function getSourceFilesFolderById(
  folderId: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/sourceFiles/folders/${folderId}`, {
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch source files folder by id");
  }
  const data = await response.json();
  return data;
}

export function useGetSourceFilesFolderById(folderId: string) {
  return useQuery({
    queryKey: ["source-files-folder", folderId],
    queryFn: ({ signal }) => getSourceFilesFolderById(folderId, { signal }),
    enabled: Boolean(folderId),
  });
}
