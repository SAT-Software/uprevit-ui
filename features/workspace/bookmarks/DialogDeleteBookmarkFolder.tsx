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
import {
  PiTrashDuotone,
  PiXCircleDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { useDeleteBookmarkFolder } from "@/hooks/bookmark/useDeleteBookmarkFolder";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
          <Button variant="destructive" size="sm">
            <PiTrashDuotone />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent/60 flex w-full justify-between items-center text-foreground">
            <div className="flex items-center gap-2">
              <PiTrashDuotone />
              <p>Delete Bookmark Folder</p>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer text-destructive/80 hover:text-destructive transition-colors"
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-4 p-4 border border-border bg-accent rounded-lg text-sm">
            <PiWarningCircleDuotone className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                You are about to delete the bookmark folder{" "}
                <span className="font-semibold text-foreground/80">
                  {folderName}
                </span>
                . This action cannot be undone and will remove all products from
                this folder.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor={inputId}>
                Type "
                <span className="font-semibold text-foreground/80">
                  {folderName}
                </span>
                " to confirm
              </Label>
              <Input
                id={inputId}
                type="text"
                placeholder={folderName}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className=""
              />
            </div>
          </form>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            disabled={isPending || value !== folderName}
            onClick={handleConfirm}
            variant="destructive"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <PiTrashDuotone className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Deleting..." : "Delete Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
