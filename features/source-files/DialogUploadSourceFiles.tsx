import { Button } from "@/components/ui/button";
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
import { useUploadSourceFiles } from "@/hooks/source-files/useUploadSourceFiles";
import { SourceFilesFolder } from "@/types/source-files";
import { uploadFiles } from "@/utils/uploadthing";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { useAuth } from "react-oidc-context";

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
  const auth = useAuth();
  const workspaceId = auth?.user?.profile?.workspaceId;

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

      for (const file of filesPayload) {
        await uploadToBackend({
          workspace_id: workspaceId as string,
          name: file.file_name,
          type: "file",
          url: file.url,
          folderId: folder._id,
          parentId: currentFolder._id,
        });
      }

      setIsDialogOpen(false);
      setSelectedFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
            Upload Source Files for {folder?.name}
          </DialogTitle>
          <DialogDescription>
            Upload source files for this product. You can drag and drop files or
            click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <UploadSourceFiles onSelectionChange={setSelectedFiles} />
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
  );
}
