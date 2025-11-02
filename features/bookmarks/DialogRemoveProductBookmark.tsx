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
}: DialogRemoveProductBookmarkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: removeProductBookmark, isPending } =
    useRemoveProductBookmark();

  async function handleRemoveProductBookmark() {
    removeProductBookmark(
      {
        user_id: "68d2b37127794dcb43a32425",
        product_id: productId,
        folder_id: folderId,
      },
      {
        onSuccess() {
          setIsOpen(false);
        },
        onError(error) {
          setIsOpen(false);
          console.error(
            "Failed to remove product from bookmark folder:",
            error
          );
        },
      }
    );
  }

  // Original trigger-based mode
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveProductBookmark}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
