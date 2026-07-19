"use client";

import { useState } from "react";
import { useAuth } from "react-oidc-context";

import { useRemoveProductBookmark } from "@/hooks/bookmark/useRemoveProductBookmark";
import {
  Alert01Icon,
  BookmarkMinus01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";

interface DialogRemoveProductBookmarkProps {
  productId: string;
  productName: string;
  folderId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export default function DialogRemoveProductBookmark({
  productId,
  productName,
  folderId,
  open,
  onOpenChange,
}: DialogRemoveProductBookmarkProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };
  const { mutate: removeProductBookmark, isPending } =
    useRemoveProductBookmark();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;

  function handleRemoveProductBookmark() {
    removeProductBookmark(
      {
        user_id: userId as string,
        product_id: productId,
        folder_id: folderId,
      },
      {
        onSuccess() {
          handleOpenChange(false);
        },
        onError(error) {
          handleOpenChange(false);
          console.error(
            "Failed to remove product from bookmark folder:",
            error,
          );
        },
      },
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="group"
          onClick={(event) => event.stopPropagation()}
        >
          <Icon
            icon={BookmarkMinus01Icon}
            className="text-destructive/60 group-hover:text-destructive"
          />
        </Button>
      </DialogTrigger>

      <AppDialogContent
        title="Remove from Bookmarks"
        description={`Remove ${productName} from this bookmark folder.`}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Confirm removal",
          message: (
            <>
              Are you sure you want to remove{" "}
              <strong>{productName}</strong> from this bookmark folder?
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Remove",
          loadingLabel: "Removing...",
          onClick: handleRemoveProductBookmark,
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
