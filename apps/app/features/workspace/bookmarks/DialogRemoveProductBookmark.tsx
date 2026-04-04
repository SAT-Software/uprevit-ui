import { useState } from "react";
import {
  PiBookmarkSimpleDuotone,
  PiWarningCircleDuotone,
  PiXCircleDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { useAuth } from "react-oidc-context";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { useRemoveProductBookmark } from "@/hooks/bookmark/useRemoveProductBookmark";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

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
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;

  async function handleRemoveProductBookmark() {
    removeProductBookmark(
      {
        user_id: userId as string,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <PiTrashDuotone className="h-4 w-4" />
          Remove Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent/60 flex w-full justify-between items-center text-foreground">
            <div className="flex items-center gap-2">
              <PiBookmarkSimpleDuotone size={18} />
              <p>Remove from Bookmarks</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer text-foreground">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-4 p-4 border border-accent bg-accent rounded-lg text-sm text-foreground">
            <PiWarningCircleDuotone className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Confirm Removal</p>
              <p className="text-muted-foreground">
                Are you sure you want to remove{" "}
                <span className="font-semibold">{productName}</span> from this
                bookmark folder?
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button variant="secondary" size="sm" disabled={isPending}>
              <PiXCircleDuotone className="mr-2 w-4 h-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRemoveProductBookmark}
            disabled={isPending}
            variant="destructive"
            size="sm"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <PiTrashDuotone className="mr-2 w-4 h-4" />
            )}
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
