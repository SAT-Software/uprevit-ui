"use client";

import { EmptyState } from "@/components/common/EmptyState";
import Image from "next/image";
import { useParams } from "next/navigation";

import DialogAddProductsToFolder from "@/features/workspace/bookmarks/DialogAddProductsToFolder";
import DialogEditBookmarkFolder from "@/features/workspace/bookmarks/DialogEditBookmarkFolder";
import DialogDeleteBookmarkFolder from "@/features/workspace/bookmarks/DialogDeleteBookmarkFolder";
import {
  BookmarkedProductListItem,
  BookmarkedProductListSkeleton,
  type BookmarkedProduct,
} from "@/features/workspace/bookmarks/BookmarkedProductListItem";
import { ErrorState } from "@/components/common/ErrorState";
import { useGetProductsInABookmarkFolder } from "@/hooks/bookmark/useGetProductsInABookmarkFolder";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { PackageIcon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";

function FolderTitleIcon({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/Source-Files-Light-Folder.svg"
        alt=""
        width={24}
        height={20}
        className={cn("select-none object-contain dark:hidden", className)}
        draggable={false}
      />
      <Image
        src="/Source-Files-Dark-Folder.svg"
        alt=""
        width={24}
        height={20}
        className={cn(
          "hidden select-none object-contain dark:block",
          className,
        )}
        draggable={false}
      />
    </>
  );
}

export default function FolderPage() {
  const params = useParams();
  const folderId = params.folderId as string;

  const { data: foldersData } = useGetAllUserBookmarkFolders();
  const bookmarkFolderName =
    foldersData?.result?.bookmarked_product_folders?.find(
      (folder) => folder._id === folderId,
    )?.folder_name ?? "";

  const {
    data: folderData,
    isPending: isLoading,
    error,
    refetch,
  } = useGetProductsInABookmarkFolder(folderId);

  const products = (folderData?.products ?? []) as BookmarkedProduct[];

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="h-5 w-6 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <BookmarkedProductListSkeleton />
        </div>
      </div>
    );
  }

  if (error && !folderData) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <div className="flex min-w-0 items-center gap-2">
            <FolderTitleIcon className="shrink-0" />
            <p className="truncate text-sm font-medium text-muted-foreground">
              Folder
            </p>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <ErrorState
            variant="panel"
            icon={PackageIcon}
            title="Failed to load bookmarked products"
            onRetry={() => refetch()}
            fill
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex min-w-0 items-center gap-2">
          <FolderTitleIcon className="shrink-0" />
          <h1 className="truncate text-sm font-medium">
            {bookmarkFolderName || "Folder"}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DialogEditBookmarkFolder
            folderId={folderId}
            currentFolderName={bookmarkFolderName}
          />
          <DialogDeleteBookmarkFolder
            folderId={folderId}
            folderName={bookmarkFolderName}
          />
          <DialogAddProductsToFolder
            folderName={bookmarkFolderName}
            folderId={folderId}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          products.length > 0 && "p-2",
        )}
      >
        {products.length === 0 ? (
          <EmptyState
            fill
            icon={PackageIcon}
            title="No products in this folder"
            description="Add products to organize your bookmark collection"
            action={
              <DialogAddProductsToFolder
                folderName={bookmarkFolderName}
                folderId={folderId}
              />
            }
          />
        ) : (
          <div className="flex w-full flex-col gap-2">
            {products.map((product) => (
              <BookmarkedProductListItem
                key={product._id}
                product={product}
                folderId={folderId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
