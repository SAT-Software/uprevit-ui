import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllUserBookmarkFolders({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const response = await fetch(
    "/api/bookmarks/products?userId=68d2b37127794dcb43a32425",
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
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
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-user-bookmark-folders"],
    queryFn: ({ signal }) => getAllUserBookmarkFolders({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
