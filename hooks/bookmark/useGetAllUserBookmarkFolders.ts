import { useQuery } from "@tanstack/react-query";

async function getAllUserBookmarkFolders({ signal }: { signal: AbortSignal }) {
  const response = await fetch(
    "/api/bookmarks/products?userId=68d2b37127794dcb43a32425",
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
