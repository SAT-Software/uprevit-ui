import { useQuery } from "@tanstack/react-query";

async function getBookmakredSourceFilesFoldersByUserId(
  userId: string,
  { signal }: { signal: AbortSignal }
) {
  console.log("User ID", userId);
  const response = await fetch(
    `/api/bookmarks/sourceFiles?userId=68a1cf8c2cb63e45ad511688`,
    { signal }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || "Failed to fetch bookmarked source files folders by user"
    );
  }
  const data = await response.json();
  return data;
}

export function useGetBookmakredSourceFilesFoldersByUserId(userId: string) {
  return useQuery({
    queryKey: ["bookmarked-source-files-folders", userId],
    queryFn: ({ signal }) =>
      getBookmakredSourceFilesFoldersByUserId(userId, { signal }),
    enabled: Boolean(userId),
  });
}
