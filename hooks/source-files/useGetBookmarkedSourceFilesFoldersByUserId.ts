import { useQuery } from "@tanstack/react-query";

async function getBookmarkedSourceFilesFoldersByUserId(
  userId: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/bookmarks/source-files?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || "Failed to fetch bookmarked source files folders by user"
    );
  }
  const data = await response.json();
  return data;
}

export function useGetBookmarkedSourceFilesFoldersByUserId(userId: string) {
  return useQuery({
    queryKey: ["bookmarked-source-files-folders", userId],
    queryFn: ({ signal }) =>
      getBookmarkedSourceFilesFoldersByUserId(userId, { signal }),
    enabled: Boolean(userId),
  });
}
