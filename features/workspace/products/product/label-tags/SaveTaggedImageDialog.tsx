"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  PiCloudArrowUpDuotone,
  PiInfoDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

interface SaveTaggedImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export default function SaveTaggedImageDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: SaveTaggedImageDialogProps) {
  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (isPending) return;
    try {
      await onConfirm();
    } catch (error) {
      console.error("Failed to save tagged image:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5"
        onEscapeKeyDown={(event) => {
          if (isPending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isPending) event.preventDefault();
        }}
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Save Tagged Image</p>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer"
                disabled={isPending}
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Save the annotated image to the cloud. This will update the label tag
          with the tagged version of the image.
        </DialogDescription>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <PiCloudArrowUpDuotone size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Upload Tagged Image</h4>
              <p className="text-sm text-muted-foreground">
                Your annotated image will be saved to the cloud and linked to
                this label tag.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PiInfoDuotone className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                What happens next
              </span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>
                The annotated image will be <strong>uploaded</strong> to cloud
                storage
              </li>
              <li>
                It will <strong>replace</strong> any previous tagged image
              </li>
              <li>
                The original label image will remain <strong>unchanged</strong>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <PiCloudArrowUpDuotone />}
            {isPending ? "Saving..." : "Yes, Save Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
