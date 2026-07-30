import { useMemo } from "react";

import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { buildBookmarkedProductIndex } from "@/utils/bookmarkProductIds";

export function useBookmarkedProductIds() {
  const { data, isLoading, isError } = useGetAllUserBookmarkFolders();

  return useMemo(() => {
    const folders = data?.result?.bookmarked_product_folders ?? [];
    const { bookmarkedProductIds, productFolderIds } =
      buildBookmarkedProductIndex(folders);

    return {
      bookmarkedProductIds,
      productFolderIds,
      isLoading,
      isError,
    };
  }, [data, isLoading, isError]);
}
