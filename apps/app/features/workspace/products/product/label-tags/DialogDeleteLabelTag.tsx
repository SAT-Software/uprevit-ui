"use client";

import { useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useProductAccess } from "@/hooks/product/useProductAccess";

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
  isContentLocked = false,
}: {
  productId: string;
  labelTag: LabelTagItem;
  isContentLocked?: boolean;
}) {
  const { lockedMessage } = useProductAccess();
  const [open, setOpen] = useState(false);
  const { mutate: deleteLabelTag, isPending } = useUpdateProductTabData();

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="inline-flex"
            tabIndex={isContentLocked ? 0 : undefined}
          >
            <DialogTrigger asChild>
              <Button
                size="icon-xs"
                variant="destructive"
                disabled={isContentLocked}
                aria-label="Delete label"
              >
                <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
              </Button>
            </DialogTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isContentLocked
            ? lockedMessage
            : "Delete label"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Delete Label"
        description="Delete this label. This action cannot be undone."
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Are you sure?",
          message: (
            <>
              This will permanently delete the label{" "}
              <span className="font-semibold text-foreground">
                &quot;{labelTag.name || "Untitled Label"}&quot;
              </span>{" "}
              data. This action cannot be undone.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Label",
          loadingLabel: "Deleting…",
          onClick: handleConfirm,
          loading: isPending,
          disabled: isPending,
          icon: Delete02Icon,
          variant: "destructive",
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      />
    </Dialog>
  );
}
