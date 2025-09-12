import { useState } from "react";
import { CircleAlertIcon } from "lucide-react";
import { PiBookmarkSimpleDuotone } from "react-icons/pi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRemoveProductBookmark } from "@/hooks/bookmark/useRemoveProductBookmark";

interface DialogRemoveProductBookmarkProps {
  productId: string;
  productName: string;
  folderId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DialogRemoveProductBookmark({
  productId,
  productName,
  folderId,
  open,
  onOpenChange,
}: DialogRemoveProductBookmarkProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const removeProductBookmark = useRemoveProductBookmark();

  async function handleRemoveProductBookmark(e: React.MouseEvent) {
    e.preventDefault(); // Prevent AlertDialogAction's auto-close
    if (!productId || !folderId) return;

    try {
      await removeProductBookmark.mutateAsync({
        productId,
        folderId,
      });
      // Close dialog in both controlled and uncontrolled modes
      onOpenChange?.(false);
      setInternalOpen(false);
    } catch (error) {
      console.error("Failed to remove product from bookmark:", error);
    }
  }

  // If external state control is provided, use controlled mode
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlertIcon className="opacity-80" size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove from bookmarks?</AlertDialogTitle>
              <AlertDialogDescription>
                {`Are you sure you want to remove "${productName}" from this
                bookmark folder? This action cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeProductBookmark.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveProductBookmark}
              disabled={removeProductBookmark.isPending}
            >
              {removeProductBookmark.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Original trigger-based mode
  return (
    <AlertDialog open={internalOpen} onOpenChange={setInternalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <PiBookmarkSimpleDuotone className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from bookmarks?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to remove "${productName}" from this bookmark
                folder?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeProductBookmark.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveProductBookmark}
            disabled={removeProductBookmark.isPending}
          >
            {removeProductBookmark.isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
