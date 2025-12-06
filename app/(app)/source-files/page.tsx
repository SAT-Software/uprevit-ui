"use client";

import { useAuth } from "react-oidc-context";
import { BookmarkIcon } from "lucide-react";
import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import SourceFilesFoldersCard from "@/features/workspace/source-files/SourceFilesFoldersCard";
import { useGetBookmarkedSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmarkedSourceFilesFoldersByUserId";
import { SourceFilesFolder } from "@/types/source-files";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string;
}

function SourceFilesPage() {
  const {
    data: foldersData,
    isLoading: foldersLoading,
    error: foldersError,
  } = useGetAllSourceFileFolders();

  const sourceFilesFolders = foldersData?.result ?? [];

  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const {
    data: bookmarkedData,
    isLoading: bookmarkedLoading,
    isError: bookmarkedError,
  } = useGetBookmarkedSourceFilesFoldersByUserId(userId as string);

  const bookmarkedFolders = bookmarkedData?.result.filter(
    (folder: BookmarkedSourceFilesFolder) => folder.parentId === null
  );

  if (foldersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (foldersError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-destructive">
          Failed to load source files folders. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start justify-start border border-border bg-background rounded-xl w-full h-full">
        {/* Main Header */}
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Source Files</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Manage and view all source files and folders
            </p>
          </div>
          <DialogAddProductFolder />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full ">
          {/* Bookmarked Folders Section */}
          {(bookmarkedLoading ||
            (bookmarkedFolders && bookmarkedFolders.length > 0)) && (
            <div className="flex flex-col gap-4 px-4 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Bookmarked Folders
                </h2>
              </div>
              {bookmarkedLoading ? (
                <div className="flex items-center justify-center h-[200px] gap- text-muted-foreground">
                  <div>Loading...</div>
                </div>
              ) : bookmarkedError ? (
                <div className="flex items-center justify-center h-[200px] gap-2 text-destructive">
                  <div>Failed to load bookmarked folders.</div>
                </div>
              ) : (
                <SourceFilesFoldersCard folders={bookmarkedFolders} />
              )}
            </div>
          )}

          {/* All Folders Section */}
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">
                All Folders
              </h2>
            </div>
            {sourceFilesFolders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] gap-4 text-muted-foreground">
                <BookmarkIcon className="w-16 h-16" />
                <p className="text-lg">No folders created yet.</p>
                <p className="text-sm">Create a new folder to get started.</p>
              </div>
            ) : (
              <SourceFilesFoldersCard folders={sourceFilesFolders} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SourceFilesPage;
