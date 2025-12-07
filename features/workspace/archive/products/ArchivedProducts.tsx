"use client";

import React, { useState } from "react";

import {
  ArchivedProductsTable,
  ProductArchiveRow,
} from "@/features/workspace/archive/products/ArchivedProductsTable";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedProducts } from "@/hooks/archive/useGetArchivedProducts";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";

export type ArchivedProductsProps = {
  onRowClick?: (row: ProductArchiveRow) => void;
};

export function ArchivedProducts({ onRowClick }: ArchivedProductsProps) {
  const { data: archivedProducts } = useGetArchivedProducts();
  const { mutate: updateProductStatus, isPending } = useUpdateProduct();

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItemToRestore, setSelectedItemToRestore] =
    useState<ProductArchiveRow | null>(null);

  const handleRestoreClick = (row: ProductArchiveRow) => {
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
