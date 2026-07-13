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
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
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
      const deleteData = {
        id: productId,
        action: "delete_label_tags",
        tab: "label-tags",
        data: {
          id: labelTag._id,
        },
      };

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
        <Button
          size="icon-xs"
          variant="destructive"
          disabled={isSubmitted}
          aria-label="Delete label"
        >
          <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="flex w-full items-center justify-between border-b bg-destructive/10 px-4 py-4 text-sm">
            <div className="flex items-center gap-2 text-destructive">
              <Icon icon={Alert01Icon} size={16} strokeWidth={2} />
              <span>Delete Label</span>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <Icon icon={Cancel01Icon} size={18} strokeWidth={2} />
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
            <Icon icon={Cancel01Icon} />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant="destructive"
            size="sm"
          >
            {isPending ? <Spinner /> : <Icon icon={Delete02Icon} />}
            {isPending ? "Deleting..." : "Delete Label"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
