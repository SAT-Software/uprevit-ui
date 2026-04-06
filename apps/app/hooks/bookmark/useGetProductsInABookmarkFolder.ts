import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

async function getProductsInABookmarkFolder(
  folderId: string,
  userId: string,
  { signal, accessToken }: { signal: AbortSignal; accessToken: string }
) {
  const response = await fetch(
    `/api/bookmarks/products/${folderId}?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
  const auth = useAuth();
  const accessToken = auth.user?.access_token;
  const userId = auth?.user?.profile?.userId as string;

  return useQuery({
    queryKey: ["products-in-bookmark-folder", folderId, userId],
    queryFn: ({ signal }) =>
      getProductsInABookmarkFolder(folderId, userId, {
        signal,
        accessToken: accessToken as string,
      }),
    enabled: Boolean(folderId) && Boolean(accessToken) && Boolean(userId),
  });
}
