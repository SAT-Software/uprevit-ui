"use client";

import React, { useState } from "react";
import { PiArchiveDuotone, PiStackPlusDuotone } from "react-icons/pi";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArchivedProductsTable,
  ProductArchiveRow,
} from "@/features/archive/products/ArchivedProductsTable";
import { RestoreEntityDialog } from "@/features/archive/RestoreEntityDialog";
import { useGetArchivedProducts } from "@/hooks/archive/useGetArchivedProducts";
import { useUpdateProduct } from "@/hooks/product/useUpdateproduct";

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
      <Card className="bg-background border rounded-xl shadow-none">
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border">
              <PiArchiveDuotone className="size-4 opacity-80" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Archived Products</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Manage and restore archived products when needed.
              </p>
            </div>
          </div>
          <PiStackPlusDuotone
            className="size-5 opacity-70"
            aria-hidden="true"
          />
        </div>
        <Separator />
        <div className="p-5">
          <ArchivedProductsTable
            data={items}
            onRowClick={onRowClick}
            onRestore={handleRestoreClick}
          />
        </div>
      </Card>

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
