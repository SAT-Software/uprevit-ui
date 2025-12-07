import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import {
  PiArchiveDuotone,
  PiWarningCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

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
  const { mutate: archiveProduct, isPending } = useUpdateProduct();

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
      };

      archiveProduct(updatedProductStatus, {
        onSuccess: () => {
          onOpenChange?.(false);
          setInternalOpen(false);
        },
        onError: (error) => {
          console.error(error);
        },
      });
    } catch (error) {
      console.error("Failed to archive product:", error);
    }
  }

  const dialogContent = (
    <>
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
          <p>Archive Product</p>
          <DialogClose asChild>
            <button type="button" className="cursor-pointer">
              <PiXCircleDuotone size={18} />
            </button>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">
        Archive this product. This action can be undone later.
      </DialogDescription>
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500"
            aria-hidden="true"
          >
            <PiWarningCircleDuotone size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Are you sure?</h4>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to archive this product? This action can be
              undone later from the archive page.
            </p>
          </div>
        </div>
      </div>
      <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
          >
            <PiXCircleDuotone />
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={handleArchiveProduct}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <PiArchiveDuotone />}
          {isPending ? "Archiving..." : "Archive Product"}
        </Button>
      </DialogFooter>
    </>
  );

  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        {children || (
          <div className="focus:bg-accent hover:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
            <PiArchiveDuotone className="h-4 w-4 text-muted-foreground" />
            <span>Archive</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
