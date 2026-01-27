"use client";

import React, { useState } from "react";

import {
  ArchivedProductsTable,
  ProductArchiveRow,
} from "@/features/workspace/archive/products/ArchivedProductsTable";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedProducts } from "@/hooks/archive/useGetArchivedProducts";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";

export type ArchivedProductsProps = {
  onRowClick?: (row: ProductArchiveRow) => void;
};

export function ArchivedProducts({ onRowClick }: ArchivedProductsProps) {
  const { data: archivedProducts } = useGetArchivedProducts();
  const { mutate: updateProductStatus, isPending } = useUpdateProduct();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItemToRestore, setSelectedItemToRestore] =
    useState<ProductArchiveRow | null>(null);

  const handleRestoreClick = (row: ProductArchiveRow) => {
    if (!isAdmin) {
      toast.error("Insufficient privileges, contact Admin");
      return;
    }
    setSelectedItemToRestore(row);
    setRestoreDialogOpen(true);
  };

  const handleConfirmRestore = () => {
    if (!selectedItemToRestore) return;

    updateProductStatus(
      {
        _id: selectedItemToRestore._id,
        action: "update-status",
        data: {
          status: "draft",
        },
      },
      {
        onSuccess: () => setRestoreDialogOpen(false),
        onError: () => setRestoreDialogOpen(false),
      }
    );
  };

  const items: ProductArchiveRow[] = archivedProducts?.result?.products ?? [];

  return (
    <>
      <ArchivedProductsTable
        data={items}
        onRowClick={onRowClick}
        onRestore={handleRestoreClick}
        loadingRowId={isPending ? selectedItemToRestore?._id : null}
      />

      <RestoreEntityDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        entityName={selectedItemToRestore?.product_name || ""}
        onConfirm={handleConfirmRestore}
        isPending={isPending}
      />
    </>
  );
}

export default ArchivedProducts;
