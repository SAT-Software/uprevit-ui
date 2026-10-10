"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

import { useToggleBookmarkSourceFilesFolder } from "@/hooks/source-files/useToggleBookmarkSourceFilesFolder";
import { SourceFilesFolder } from "@/types/source-files";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { cn } from "@uprevit/ui/lib/utils";
import {
  BookmarkAdd01Icon,
  BookmarkMinus01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

interface SourceFilesFoldersCardProps {
  folders: SourceFilesFolder[];
  variant?: "default" | "large";
  showAsBookmarked?: boolean;
  bookmarkedFolderIds?: Set<string>;
}

function formatFileCount(count: number | undefined) {
  if (typeof count !== "number") {
    return "— files";
  }

  return count === 1 ? "1 file" : `${count} files`;
}

function SourceFilesFoldersCard({
  folders,
  variant = "default",
  showAsBookmarked = false,
  bookmarkedFolderIds,
}: SourceFilesFoldersCardProps) {
  const { mutate: toggleBookmark } = useToggleBookmarkSourceFilesFolder();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const [pendingFolderId, setPendingFolderId] = useState<string | null>(null);

  const isLarge = variant === "large";

  if (!folders?.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-10 text-muted-foreground">
        <p className="text-sm">No folders to display.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full",
        isLarge
          ? "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          : "grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {folders.map((folder) => {
        const isBookmarked =
          showAsBookmarked || bookmarkedFolderIds?.has(folder._id) === true;

        return (
          <div key={folder._id} className="group relative rounded-2xl">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1 z-10 h-7 w-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100",
                    isBookmarked
                      ? "text-ring hover:text-ring/80 dark:text-ring"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={
                    isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                  }
                  onClick={() => {
                    if (userId) {
                      setPendingFolderId(folder._id);
                      toggleBookmark(
                        { folderId: folder._id, userId: userId as string },
                        { onSettled: () => setPendingFolderId(null) },
                      );
                    } else {
                      toast.error("User ID not available. Please log in again.");
                    }
                  }}
                  disabled={pendingFolderId === folder._id}
                >
                  {pendingFolderId === folder._id ? (
                    <Spinner />
                  ) : (
                    <Icon
                      icon={
                        isBookmarked ? BookmarkMinus01Icon : BookmarkAdd01Icon
                      }
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
              </TooltipContent>
            </Tooltip>

            <Link
              href={`/source-files/view/${folder._id}`}
              className={cn(
                "relative flex flex-col items-center rounded-2xl text-center transition-colors duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isLarge ? "px-2 pb-4 pt-4" : "px-2 pb-3 pt-3",
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center",
                  isLarge ? "h-[78px] w-[92px]" : "h-14 w-16",
                )}
              >
                <Image
                  src="/Source-Files-Light-Folder.svg"
                  width={92}
                  height={78}
                  alt=""
                  className={cn(
                    "select-none object-contain dark:hidden",
                    isLarge ? "h-[78px] w-[92px]" : "h-14 w-16",
                  )}
                  draggable={false}
                />
                <Image
                  src="/Source-Files-Dark-Folder.svg"
                  width={92}
                  height={78}
                  alt=""
                  className={cn(
                    "hidden select-none object-contain dark:block",
                    isLarge ? "h-[78px] w-[92px]" : "h-14 w-16",
                  )}
                  draggable={false}
                />
              </div>

              <p
                className={cn(
                  "mt-3 w-full truncate font-medium text-foreground",
                  isLarge ? "text-sm" : "text-xs",
                )}
                title={folder.name}
              >
                {folder.name}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-muted-foreground",
                  isLarge ? "text-xs" : "text-[11px]",
                )}
              >
                {formatFileCount(folder.fileCount)}
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default SourceFilesFoldersCard;
