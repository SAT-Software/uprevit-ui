"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadSourceFiles from "@/features/source-files/UploadSourceFiles";
import { useDeleteSourceFiles } from "@/hooks/source-files/useDeleteSourceFiles";
import { useGetSourceFilesFolderById } from "@/hooks/source-files/useGetSourceFilesFolderById";
import { useUploadSourceFiles } from "@/hooks/source-files/useUploadSourceFiles";
import type { SourceFilesFolder } from "@/types/source-files";
import { uploadFiles } from "@/utils/uploadthing";
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
  PiPlusBold,
  PiTrashDuotone,
} from "react-icons/pi";
import DialogDeleteSourceFilesFolder from "@/features/source-files/DialogDeleteSourceFilesFolder";
import { useGetCurrentSourceFilesFolder } from "@/hooks/source-files/useGetCurrentSourceFilesFolder";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadToBackend = useUploadSourceFiles();
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

  const handleUploadClick = async () => {
    if (!selectedFiles.length) return;
    try {
      console.log("selectedFiles", selectedFiles);
      setIsUploading(true);
      const utRes = await uploadFiles("imageUploader", {
        files: selectedFiles,
      });

      // Map UploadThing response to backend format
      type UploadThingFile = {
        name?: string;
        fileName?: string;
        key?: string;
        url?: string;
        ufsUrl?: string;
        fileUrl?: string;
      };
      const filesPayload = (
        Array.isArray(utRes) ? (utRes as UploadThingFile[]) : []
      )
        .map((f) => {
          const name = f?.name ?? f?.fileName ?? f?.key ?? "file";
          const url = f?.url ?? f?.ufsUrl ?? f?.fileUrl;
          if (!url) return null;
          return { file_name: name as string, url: url as string };
        })
        .filter(Boolean) as { file_name: string; url: string }[];

      if (!filesPayload.length) {
        throw new Error("No uploaded file URLs returned");
      }

      await uploadToBackend.mutateAsync({
        folderId: slug,
        files: filesPayload,
      });

      setIsDialogOpen(false);
      setSelectedFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-6 h-6 text-primary" />
            <div className="flex flex-col">
              <p className="text-base font-semibold">{currentFolder?.name}</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                Upload Source File <PiPlusBold />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderIcon className="w-5 h-5" />
                  Upload Source Files for {folder?.folder_name}
                </DialogTitle>
                <DialogDescription>
                  Upload source files for this product. You can drag and drop
                  files or click to browse.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <UploadSourceFiles onSelectionChange={setSelectedFiles} />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadClick}
                  disabled={!selectedFiles.length || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                              if (kind === "image" && file.url) {
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
                        <div onClick={(e) => e.stopPropagation()}>
                          <DialogDeleteSourceFilesFolder
                            id={folder._id}
                            folderName={folder.name}
                          />
                        </div>
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
