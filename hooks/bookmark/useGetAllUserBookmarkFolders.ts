import { useQuery } from "@tanstack/react-query";

async function getAllUserBookmarkFolders({ signal }: { signal: AbortSignal }) {
  const response = await fetch(
    "/api/bookmarks/products?userId=68a1cf8c2cb63e45ad511688",
    { signal }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch user bookmark folders");
  }
  const data = await response.json();
  return data;
}

export function useGetAllUserBookmarkFolders() {
  return useQuery({
    queryKey: ["all-user-bookmark-folders"],
    queryFn: ({ signal }) => getAllUserBookmarkFolders({ signal }),
  });
}
