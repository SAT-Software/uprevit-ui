"use client";

import { useAuth } from "react-oidc-context";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import DialogDeleteSourceFilesFolder from "@/features/workspace/source-files/DialogDeleteSourceFilesFolder";
import DialogEditSourceFilesFolder from "@/features/workspace/source-files/DialogEditSourceFilesFolder";
import DialogUploadSourceFiles from "@/features/workspace/source-files/DialogUploadSourceFiles";
import SourceFilesFoldersCard from "@/features/workspace/source-files/SourceFilesFoldersCard";
import { useDeleteSourceFiles } from "@/hooks/source-files/useDeleteSourceFiles";
import { useGetBookmarkedSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmarkedSourceFilesFoldersByUserId";
import { useGetCurrentSourceFilesFolder } from "@/hooks/source-files/useGetCurrentSourceFilesFolder";
import { useGetSourceFilesFolderById } from "@/hooks/source-files/useGetSourceFilesFolderById";
import { useToggleBookmarkSourceFilesFolder } from "@/hooks/source-files/useToggleBookmarkSourceFilesFolder";
import { cn } from "@/lib/utils";
import type { SourceFilesFolder } from "@/types/source-files";
import { BookmarkIcon, FolderIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  PiBookmarkSimpleDuotone,
  PiFileDocDuotone,
  PiFileDuotone,
  PiFilePdfDuotone,
  PiImageDuotone,
  PiTrashDuotone,
  PiWarningDuotone,
} from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string;
}

type FileKind = "image" | "pdf" | "word" | "docx" | "doc" | "other";

function getFileKind(fileNameOrUrl: string): FileKind {
  const name = (fileNameOrUrl || "").toLowerCase();
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".gif") ||
    name.endsWith(".bmp") ||
    name.endsWith(".tif") ||
    name.endsWith(".tiff")
  ) {
    return "image";
  }
  if (name.endsWith(".pdf") || name.includes("application/pdf")) return "pdf";
  if (
    name.endsWith(".doc") ||
    name.endsWith(".docx") ||
    name.includes("application/msword") ||
    name.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  ) {
    return "word";
  }

  return "other";
}

