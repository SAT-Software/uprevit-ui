import { useQuery } from "@tanstack/react-query";

async function getProductsInABookmarkFolder(
  folderId: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(
    `/api/bookmarks/products/${folderId}?userId=68d2b37127794dcb43a32425`,
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
    throw new Error(text || "Failed to fetch products in a bookmark folder");
  }
  const data = await response.json();
  return data;
}

export function useGetProductsInABookmarkFolder(folderId: string) {
  return useQuery({
    queryKey: ["products-in-bookmark-folder", folderId],
    queryFn: ({ signal }) => getProductsInABookmarkFolder(folderId, { signal }),
  });
}
