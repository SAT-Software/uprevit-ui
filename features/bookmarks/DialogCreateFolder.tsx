import { useState } from "react";
import { FolderPlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DialogCreateFolderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (folderName: string) => void;
}

export default function DialogCreateFolder({
  open,
  onOpenChange,
  onCreateFolder,
}: DialogCreateFolderProps) {
  const [folderName, setFolderName] = useState("");

  const handleReset = () => {
    setFolderName("");
  };

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      onOpenChange(false);
      handleReset();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) handleReset();
      }}
    >
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlusIcon size={20} />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            Create a new folder to organize your bookmarked products.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-sm font-medium">
              Folder Name
            </Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && folderName.trim()) {
                  handleCreate();
                }
              }}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!folderName.trim()}>
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
