"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  PiTrashDuotone,
  PiWarningCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

interface DialogDeleteSourceFileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  fileName?: string;
}

export default function DialogDeleteSourceFile({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  fileName,
}: DialogDeleteSourceFileProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-muted text-foreground flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiWarningCircleDuotone className="w-5 h-5 text-destructive" />
              <p>Delete File</p>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              {fileName ? (
                <>
                  the file <strong>{fileName}</strong>
                </>
              ) : (
                "this file"
              )}
              ?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. The file will be permanently
              deleted.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? <Spinner /> : <PiTrashDuotone />}
            {isPending ? "Deleting..." : "Delete File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
