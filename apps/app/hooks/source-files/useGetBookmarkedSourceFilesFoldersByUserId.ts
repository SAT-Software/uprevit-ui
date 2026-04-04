import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getBookmarkedSourceFilesFoldersByUserId(
  userId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(`/api/bookmarks/source-files?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
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
  const auth = useAuth();

  return useQuery({
    queryKey: ["bookmarked-source-files-folders", userId],
    queryFn: ({ signal }) =>
      getBookmarkedSourceFilesFoldersByUserId(userId, { signal, auth }),
    enabled: Boolean(userId) && auth.isAuthenticated,
  });
}
