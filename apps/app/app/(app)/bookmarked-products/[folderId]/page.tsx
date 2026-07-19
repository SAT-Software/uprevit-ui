"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import DialogAddProductsToFolder from "@/features/workspace/bookmarks/DialogAddProductsToFolder";
import DialogEditBookmarkFolder from "@/features/workspace/bookmarks/DialogEditBookmarkFolder";
import DialogDeleteBookmarkFolder from "@/features/workspace/bookmarks/DialogDeleteBookmarkFolder";
import {
  BookmarkedProductListItem,
  BookmarkedProductListSkeleton,
  type BookmarkedProduct,
} from "@/features/workspace/bookmarks/BookmarkedProductListItem";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { useGetProductsInABookmarkFolder } from "@/hooks/bookmark/useGetProductsInABookmarkFolder";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { FolderAddIcon, PackageIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
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
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId as string;

  const { data: foldersData } = useGetAllUserBookmarkFolders();
  const bookmarkFolderName =
    foldersData?.result?.bookmarked_product_folders?.find(
      (folder) => folder._id === folderId,
    )?.folder_name ?? "";

  const {
    data: folderData,
    isLoading,
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

  if (error) {
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
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <DashboardErrorState
            variant="panel"
            icon={FolderAddIcon}
            title="Failed to load bookmarked products"
            description={error.message}
            className="min-h-[320px]"
          />
          <div className="mt-3 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/bookmarked-products")}
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex min-w-0 items-center gap-2">
          <FolderTitleIcon className="shrink-0" />
          <p className="truncate text-sm font-medium">
            {bookmarkFolderName || "Folder"}
          </p>
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

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
              <Icon
                icon={PackageIcon}
                size={28}
                strokeWidth={1.75}
                className="text-muted-foreground/70"
              />
            </div>
            <div>
              <p className="text-sm font-medium">No products in this folder</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add products to organize your bookmark collection.
              </p>
            </div>
            <div className="pt-1">
              <DialogAddProductsToFolder
                folderName={bookmarkFolderName}
                folderId={folderId}
              />
            </div>
          </div>
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
