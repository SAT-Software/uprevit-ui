"use client";

import { useState } from "react";
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
import { PiTrashDuotone } from "react-icons/pi";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
}

export default function DialogDeleteLabelTag({
  productId,
  labelTag,
}: {
  productId: string;
  labelTag: LabelTagItem;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteLabelTag, isPending } = useUpdateProductTabData();

  async function handleConfirm() {
    try {
      console.log("Deleting label tag:", labelTag._id);
      const deleteData = {
        id: productId,
        action: "delete_label_tags",
        tab: "label-tags",
        data: {
          id: labelTag._id,
        },
      };

      console.log("Deleting label tag:", deleteData);

      deleteLabelTag(deleteData);

      setOpen(false);
    } catch (error) {
      console.error("Failed to delete label tag:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <PiTrashDuotone className="h-4 w-4" />
          <span className="sr-only">Delete</span>
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
              Delete Label Tag
            </DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the label tag{" "}
            <strong>{labelTag.name || "Untitled Label Tag"}</strong>? This
            action cannot be undone.
          </p>
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
              {isPending ? "Deleting..." : "Delete Label Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
