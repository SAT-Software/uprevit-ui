"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { PiTrashDuotone, PiXCircleDuotone } from "react-icons/pi";

interface GraphicsItem {
  id: string;
  componentName?: string;
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

  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
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
        onError: () => {
          onOpenChange(false);
        },
      });
    } catch (error) {
      console.error("Failed to delete graphic:", error);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="border-b px-4 py-4 text-sm bg-destructive/10 flex w-full justify-between items-center">
            <div className="flex items-center gap-2 text-destructive">
              <PiTrashDuotone className="w-4 h-4" />
              <span>Delete Graphic</span>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <PiXCircleDuotone size={18} />
            </button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-4">
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This will permanently delete the graphic
            {graphics.componentName && (
              <>
                {" "}
                <span className="font-semibold text-foreground">
                  &quot;{graphics.componentName}&quot;
                </span>
              </>
            )}
            . This action cannot be undone.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
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
            <PiTrashDuotone />
            {isPending ? "Deleting..." : "Delete Graphic"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
