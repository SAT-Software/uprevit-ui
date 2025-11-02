"use client";

import { useId, useState } from "react";
import { CircleAlert as CircleAlertIcon } from "lucide-react";
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
import { PiTrashDuotone } from "react-icons/pi";
import { useDeleteBookmarkFolder } from "@/hooks/bookmark/useDeleteBookmarkFolder";
import { useRouter } from "next/navigation";

interface DialogDeleteBookmarkFolderProps {
  folderId: string;
  folderName: string;
  trigger?: React.ReactElement;
}

export default function DialogDeleteBookmarkFolder({
  folderId,
  folderName,
  trigger,
}: DialogDeleteBookmarkFolderProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteFolder, isPending } = useDeleteBookmarkFolder();

  function handleConfirm() {
    deleteFolder(folderId, {
      onSuccess: () => {
        router.push("/bookmarked-products");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <PiTrashDuotone className="h-4 w-4" />
          </Button>
        )}
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
              Delete Bookmark Folder
            </DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-xs text-muted-foreground">
            You are about to delete the bookmark folder{" "}
            <strong>{folderName}</strong>. This action cannot be undone and will
            remove all products from this folder.
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
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1"
              disabled={isPending}
              onClick={handleConfirm}
              variant="destructive"
            >
              {isPending ? "Deleting..." : "Delete Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
