import { useEffect, useMemo } from "react";

import type { SourceFilesFolder } from "@/types/source-files";

import { useGetSourceFileFoldersInfinite } from "./useGetSourceFileFoldersInfinite";

const PRODUCT_LINKED_FOLDERS_PAGE_SIZE = 100;

export function useGetProductLinkedSourceFileFolders(
  productId: string | undefined,
  enabled = true,
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
  } = useGetSourceFileFoldersInfinite({
    productId,
    limit: PRODUCT_LINKED_FOLDERS_PAGE_SIZE,
    enabled: enabled && !!productId,
  });

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetching &&
      !isPending
    ) {
      void fetchNextPage();
    }
  }, [
    data?.pages.length,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
  ]);

  const folders = useMemo<SourceFilesFolder[]>(
    () => data?.pages.flatMap((page) => page.result?.folders ?? []) ?? [],
    [data],
  );

  const isLoadingAllPages =
    isPending ||
    isFetching ||
    hasNextPage ||
    isFetchingNextPage;

  return {
    folders,
    isLoading: isLoadingAllPages,
    isError,
  };
}
