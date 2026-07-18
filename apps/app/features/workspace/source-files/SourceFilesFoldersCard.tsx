"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    return "— Files";
  }

  return count === 1 ? "1 File" : `${count} Files`;
}

function SourceFilesFoldersCard({
  folders,
  variant = "default",
  showAsBookmarked = false,
  bookmarkedFolderIds,
}: SourceFilesFoldersCardProps) {
  const router = useRouter();
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
          <div
            key={folder._id}
            className="group relative cursor-pointer rounded-2xl"
            onClick={() => router.push(`/source-files/view/${folder._id}`)}
          >
            <div className="absolute inset-0 rounded-2xl bg-muted/0 transition-colors duration-200 group-hover:bg-muted/60" />

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-1 top-1 z-10 h-7 w-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                isBookmarked
                  ? "text-ring hover:text-ring/80 dark:text-ring"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Toggle bookmark folder"
              onClick={(e) => {
                e.stopPropagation();
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
              ) : isBookmarked ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Icon icon={BookmarkMinus01Icon} />
                  </TooltipTrigger>
                  <TooltipContent>Remove from bookmarks</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <Icon icon={BookmarkAdd01Icon} />
                  </TooltipTrigger>
                  <TooltipContent>Add to bookmarks</TooltipContent>
                </Tooltip>
              )}
            </Button>

            <div
              className={cn(
                "relative flex flex-col items-center text-center",
                isLarge ? "px-2 pb-4 pt-4" : "px-2 pb-3 pt-3",
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center",
                  isLarge ? "h-[78px] w-[92px]" : "h-14 w-16",
                )}
              >
                <img
                  src="/Source-Files-Light-Folder.svg"
                  alt=""
                  className={cn(
                    "select-none object-contain dark:hidden",
                    isLarge ? "h-[78px] w-[92px]" : "h-14 w-16",
                  )}
                  draggable={false}
                />
                <img
                  src="/Source-Files-Dark-Folder.svg"
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SourceFilesFoldersCard;
