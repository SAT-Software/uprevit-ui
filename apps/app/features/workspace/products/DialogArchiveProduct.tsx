import { useState } from "react";

import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Product } from "@/types/product";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { PiArchiveDuotone } from "react-icons/pi";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";
import {
  Alert01Icon,
  ArchiveIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

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
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  async function handleArchiveProduct(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
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
    <AppDialogContent
      title="Archive Product"
      description="Archive this product. This action can be undone later."
      variant="confirm-destructive"
      size="sm"
      confirmContent={{
        heading: "Are you sure?",
        message:
          "Are you sure you want to archive this product? This action can be undone later from the archive page.",
        icon: Alert01Icon,
      }}
      primaryAction={{
        label: "Archive Product",
        loadingLabel: "Archiving...",
        onClick: handleArchiveProduct,
        loading: isPending,
        disabled: isPending,
        icon: ArchiveIcon,
      }}
      secondaryAction={{
        label: "Cancel",
        disabled: isPending,
        icon: Cancel01Icon,
      }}
    />
  );

  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        {children || (
          <div
            className="focus:bg-accent hover:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"
            onClick={(e) => {
              if (!isAdmin) {
                e.preventDefault();
                e.stopPropagation();
                toast.warning("Insufficient privileges, contact Admin");
                return;
              }
            }}
          >
            <PiArchiveDuotone className="h-4 w-4 text-muted-foreground" />
            <span>Archive</span>
          </div>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
