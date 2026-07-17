"use client";

import { useState } from "react";
import { useAuth } from "react-oidc-context";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  UploadSquare01Icon,
} from "@hugeicons/core-free-icons";
import UploadSourceFiles from "@/features/workspace/source-files/UploadSourceFiles";
import { useUploadSourceFiles } from "@/hooks/source-files/useUploadSourceFiles";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { SourceFilesFolder } from "@/types/source-files";

export default function DialogUploadSourceFiles({
  folder,
  currentFolder,
  folderId,
}: {
  folder: SourceFilesFolder;
  currentFolder: SourceFilesFolder;
  folderId: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadToBackend } = useUploadSourceFiles(folderId);
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const auth = useAuth();
  const workspaceId = auth?.user?.profile?.workspaceId;

  const handleUploadClick = async () => {
    if (!selectedFiles.length) return;
    try {
      setIsUploading(true);
      for (const file of selectedFiles) {
        const s3UploadResult = await uploadFileToS3({
          file,
          contentType: file.type,
          uploadScope: "source-files",
        });

        await uploadToBackend({
          workspace_id: workspaceId as string,
          name: file.name,
          type: "file",
          key: s3UploadResult.key,
          sizeBytes: s3UploadResult.size,
          folderId: folder._id,
          parentId: currentFolder._id,
        });
      }

      setIsDialogOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    setIsDialogOpen(nextOpen);
    if (!nextOpen) {
      setSelectedFiles([]);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <Icon icon={UploadSquare01Icon} />
          Upload Files
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title={`Upload Source Files for ${folder?.name}`}
        description="Upload source files for this product. You can drag and drop files or click to browse."
        variant="form"
        className="sm:max-w-2xl"
        primaryAction={{
          label: "Upload Files",
          loadingLabel: "Uploading...",
          onClick: handleUploadClick,
          loading: isUploading,
          disabled: !selectedFiles.length || isUploading,
          icon: UploadSquare01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isUploading,
          icon: Cancel01Icon,
        }}
      >
        <div className="p-4">
          <UploadSourceFiles
            onSelectionChange={setSelectedFiles}
            accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.psd,.ai"
          />
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
