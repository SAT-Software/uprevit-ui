"use client";

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
import DialogAddProductFolder from "@/features/source-files/DialogAddProductFolder";
import DialogDeleteSourceFilesFolder from "@/features/source-files/DialogDeleteSourceFilesFolder";
import DialogEditSourceFilesFolder from "@/features/source-files/DialogEditSourceFilesFolder";
import DialogUploadSourceFiles from "@/features/source-files/DialogUploadSourceFiles";
import { useDeleteSourceFiles } from "@/hooks/source-files/useDeleteSourceFiles";
import { useGetCurrentSourceFilesFolder } from "@/hooks/source-files/useGetCurrentSourceFilesFolder";
import { useGetSourceFilesFolderById } from "@/hooks/source-files/useGetSourceFilesFolderById";
import { cn } from "@/lib/utils";
import type { SourceFilesFolder } from "@/types/source-files";
import { FolderIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  PiBookmarkSimpleDuotone,
  PiFileDocDuotone,
  PiFileDuotone,
  PiFilePdfDuotone,
  PiImageDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

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
  const deleteSourceFile = useDeleteSourceFiles();
  const router = useRouter();
  const [fileIdToDelete, setFileIdToDelete] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetSourceFilesFolderById(slug ?? "");
  const { data: currentFolderData } = useGetCurrentSourceFilesFolder(
    slug ?? ""
  );

  const folder = data?.result;
  const currentFolder = currentFolderData?.result; // TODO - Need to fix this in backend and here

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6">
          Loading folder...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6 text-destructive">
          Failed to load folder. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-muted border border-input flex items-center justify-center">
              <FolderIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-semibold">{currentFolder?.name}</p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <DialogEditSourceFilesFolder currentFolder={currentFolder} />
              <DialogDeleteSourceFilesFolder
                id={currentFolder?._id}
                folderName={currentFolder?.name}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DialogAddProductFolder parentId={currentFolder?._id} />
            <DialogUploadSourceFiles
              folder={folder}
              currentFolder={currentFolder}
            />
          </div>
        </div>

        {folder?.length === 0 ? (
          <Card className="w-full h-[calc(100vh-12rem)] flex items-center justify-center bg-background">
            <CardContent className="flex flex-col items-center gap-4 text-muted-foreground">
              <FolderIcon className="w-16 h-16" />
              <p className="text-lg">No source files uploaded yet</p>
              <p className="text-sm">
                Upload your first source file to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full">
            <div
              className={cn(
                "flex flex-col gap-2",
                folder?.some((f: SourceFilesFolder) => f.type === "folder") &&
                  "mb-8"
              )}
            >
              {folder?.some((f: SourceFilesFolder) => f.type === "folder") && (
                <p className="text-xs text-accent-foreground/70">Folders</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folder?.map((folder: SourceFilesFolder) => {
                  if (folder.type === "folder")
                    return (
                      <div
                        key={folder._id}
                        className="relative flex flex-col w-full max-w-xs rounded-2xl"
                      >
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle bookmark folder"
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   toggleBookmark.mutate({
                            //     folderId: folder._id,
                            //     userId,
                            //   });
                            // }}
                            // disabled={toggleBookmark.isPending}
                            title="Bookmark folder"
                          >
                            <PiBookmarkSimpleDuotone className="h-5 w-5" />
                          </Button>
                        </div>
                        <Card
                          className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors w-full"
                          onClick={() =>
                            router.push(`/source-files/view/${folder._id}`)
                          }
                        >
                          <CardContent className="p-4 flex flex-row items-center gap-3">
                            <div className="w-16 h-16 rounded-lg bg-muted border border-input flex items-center justify-center">
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
            <div className="flex flex-col gap-2">
              {folder?.some((f: SourceFilesFolder) => f.type === "file") && (
                <p className="text-xs text-accent-foreground/70">Files</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4">
                {folder?.map((file: SourceFilesFolder) => {
                  if (file.type === "file")
                    return (
                      <div
                        key={file._id}
                        className="relative flex flex-col w-full max-w-40 bg-accent/80 rounded-xl mx-auto"
                      >
                        <Card className="shadow-none hover:bg-muted/50 transition-colors w-full">
                          <CardContent className="p-2">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg border border-input">
                              {(() => {
                                const kind = getFileKind(file.url || "");
                                if (file.url) {
                                  return (
                                    <Image
                                      src={file.url}
                                      alt={file.name}
                                      fill
                                      sizes="10vw, 23vw"
                                      className="object-cover"
                                    />
                                  );
                                } else {
                                  <div className="flex items-center justify-center w-full h-full bg-accent">
                                    <PiImageDuotone className="w-15 h-15 text-accent-foreground/40" />
                                  </div>;
                                }
                                if (kind === "pdf") {
                                  return (
                                    <div className="flex items-center justify-center w-full h-full bg-accent">
                                      <PiFilePdfDuotone className="w-15 h-15 text-accent-foreground/40" />
                                    </div>
                                  );
                                }
                                if (
                                  kind === "word" ||
                                  kind === "docx" ||
                                  kind === "doc"
                                ) {
                                  return (
                                    <div className="flex items-center justify-center w-full h-full bg-accent">
                                      <PiFileDocDuotone className="w-15 h-15 text-accent-foreground/40" />
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flex items-center justify-center w-full h-full bg-accent">
                                    <PiFileDuotone className="w-15 h-15 text-accent-foreground/40" />
                                  </div>
                                );
                              })()}
                              <button
                                type="button"
                                aria-label="Delete file"
                                onClick={() => setFileIdToDelete(file._id)}
                                className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md p-1.5 bg-background/80 hover:bg-background text-muted-foreground border border-input shadow-sm"
                              >
                                <PiTrashDuotone className="w-4 h-4" />
                              </button>
                            </div>
                            <p
                              className="mt-2 text-xs font-medium truncate px-2"
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
          </div>
        )}
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
