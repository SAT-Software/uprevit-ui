"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteSourceFilesFolder } from "@/hooks/source-files/useDeleteSourceFilesFolder";
import {
  PiTrashDuotone,
  PiWarningCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

interface DialogDeleteSourceFilesFolderProps {
  id: string;
  folderName: string;
  folderId?: string;
}

export default function DialogDeleteSourceFilesFolder({
  id,
  folderName,
  folderId,
}: DialogDeleteSourceFilesFolderProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const deleteFolder = useDeleteSourceFilesFolder(folderId);
  const disabled = value !== folderName || deleteFolder.isPending;

  async function handleConfirm() {
    if (disabled) return;
    await deleteFolder.mutateAsync(id);
    setOpen(false);
    setValue("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <PiTrashDuotone className="h-5 w-5" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-destructive/10 text-destructive flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiWarningCircleDuotone className="w-5 h-5" />
              <p>Delete Folder</p>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer text-destructive hover:text-destructive/80"
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              You are about to delete the folder <strong>{folderName}</strong>.
              This action cannot be undone.
            </p>
            <p className="text-sm text-muted-foreground">
              Please type <strong>{folderName}</strong> to confirm.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={inputId} className="text-sm font-medium">
              Folder Name
            </Label>
            <Input
              id={inputId}
              type="text"
              placeholder={`Type ${folderName} to confirm`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border-destructive/30 focus-visible:ring-destructive/30"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="mr-2" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={disabled}
            onClick={handleConfirm}
          >
            {deleteFolder.isPending ? <Spinner /> : <PiTrashDuotone />}
            {deleteFolder.isPending ? "Deleting..." : "Delete Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
