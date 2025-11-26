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
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { CircleAlert as CircleAlertIcon } from "lucide-react";

interface GraphicsItem {
  id: string;
}

export default function DeleteSymbolsSchematicsDialog({
  productId,
  graphics,
  open,
  onOpenChange,
}: {
  productId: string;
  graphics: GraphicsItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: deleteSymbol, isPending } = useUpdateProductTabData();

  async function handleConfirm() {
    try {
      const deleteData = {
        id: productId,
        action: "delete_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: graphics.id,
        },
      };

      deleteSymbol(deleteData, {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Failed to delete graphic:", error);
        },
      });
    } catch (error) {
      console.error("Failed to delete graphic:", error);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-start gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Delete Graphic</DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the graphic? This action cannot be
            undone.
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
              {isPending ? "Deleting..." : "Delete Graphic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
