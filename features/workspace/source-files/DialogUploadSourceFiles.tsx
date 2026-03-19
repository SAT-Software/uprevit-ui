import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import UploadSourceFiles from "@/features/workspace/source-files/UploadSourceFiles";
import { useUploadSourceFiles } from "@/hooks/source-files/useUploadSourceFiles";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { SourceFilesFolder } from "@/types/source-files";
import { useState } from "react";
import {
  PiCloudArrowUpDuotone,
  PiXCircleDuotone,
  PiUploadSimpleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

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
          folderId: folder._id,
          parentId: currentFolder._id,
        });
      }

      setIsDialogOpen(false);
      setSelectedFiles([]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <PiCloudArrowUpDuotone className="w-5 h-5" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiCloudArrowUpDuotone className="w-5 h-5 text-muted-foreground" />
              <p>Upload Source Files for {folder?.name}</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Upload source files for this product. You can drag and drop files or
            click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 flex-1 overflow-y-auto">
          <UploadSourceFiles
            onSelectionChange={setSelectedFiles}
            accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.psd,.ai"
          />
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDialogOpen(false)}
          >
            <PiXCircleDuotone className="mr-2" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUploadClick}
            disabled={!selectedFiles.length || isUploading}
          >
            {isUploading ? (
              <Spinner />
            ) : (
              <PiUploadSimpleDuotone className="mr-2" />
            )}
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
