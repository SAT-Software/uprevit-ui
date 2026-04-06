import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

type BookmarkFoldersResponse = {
  result: {
    bookmarked_product_folders: {
      _id: string;
      folder_name: string;
      products: string[];
    }[];
  };
};

const EMPTY_BOOKMARK_FOLDERS_RESPONSE: BookmarkFoldersResponse = {
  result: {
    bookmarked_product_folders: [],
  },
};

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
  if (response.status === 404) {
    return EMPTY_BOOKMARK_FOLDERS_RESPONSE;
  }
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch user bookmark folders");
  }
  const data = (await response.json().catch(() => null)) as
    | Partial<BookmarkFoldersResponse>
    | null;

  return {
    ...EMPTY_BOOKMARK_FOLDERS_RESPONSE,
    ...data,
    result: {
      ...EMPTY_BOOKMARK_FOLDERS_RESPONSE.result,
      ...(data?.result ?? {}),
      bookmarked_product_folders: Array.isArray(
        data?.result?.bookmarked_product_folders
      )
        ? data.result.bookmarked_product_folders
        : [],
    },
  };
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
