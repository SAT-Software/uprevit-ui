"use client";

import { useRouter } from "next/navigation";

import { cn } from "@uprevit/ui/lib/utils";

interface BookmarkFolderItem {
  _id: string;
  folder_name: string;
  products: string[];
}

interface BookmarkedProductsFoldersCardProps {
  folders: BookmarkFolderItem[];
}

function formatProductCount(count: number) {
  return count === 1 ? "1 Product" : `${count} Products`;
}

export function BookmarkedProductsFoldersCard({
  folders,
}: BookmarkedProductsFoldersCardProps) {
  const router = useRouter();

  if (!folders.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {folders.map((folder) => (
        <div
          key={folder._id}
          className="group relative cursor-pointer rounded-2xl"
          onClick={() => router.push(`/bookmarked-products/${folder._id}`)}
        >
          <div className="absolute inset-0 rounded-2xl bg-muted/0 transition-colors duration-200 group-hover:bg-muted/60" />

          <div className="relative flex flex-col items-center px-2 pb-4 pt-4 text-center">
            <div className="relative flex h-[78px] w-[92px] items-center justify-center">
              <img
                src="/Source-Files-Light-Folder.svg"
                alt=""
                className="h-[78px] w-[92px] select-none object-contain dark:hidden"
                draggable={false}
              />
              <img
                src="/Source-Files-Dark-Folder.svg"
                alt=""
                className="hidden h-[78px] w-[92px] select-none object-contain dark:block"
                draggable={false}
              />
            </div>

            <p className="mt-3 w-full truncate text-sm font-medium text-foreground">
              {folder.folder_name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatProductCount(folder.products.length)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookmarkedProductsFoldersGridSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col items-center px-3 pt-4">
          <div
            className={cn(
              "h-[78px] w-[92px] animate-pulse rounded-xl bg-muted",
            )}
          />
          <div className="mt-3 h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-1.5 h-3 w-14 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
