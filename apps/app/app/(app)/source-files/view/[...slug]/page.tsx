"use client";

import { useAuth } from "react-oidc-context";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FolderAddIcon, Link05Icon } from "@hugeicons/core-free-icons";

import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import DialogDeleteSourceFile from "@/features/workspace/source-files/DialogDeleteSourceFile";
import DialogImagePreview from "@/features/workspace/source-files/DialogImagePreview";
import DialogDeleteSourceFilesFolder from "@/features/workspace/source-files/DialogDeleteSourceFilesFolder";
import DialogEditSourceFilesFolder from "@/features/workspace/source-files/DialogEditSourceFilesFolder";
import DialogUploadSourceFiles from "@/features/workspace/source-files/DialogUploadSourceFiles";
import SourceFilesFoldersCard from "@/features/workspace/source-files/SourceFilesFoldersCard";
import { SourceFilesItemsGrid } from "@/features/workspace/source-files/SourceFilesItemsGrid";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { useDeleteSourceFiles } from "@/hooks/source-files/useDeleteSourceFiles";
import { useGetBookmarkedSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmarkedSourceFilesFoldersByUserId";
import { useGetCurrentSourceFilesFolder } from "@/hooks/source-files/useGetCurrentSourceFilesFolder";
import { useGetSourceFilesFolderById } from "@/hooks/source-files/useGetSourceFilesFolderById";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import type { SourceFilesFolder } from "@/types/source-files";
import { Button } from "@uprevit/ui/components/ui/button";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string | null;
}

type ProductLinkItem = {
  _id: string;
  product_name?: string;
};

function FolderTitleIcon({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/Source-Files-Light-Folder.svg"
        alt=""
        width={24}
        height={20}
        className={cn("select-none object-contain dark:hidden", className)}
        draggable={false}
      />
      <Image
        src="/Source-Files-Dark-Folder.svg"
        alt=""
        width={24}
        height={20}
        className={cn(
          "hidden select-none object-contain dark:block",
          className,
        )}
        draggable={false}
      />
    </>
  );
}

export default function ProductSourceFilesPage() {
  const params = useParams<{ slug?: string[] }>();
  const folderId = params?.slug?.[0] ?? "";
  const deleteSourceFile = useDeleteSourceFiles(folderId);
  const [fileIdToDelete, setFileIdToDelete] = useState<string | null>(null);
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
    } catch {
      toast.error("Failed to download file. Please try again.");
    }
  };

  const { data, isLoading, isError, refetch } =
    useGetSourceFilesFolderById(folderId);
  const { data: currentFolderData } = useGetCurrentSourceFilesFolder(folderId);
  const { data: productsData } = useGetAllProducts();
  const products = (productsData?.result?.products ?? []) as ProductLinkItem[];
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;

  const { data: bookmarkedData } = useGetBookmarkedSourceFilesFoldersByUserId(
    userId as string,
  );

  const folder = data?.result;
  const currentFolder = currentFolderData?.result;
  const linkedProduct = products.find(
    (product) => product._id === currentFolder?.product_id,
  );

  const subfolders =
    folder?.filter((item: SourceFilesFolder) => item.type === "folder") ?? [];
  const files =
    folder?.filter((item: SourceFilesFolder) => item.type === "file") ?? [];

  const bookmarkedFolderIds = new Set(
    ((bookmarkedData?.result ?? []) as BookmarkedSourceFilesFolder[])
      .filter((item) => item.parentId === folderId)
      .map((item) => item._id),
  );

  const hasContent = subfolders.length > 0 || files.length > 0;

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="h-5 w-6 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center px-3 pt-4">
                <Skeleton className="h-[78px] w-[92px] rounded-xl" />
                <Skeleton className="mt-3 h-4 w-20" />
                <Skeleton className="mt-1.5 h-3 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
          <div className="flex min-w-0 items-center gap-2">
            <FolderTitleIcon />
            <p className="truncate text-sm font-medium text-muted-foreground">
              Folder
            </p>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <DashboardErrorState
            variant="panel"
            icon={FolderAddIcon}
            title="Failed to load folder"
            description="Something went wrong while fetching your source files. Please try again."
            className="min-h-[320px]"
          />
          <div className="mt-3 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="flex min-w-0 items-center gap-2">
          <FolderTitleIcon className="shrink-0" />
          <p className="truncate text-sm font-medium">
            {currentFolder?.name ?? "Folder"}
          </p>
          {currentFolder?.parentId == null && (
            <Badge variant="secondary">
              <Icon icon={Link05Icon} size={14} strokeWidth={2} />
              {linkedProduct?.product_name || "Not linked"}
            </Badge>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {currentFolder && (
            <DialogEditSourceFilesFolder
              currentFolder={currentFolder}
              folderId={folderId}
            />
          )}
          <DialogDeleteSourceFilesFolder
            id={currentFolder?._id ?? ""}
            folderName={currentFolder?.name ?? ""}
            folderId={folderId}
          />
          <DialogAddProductFolder
            parentId={currentFolder?._id}
            folderId={folderId}
          />
          <DialogUploadSourceFiles
            folder={currentFolder!}
            currentFolder={currentFolder!}
            folderId={folderId}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
              <Icon
                icon={FolderAddIcon}
                size={28}
                strokeWidth={1.75}
                className="text-muted-foreground/70"
              />
            </div>
            <div>
              <p className="text-sm font-medium">No source files yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload files or create a subfolder to get started.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <DialogAddProductFolder
                parentId={currentFolder?._id}
                folderId={folderId}
              />
              <DialogUploadSourceFiles
                folder={currentFolder!}
                currentFolder={currentFolder!}
                folderId={folderId}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {subfolders.length > 0 && (
              <SourceFilesFoldersCard
                folders={subfolders}
                variant="large"
                bookmarkedFolderIds={bookmarkedFolderIds}
              />
            )}

            {files.length > 0 && (
              <SourceFilesItemsGrid
                files={files}
                onPreviewImage={(url, name) => setPreviewImage({ url, name })}
                onDelete={setFileIdToDelete}
                onDownload={handleDownloadFile}
              />
            )}
          </div>
        )}
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
              f.type === "file" && f._id === fileIdToDelete,
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
