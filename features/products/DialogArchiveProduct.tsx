import { ArchiveIcon, CircleAlertIcon } from "lucide-react";
import { useState } from "react";

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
import { Product } from "@/types/product";
import { useUpdateProduct } from "@/hooks/product/useUpdateproduct";

type ArchiveProductProps = Pick<Product, "_id">;

export default function DialogArchiveProduct({
  open,
  onOpenChange,
  product,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: ArchiveProductProps;
  children?: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const archiveProduct = useUpdateProduct();

  async function handleArchiveProduct(e: React.MouseEvent) {
    e.preventDefault();
    if (!product?._id) return;

    try {
      const updatedProductStatus = {
        ...product,
        action: "update-status",
        data: {
          status: "archived",
        },
      } as Product & { action: string; data: { status: string } };

      await archiveProduct.mutateAsync(updatedProductStatus);
      onOpenChange?.(false);
      setInternalOpen(false);
    } catch (error) {
      console.error("Failed to archive product:", error);
    }
  }

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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to archive this product? This action can
                be undone later.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiveProduct.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveProduct}
              disabled={archiveProduct.isPending}
            >
              {archiveProduct.isPending ? "Archiving..." : "Archive Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={internalOpen} onOpenChange={setInternalOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent text-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground">
            <ArchiveIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Archive</span>
          </div>
        )}
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this product? This action can be
              undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={archiveProduct.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchiveProduct}
            disabled={archiveProduct.isPending}
          >
            {archiveProduct.isPending ? "Archiving..." : "Archive Product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
