import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllUserBookmarkFolders({
  signal,
  auth,
  userId,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  userId: string;
}) {
  const response = await fetch(`/api/bookmarks/products?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch user bookmark folders");
  }
  const data = await response.json();
  return data;
}

export function useGetAllUserBookmarkFolders() {
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId as string;

  return useQuery({
    queryKey: ["all-user-bookmark-folders", userId],
    queryFn: ({ signal }) =>
      getAllUserBookmarkFolders({ signal, auth, userId }),
    enabled: auth.isAuthenticated && !!userId,
  });
}
