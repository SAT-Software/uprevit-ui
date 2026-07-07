"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import DialogCreateFolder from "@/features/workspace/bookmarks/DialogCreateFolder";
import {
  BookmarkedProductsFoldersCard,
  BookmarkedProductsFoldersGridSkeleton,
} from "@/features/workspace/bookmarks/BookmarkedProductsFoldersCard";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

interface BookmarkFolder {
  _id: string;
  folder_name: string;
  products: string[];
}

function BookmarkedProductsPage() {
  const { data, isLoading, error, refetch } = useGetAllUserBookmarkFolders();

  const allBookmarkFolders = data?.result?.bookmarked_product_folders ?? [];
  const showInitialLoadingState = isLoading && !data;
  const showErrorState = Boolean(error) && !data;
  const hasFolders = allBookmarkFolders.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Bookmarked Products</p>
          <InfoTooltip content="Personal folders of bookmarked products for quick access to in-progress labeling work." />
        </div>

        <div className="flex items-center gap-2">
          {showInitialLoadingState ? (
            <Skeleton className="h-7 w-28 rounded-md" />
          ) : (
            <DialogCreateFolder />
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {showInitialLoadingState ? (
          <BookmarkedProductsFoldersGridSkeleton />
        ) : showErrorState ? (
          <>
            <DashboardErrorState
              variant="panel"
              icon={FolderAddIcon}
              title="Failed to load bookmark folders"
              description="Something went wrong while fetching your folders. Please try again."
              className="min-h-[320px]"
            />
            <div className="mt-3 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          </>
        ) : !hasFolders ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
              <Icon
                icon={FolderAddIcon}
                size={28}
                strokeWidth={1.75}
                className="text-muted-foreground/70"
              />
            </div>
            <div>
              <p className="text-sm font-medium">No bookmark folders yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a folder to start saving products for quick access.
              </p>
            </div>
            <div className="pt-1">
              <DialogCreateFolder />
            </div>
          </div>
        ) : (
          <BookmarkedProductsFoldersCard
            folders={allBookmarkFolders as BookmarkFolder[]}
          />
        )}
      </div>
    </div>
  );
}

export default BookmarkedProductsPage;
