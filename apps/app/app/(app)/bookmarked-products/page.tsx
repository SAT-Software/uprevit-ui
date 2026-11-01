"use client";

import { cn } from "@uprevit/ui/lib/utils";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import DialogCreateFolder from "@/features/workspace/bookmarks/DialogCreateFolder";
import { BookmarkedProductsFoldersCard } from "@/features/workspace/bookmarks/BookmarkedProductsFoldersCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { FolderGridSkeleton } from "@/components/common/FolderGridSkeleton";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

interface BookmarkFolder {
  _id: string;
  folder_name: string;
  products: string[];
}

function BookmarkedProductsPage() {
  const { data, isPending, error, refetch } = useGetAllUserBookmarkFolders();

  const allBookmarkFolders = data?.result?.bookmarked_product_folders ?? [];
  const showInitialLoadingState = isPending;
  const showErrorState = Boolean(error) && !data;
  const hasFolders = allBookmarkFolders.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
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

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          (showInitialLoadingState || hasFolders) && "p-4",
        )}
      >
        {showInitialLoadingState ? (
          <FolderGridSkeleton />
        ) : showErrorState ? (
          <ErrorState
            variant="panel"
            icon={Folder01Icon}
            title="Failed to load bookmark folders"
            onRetry={() => refetch()}
            fill
          />
        ) : !hasFolders ? (
          <EmptyState
            icon={Folder01Icon}
            title="No bookmark folders yet"
            description="Create a folder to start saving products for quick access"
            action={<DialogCreateFolder />}
            fill
          />
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
