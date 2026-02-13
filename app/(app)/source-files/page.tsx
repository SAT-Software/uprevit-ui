"use client";

import { useAuth } from "react-oidc-context";
import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import SourceFilesFoldersCard from "@/features/workspace/source-files/SourceFilesFoldersCard";
import { useGetBookmarkedSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmarkedSourceFilesFoldersByUserId";
import { SourceFilesFolder } from "@/types/source-files";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PiBookmarkSimpleDuotone,
  PiFolderSimpleDuotone,
  PiWarningCircleDuotone,
  PiClockCounterClockwiseDuotone,
} from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { ActivityLogsPanel } from "@/features/workspace/logs/ActivityLogsPanel";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string;
}

function FolderLoadingCard() {
  return (
    <div className="relative flex flex-col w-full max-w-xs rounded-2xl">
      <Card className="shadow-none border-border w-full">
        <CardContent className="p-4 flex flex-row items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center animate-pulse">
            <PiFolderSimpleDuotone className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FolderErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[200px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
        <PiWarningCircleDuotone className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-destructive">
          Failed to load source files folders
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
        Try Again
      </Button>
    </div>
  );
}

function SourceFilesPage() {
  const [showLogs, setShowLogs] = useState(false);
  const {
    data: foldersData,
    isLoading: foldersLoading,
    error: foldersError,
    refetch: refetchFolders,
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

  const workspaceId = auth?.user?.profile?.workspaceId as string | undefined;

  if (foldersLoading) {
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
            <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
          </div>

          {/* All Folders Section */}
          <div className="flex flex-col gap-4 p-4 w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">
                All Folders
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-max">
              {[...Array(5)].map((_, index) => (
                <FolderLoadingCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (foldersError) {
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

          {/* Error State */}
          <div className="flex flex-col gap-4 p-4 w-full">
            <FolderErrorState onRetry={() => refetchFolders()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start justify-start border border-border bg-background rounded-xl w-full h-full overflow-hidden">
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Source Files</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Manage and view all source files and folders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={showLogs ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setShowLogs((current) => !current)}
                  aria-label={showLogs ? "Show folders" : "Show source file logs"}
                >
                  <PiClockCounterClockwiseDuotone className="h-4 w-4" />
                  Logs
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showLogs ? "Show Folders" : "Show Logs"}</TooltipContent>
            </Tooltip>
            <DialogAddProductFolder />
          </div>
        </div>

        {showLogs ? (
          <div className="w-full h-full px-4 pb-4 pt-4 border-t border-border">
            <ActivityLogsPanel
              scopeType="source-files"
              scopeId={workspaceId}
              title="Source Files Logs"
              description="Track source file and folder actions across the workspace."
              showHeader={false}
            />
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {(bookmarkedLoading ||
              (bookmarkedFolders && bookmarkedFolders.length > 0)) && (
              <div className="flex flex-col gap-4 px-4 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-muted-foreground">
                    Bookmarked Folders
                  </h2>
                </div>
                {bookmarkedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-max">
                    {[...Array(3)].map((_, index) => (
                      <FolderLoadingCard key={index} />
                    ))}
                  </div>
                ) : bookmarkedError ? (
                  <div className="flex items-center justify-center h-[100px] gap-2">
                    <PiWarningCircleDuotone className="w-5 h-5 text-destructive" />
                    <p className="text-sm text-destructive">
                      Failed to load bookmarked folders.
                    </p>
                  </div>
                ) : (
                  <SourceFilesFoldersCard folders={bookmarkedFolders} />
                )}
              </div>
            )}

            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  All Folders
                </h2>
              </div>
              {sourceFilesFolders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] gap-4 text-muted-foreground">
                  <PiBookmarkSimpleDuotone className="w-16 h-16" />
                  <p className="text-lg">No folders created yet.</p>
                  <p className="text-sm">Create a new folder to get started.</p>
                </div>
              ) : (
                <SourceFilesFoldersCard folders={sourceFilesFolders} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SourceFilesPage;
