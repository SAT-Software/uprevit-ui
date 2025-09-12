"use client";

import { useId, useState } from "react";
import {
  CircleAlert as CircleAlertIcon,
  Trash2 as TrashIcon,
} from "lucide-react";

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

interface DialogDeleteSourceFilesFolderProps {
  id: string;
  folderName: string;
}

export default function DialogDeleteSourceFilesFolder({
  id,
  folderName,
}: DialogDeleteSourceFilesFolderProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const deleteFolder = useDeleteSourceFilesFolder();
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
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete folder"
          title="Delete folder"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-start gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Final confirmation
            </DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-xs text-muted-foreground">
            You are about to delete the folder <strong>{folderName}</strong>.
            This action cannot be undone.
          </p>
          <div className="space-y-4">
            <Label htmlFor={inputId} className="mb-1">
              Folder name
            </Label>
            <Input
              id={inputId}
              type="text"
              placeholder={`Type ${folderName} to confirm`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={deleteFolder.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {deleteFolder.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
