"use client";

import { BookmarkIcon } from "lucide-react";
import DialogAddProductFolder from "@/features/source-files/DialogAddProductFolder";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import SourceFilesFoldersCard from "@/features/source-files/SourceFilesFoldersCard";
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

  const userId = "68d2b37127794dcb43a32425";
  const {
    data: bookmarkedData,
    isLoading: bookmarkedLoading,
    isError: bookmarkedError,
  } = useGetBookmarkedSourceFilesFoldersByUserId(userId);

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
        <div className="text-red-500">
          Failed to load source files folders. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 h-full">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Source Files</h1>
      </div>

      {/* Bookmarked Folders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bookmarked Folders</h2>
        </div>
        {bookmarkedLoading ? (
          <div className="flex items-center justify-center h-[200px] gap-4 text-muted-foreground">
            <div>Loading...</div>
          </div>
        ) : bookmarkedError ? (
          <div className="flex items-center justify-center h-[200px] gap-4 text-red-500">
            <div>Failed to load bookmarked folders.</div>
          </div>
        ) : bookmarkedFolders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-4 text-muted-foreground">
            <BookmarkIcon className="w-16 h-16" />
            <p className="text-lg">No bookmarked folders yet.</p>
            <p className="text-sm">Use the bookmark button on any folder.</p>
          </div>
        ) : (
          <SourceFilesFoldersCard folders={bookmarkedFolders} />
        )}
      </div>

      {/* All Folders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Folders</h2>
          <DialogAddProductFolder />
        </div>
        <SourceFilesFoldersCard folders={sourceFilesFolders} />
      </div>
    </div>
  );
}

export default SourceFilesPage;