export default function ProductSourceFilesPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const deleteSourceFile = useDeleteSourceFiles(slug);
  const router = useRouter();
  const [fileIdToDelete, setFileIdToDelete] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetSourceFilesFolderById(
    slug ?? ""
  );
  const { data: currentFolderData } = useGetCurrentSourceFilesFolder(slug);
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;

  const {
    data: bookmarkedData,
    isLoading: bookmarkedLoading,
    isError: bookmarkedError,
  } = useGetBookmarkedSourceFilesFoldersByUserId(userId as string);

  const bookmarkedFolders = bookmarkedData?.result.filter(
    (folder: BookmarkedSourceFilesFolder) => folder.parentId === slug[0]
  );

  const { mutate: toggleBookmark, isPending } =
    useToggleBookmarkSourceFilesFolder();

  const folder = data?.result;
  const currentFolder = currentFolderData?.result;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
          {/* Header Skeleton */}
          <div className="flex flex-wrap gap-2 items-center w-full justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-9" />
              <Skeleton className="w-24 h-9" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="w-full flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-4">
              <Skeleton className="w-20 h-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col w-full max-w-xs rounded-2xl"
                  >
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Skeleton className="w-16 h-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="aspect-4/3 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col items-center justify-center gap-4 border border-border bg-background rounded-xl p-4 w-full h-full text-muted-foreground">
          <div className="p-4 bg-destructive/10 rounded-full">
            <PiWarningDuotone className="w-12 h-12 text-destructive" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Failed to load folder
            </h2>
            <p>
              Something went wrong while fetching your source files. Please try
              again.
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start justify-start border border-border bg-background rounded-xl w-full h-full">
        {/* Header Section */}
        <div className="flex flex-wrap gap-2 items-center w-full justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
              <FolderIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <h1 className="text-base font-semibold">{currentFolder?.name}</h1>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex gap-1 ml-1 cursor-pointer"
            >
              <DialogEditSourceFilesFolder
                currentFolder={currentFolder}
                folderId={slug}
              />
              <DialogDeleteSourceFilesFolder
                id={currentFolder?._id}
                folderName={currentFolder?.name}
                folderId={slug}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DialogAddProductFolder
              parentId={currentFolder?._id}
              folderId={slug}
            />
            <DialogUploadSourceFiles
              folder={folder}
              currentFolder={currentFolder}
              folderId={slug}
            />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {/* Bookmarked Folders Section */}
          {(bookmarkedLoading ||
            (bookmarkedFolders && bookmarkedFolders.length > 0)) && (
            <div className="flex flex-col gap-4 px-4 pb-4 border-b border-border w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Bookmarked Folders
                </h2>
              </div>
              {bookmarkedLoading ? (
                <div className="flex items-center justify-center h-[200px] gap-4 text-muted-foreground">
                  <div>Loading...</div>
                </div>
              ) : bookmarkedError ? (
                <div className="flex items-center justify-center h-[200px] gap-4 text-destructive">
                  <div>Failed to load bookmarked folders.</div>
                </div>
              ) : (
                <SourceFilesFoldersCard folders={bookmarkedFolders} />
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col gap-6 p-4 w-full h-full">
            {folder?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <FolderIcon className="w-16 h-16" />
                  <p className="text-lg">No source files uploaded yet</p>
                  <p className="text-sm">
                    Upload your first source file to get started
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "flex flex-col gap-4",
                    folder?.some(
                      (f: SourceFilesFolder) => f.type === "folder"
                    ) && "mb-0"
                  )}
                >
                  {folder?.some(
                    (f: SourceFilesFolder) => f.type === "folder"
                  ) && (
                    <h2 className="text-sm font-semibold text-muted-foreground">
                      Folders
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {folder?.map((folder: SourceFilesFolder) => {
                      if (folder.type === "folder")
                        return (
                          <div
                            key={folder._id}
                            className="relative flex flex-col w-full max-w-xs rounded-2xl"
                          >
                            <div className="absolute top-2 right-2 flex gap-2 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Toggle bookmark folder"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (userId) {
                                    toggleBookmark({
                                      folderId: folder._id,
                                      userId: userId as string,
                                    });
                                  } else {
                                    toast.error(
                                      "User ID not available. Please log in again."
                                    );
                                  }
                                }}
                                disabled={isPending}
                                title="Bookmark folder"
                                className="h-8 w-8 hover:bg-background/80"
                              >
                                <PiBookmarkSimpleDuotone className="h-4 w-4" />
                              </Button>
                            </div>
                            <Card
                              className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors w-full border-border"
                              onClick={() =>
                                router.push(`/source-files/view/${folder._id}`)
                              }
                            >
                              <CardContent className="p-4 flex flex-row items-center gap-3">
                                <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center">
                                  <FolderIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm mb-1 truncate">
                                    {folder.name}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {folder?.some(
                    (f: SourceFilesFolder) => f.type === "file"
                  ) && (
                    <h2 className="text-sm font-semibold text-muted-foreground">
                      Files
                    </h2>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {folder?.map((file: SourceFilesFolder) => {
                      if (file.type === "file")
                        return (
                          <div
                            key={file._id}
                            className="relative flex flex-col w-full"
                          >
                            <Card className="shadow-none hover:bg-muted/50 transition-colors w-full border-border overflow-hidden">
                              <CardContent className="p-2">
                                <div className="relative w-full aspect-4/3 overflow-hidden rounded-lg border border-border bg-accent/50 group">
                                  {(() => {
                                    const kind = getFileKind(file.url || "");
                                    if (kind === "image" && file.url) {
                                      return (
                                        <Image
                                          src={file.url}
                                          alt={file.name}
                                          fill
                                          sizes="(max-width: 768px) 50vw, 33vw"
                                          className="object-cover"
                                        />
                                      );
                                    }
                                    if (kind === "pdf") {
                                      return (
                                        <div className="flex items-center justify-center w-full h-full">
                                          <PiFilePdfDuotone className="w-12 h-12 text-accent-foreground/40" />
                                        </div>
                                      );
                                    }
                                    if (
                                      kind === "word" ||
                                      kind === "docx" ||
                                      kind === "doc"
                                    ) {
                                      return (
                                        <div className="flex items-center justify-center w-full h-full">
                                          <PiFileDocDuotone className="w-12 h-12 text-accent-foreground/40" />
                                        </div>
                                      );
                                    }
                                    return (
                                      <div className="flex items-center justify-center w-full h-full">
                                        <PiFileDuotone className="w-12 h-12 text-accent-foreground/40" />
                                      </div>
                                    );
                                  })()}

                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      aria-label="Delete file"
                                      onClick={() =>
                                        setFileIdToDelete(file._id)
                                      }
                                      className="h-8 w-8 shadow-sm"
                                    >
                                      <PiTrashDuotone className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p
                                  className="mt-2 text-xs font-medium truncate px-1"
                                  title={file.name}
                                >
                                  {file.name}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <AlertDialog
        open={!!fileIdToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFileIdToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                if (!fileIdToDelete) return;
                deleteSourceFile.mutate(fileIdToDelete, {
                  onSuccess: () => {
                    setFileIdToDelete(null);
                  },
                });
              }}
              disabled={deleteSourceFile.isPending}
            >
              {deleteSourceFile.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
