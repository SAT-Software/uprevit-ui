"use client";

import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";
import { BookmarkIcon } from "lucide-react";
import DialogAddProductFolder from "@/features/source-files/DialogAddProductFolder";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import SourceFilesFoldersCard from "@/features/source-files/SourceFilesFoldersCard";
import { useGetBookmakredSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmakredSourceFilesFoldersByUserId";

function SourceFilesPage() {
  const {
    data: foldersData,
    isLoading: foldersLoading,
    error: foldersError,
  } = useGetAllSourceFileFolders();

  const sourceFilesFolders = foldersData?.result ?? [];

  console.log("Source Files Folders", sourceFilesFolders);

  // const userId = "68a1cf8c2cb63e45ad511688";
  // const {
  //   data: bookmarkedData,
  //   isLoading: bookmarkedLoading,
  //   error: bookmarkedError,
  // } = useGetBookmakredSourceFilesFoldersByUserId(userId);
  // const bookmarkedFolders = bookmarkedData?.data ?? [];

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
      {/* <div className="flex flex-col gap-4">
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
        ) : bookmarkedFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-4 text-muted-foreground">
            <BookmarkIcon className="w-16 h-16" />
            <p className="text-lg">No bookmarked folders yet.</p>
            <p className="text-sm">Use the bookmark button on any folder.</p>
          </div>
        ) : (
          <SourceFilesFoldersCard folders={bookmarkedFolders} />
        )}
      </div> */}

      {/* All Folders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Folders</h2>
          <DialogAddProductFolder>
            <Button variant="default" className="flex items-center gap-2">
              <PiPlusBold />
              Add Product Folder
            </Button>
          </DialogAddProductFolder>
        </div>
        <SourceFilesFoldersCard folders={sourceFilesFolders} />
      </div>
    </div>
  );
}

export default SourceFilesPage;
