"use client";

import { useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@uprevit/ui/components/ui/alert-dialog";
import { PiTrashDuotone, PiXCircleDuotone } from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  tagged_image?: string;
}

export default function DialogDeleteLabelTag({
  productId,
  labelTag,
  isSubmitted = false,
}: {
  productId: string;
  labelTag: LabelTagItem;
  isSubmitted?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteLabelTag, isPending } = useUpdateProductTabData();

  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
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

      deleteLabelTag(deleteData, {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          setOpen(false);
          console.error("Failed to delete label tag:", error);
        },
      });
    } catch (error) {
      console.error("Failed to delete label tag:", error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isSubmitted}>
          <PiTrashDuotone />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="border-b px-4 py-4 text-sm bg-destructive/10 flex w-full justify-between items-center">
            <div className="flex items-center gap-2 text-destructive">
              <PiTrashDuotone className="w-4 h-4" />
              <span>Delete Label</span>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <PiXCircleDuotone size={18} />
            </button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-4">
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This will permanently delete the label{" "}
            <span className="font-semibold text-foreground">
              &quot;{labelTag.name || "Untitled Label"}&quot;
            </span>{" "}
            data. This action cannot be undone.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            <PiXCircleDuotone />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant="destructive"
            size="sm"
          >
            {isPending ? <Spinner /> : <PiTrashDuotone />}
            {isPending ? "Deleting..." : "Delete Label"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
