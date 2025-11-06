import { useQuery } from "@tanstack/react-query";

async function getCurrentSourceFilesFolder(
  folderId: string,
  { signal }: { signal: AbortSignal }
) {
  console.log("Folder id in hook", folderId);
  const response = await fetch(
    `/api/source-files/current-folder?workspaceId=68d2be511ad93c69d6e39e51&id=${folderId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
        "Content-Type": "application/json", // Example of another header
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
  return useQuery({
    queryKey: ["current-source-files-folder", folderId],
    queryFn: ({ signal }) => getCurrentSourceFilesFolder(folderId, { signal }),
    enabled: Boolean(folderId),
  });
}
