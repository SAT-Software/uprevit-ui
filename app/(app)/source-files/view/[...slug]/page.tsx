"use client";

import { useAuth } from "react-oidc-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import DialogDeleteSourceFile from "@/features/workspace/source-files/DialogDeleteSourceFile";
import DialogImagePreview from "@/features/workspace/source-files/DialogImagePreview";
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
  PiDownloadSimpleDuotone,
  PiFileDocDuotone,
  PiFileDuotone,
  PiFilePdfDuotone,
  PiGridFourDuotone,
  PiImageDuotone,
  PiListDuotone,
  PiSquareDuotone,
  PiTrashDuotone,
  PiWarningDuotone,
} from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string;
}

type FileKind = "image" | "pdf" | "word" | "docx" | "doc" | "other";

function getFileKind(fileNameOrUrl: string, fileName?: string): FileKind {
  // Check both the URL and the filename for extension detection
  const urlLower = (fileNameOrUrl || "").toLowerCase();
  const nameLower = (fileName || "").toLowerCase();

  // Helper to check if a string has an image extension
  const isImageExtension = (str: string) =>
    str.endsWith(".png") ||
    str.endsWith(".jpg") ||
    str.endsWith(".jpeg") ||
    str.endsWith(".webp") ||
    str.endsWith(".gif") ||
    str.endsWith(".bmp") ||
    str.endsWith(".tif") ||
    str.endsWith(".tiff");

  // Helper to check if a string has a PDF extension
  const isPdfExtension = (str: string) =>
    str.endsWith(".pdf") || str.includes("application/pdf");

  // Helper to check if a string has a Word extension
  const isWordExtension = (str: string) =>
    str.endsWith(".doc") ||
    str.endsWith(".docx") ||
    str.includes("application/msword") ||
    str.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

  // Check URL first, then filename
  if (isImageExtension(urlLower) || isImageExtension(nameLower)) {
    return "image";
  }
  if (isPdfExtension(urlLower) || isPdfExtension(nameLower)) {
    return "pdf";
  }
  if (isWordExtension(urlLower) || isWordExtension(nameLower)) {
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
  const [pendingFolderId, setPendingFolderId] = useState<string | null>(null);
  const [fileViewMode, setFileViewMode] = useState<"card" | "list" | "big">(
    "big"
  );
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const handleDownloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error("Failed to download file. Please try again.");
    }
  };

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

  const { mutate: toggleBookmark } = useToggleBookmarkSourceFilesFolder();

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
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {folder?.map((folder: SourceFilesFolder) => {
                      if (folder.type === "folder")
                        return (
                          <div
                            key={folder._id}
                            className="relative flex flex-col w-full max-w-xs rounded-xl"
                          >
                            <Card
                              className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors w-full border-border"
                              onClick={() =>
                                router.push(`/source-files/view/${folder._id}`)
                              }
                            >
                              <CardContent className="p-2 flex flex-row items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                                    <FolderIcon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm leading-tight line-clamp-2">
                                      {folder.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    aria-label="Toggle bookmark folder"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (userId) {
                                        setPendingFolderId(folder._id);
                                        toggleBookmark(
                                          {
                                            folderId: folder._id,
                                            userId: userId as string,
                                          },
                                          {
                                            onSettled: () =>
                                              setPendingFolderId(null),
                                          }
                                        );
                                      } else {
                                        toast.error(
                                          "User ID not available. Please log in again."
                                        );
                                      }
                                    }}
                                    disabled={pendingFolderId === folder._id}
                                    title="Bookmark folder"
                                  >
                                    {pendingFolderId === folder._id ? (
                                      <Spinner />
                                    ) : (
                                      <PiBookmarkSimpleDuotone className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                    })}
                  </div>
                </div>

                {/* Files Section */}
                {folder?.some((f: SourceFilesFolder) => f.type === "file") && (
                  <div className="flex flex-col gap-4 border-t border-border pt-4">
                    {/* Files Header with View Tabs */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-muted-foreground">
                        Files
                      </h2>
                      <Tabs
                        value={fileViewMode}
                        onValueChange={(value) =>
                          setFileViewMode(value as "card" | "list" | "big")
                        }
                      >
                        <TabsList>
                          <TabsTrigger value="card" title="Card View">
                            <PiGridFourDuotone className="w-4 h-4" />
                          </TabsTrigger>
                          <TabsTrigger value="list" title="List View">
                            <PiListDuotone className="w-4 h-4" />
                          </TabsTrigger>
                          <TabsTrigger value="big" title="Big Card View">
                            <PiSquareDuotone className="w-4 h-4" />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Card View */}
                    {fileViewMode === "card" && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                        {folder?.map((file: SourceFilesFolder) => {
                          if (file.type === "file")
                            return (
                              <div
                                key={file._id}
                                className="relative flex flex-col w-full group"
                              >
                                <Card className="shadow-none hover:bg-muted/50 transition-colors w-full border-border overflow-hidden">
                                  <CardContent className="p-1.5">
                                    <div className="relative w-full aspect-square overflow-hidden rounded-md border border-border bg-accent/50">
                                      {(() => {
                                        const kind = getFileKind(
                                          file.url || "",
                                          file.name
                                        );
                                        if (kind === "image" && file.url) {
                                          return (
                                            <Image
                                              src={file.url}
                                              alt={file.name}
                                              fill
                                              sizes="(max-width: 768px) 33vw, 10vw"
                                              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                              onClick={() =>
                                                setPreviewImage({
                                                  url: file.url!,
                                                  name: file.name,
                                                })
                                              }
                                            />
                                          );
                                        }
                                        if (kind === "pdf") {
                                          return (
                                            <div className="flex items-center justify-center w-full h-full">
                                              <PiFilePdfDuotone className="w-6 h-6 text-accent-foreground/40" />
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
                                              <PiFileDocDuotone className="w-6 h-6 text-accent-foreground/40" />
                                            </div>
                                          );
                                        }
                                        return (
                                          <div className="flex items-center justify-center w-full h-full">
                                            <PiFileDuotone className="w-6 h-6 text-accent-foreground/40" />
                                          </div>
                                        );
                                      })()}

                                      <div className="absolute top-1 right-1 flex gap-1">
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          size="icon"
                                          aria-label="Download file"
                                          onClick={() => {
                                            if (file.url) {
                                              handleDownloadFile(
                                                file.url,
                                                file.name
                                              );
                                            }
                                          }}
                                          className="h-6 w-6"
                                        >
                                          <PiDownloadSimpleDuotone className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          aria-label="Delete file"
                                          onClick={() =>
                                            setFileIdToDelete(file._id)
                                          }
                                          className="h-6 w-6 bg-destructive/20"
                                        >
                                          <PiTrashDuotone className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p
                                      className="mt-1 text-[10px] font-medium truncate"
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
                    )}

                    {/* List View */}
                    {fileViewMode === "list" && (
                      <div className="flex flex-col gap-1">
                        {folder?.map((file: SourceFilesFolder) => {
                          if (file.type === "file")
                            return (
                              <div
                                key={file._id}
                                className="flex items-center gap-3 p-2 rounded-lg bg-muted transition-colors group border border-border"
                              >
                                <div className="w-10 h-10 rounded-md border border-border bg-accent/50 flex items-center justify-center shrink-0 overflow-hidden">
                                  {(() => {
                                    const kind = getFileKind(
                                      file.url || "",
                                      file.name
                                    );
                                    if (kind === "image" && file.url) {
                                      return (
                                        <Image
                                          src={file.url}
                                          alt={file.name}
                                          width={40}
                                          height={40}
                                          className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                                          onClick={() =>
                                            setPreviewImage({
                                              url: file.url!,
                                              name: file.name,
                                            })
                                          }
                                        />
                                      );
                                    }
                                    if (kind === "pdf") {
                                      return (
                                        <PiFilePdfDuotone className="w-5 h-5 text-accent-foreground/40" />
                                      );
                                    }
                                    if (
                                      kind === "word" ||
                                      kind === "docx" ||
                                      kind === "doc"
                                    ) {
                                      return (
                                        <PiFileDocDuotone className="w-5 h-5 text-accent-foreground/40" />
                                      );
                                    }
                                    return (
                                      <PiFileDuotone className="w-5 h-5 text-accent-foreground/40" />
                                    );
                                  })()}
                                </div>
                                <p
                                  className="text-sm font-medium truncate flex-1"
                                  title={file.name}
                                >
                                  {file.name}
                                </p>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    aria-label="Download file"
                                    onClick={() => {
                                      if (file.url) {
                                        handleDownloadFile(file.url, file.name);
                                      }
                                    }}
                                    className="h-7 w-7 shadow-sm"
                                  >
                                    <PiDownloadSimpleDuotone className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    aria-label="Delete file"
                                    onClick={() => setFileIdToDelete(file._id)}
                                    className="h-7 w-7 shadow-sm"
                                  >
                                    <PiTrashDuotone className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            );
                        })}
                      </div>
                    )}

                    {/* Big Card View (Original) */}
                    {fileViewMode === "big" && (
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
                                        const kind = getFileKind(
                                          file.url || "",
                                          file.name
                                        );
                                        if (kind === "image" && file.url) {
                                          return (
                                            <Image
                                              src={file.url}
                                              alt={file.name}
                                              fill
                                              sizes="(max-width: 768px) 50vw, 33vw"
                                              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                              onClick={() =>
                                                setPreviewImage({
                                                  url: file.url!,
                                                  name: file.name,
                                                })
                                              }
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

                                      <div className="absolute top-2 right-2 flex gap-1">
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          size="icon"
                                          aria-label="Download file"
                                          onClick={() => {
                                            if (file.url) {
                                              handleDownloadFile(
                                                file.url,
                                                file.name
                                              );
                                            }
                                          }}
                                          className="h-8 w-8 shadow-sm"
                                        >
                                          <PiDownloadSimpleDuotone className="w-4 h-4" />
                                        </Button>
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
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <DialogDeleteSourceFile
        open={!!fileIdToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFileIdToDelete(null);
          }
        }}
        onConfirm={() => {
          if (!fileIdToDelete) return;
          deleteSourceFile.mutate(fileIdToDelete, {
            onSuccess: () => {
              setFileIdToDelete(null);
            },
          });
        }}
        isPending={deleteSourceFile.isPending}
        fileName={
          folder?.find(
            (f: SourceFilesFolder) =>
              f.type === "file" && f._id === fileIdToDelete
          )?.name
        }
      />
      <DialogImagePreview
        open={!!previewImage}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPreviewImage(null);
          }
        }}
        imageUrl={previewImage?.url || ""}
        fileName={previewImage?.name || ""}
        onDownload={
          previewImage
            ? () => handleDownloadFile(previewImage.url, previewImage.name)
            : undefined
        }
      />
    </div>
  );
}
